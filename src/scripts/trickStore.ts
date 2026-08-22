import { defineStore } from "pinia";
import { checkSpace, getNodeIdxById, getSpaceIdx, graphSearch, isReleased, trickToNode, getSortedTricks, getFilteredTricks, getCategorySizes, list2Trick } from "@/scripts/helpers";
import { useCategoryStore, useMasteredStore, useSelSortingOrderStore} from "@/scripts/store";
import tricks from "@/data/tricks.json"

import type { Node, Edge } from '@vue-flow/core'  

export interface Trick {
    trickID: string
    title: Array<string>;
    difficulty: number;
    category: string,
    releaseDate: Date,
    videoID: Array<string>,
    requirements: Array<string>,
    connections: Array<string>
  }

type Graph = [Array<Node>, Array<Edge>];

export interface TrickNode {
    name: string,
    children: Array<TrickNode>,
    orientation?: number,
    difficulty?: number,
    width?: number,
    height?: number
}

export const useTrickStore = defineStore('trickStore', {
    state: () => ({
        tricks: [] as Array<Trick>,
        categoryTree: [[], []] as Graph,
        trickTree: [[], []] as Graph,
        newestTrick: null as Trick | null,
    }),
    getters: {
        shownTricks(state) {
            const selSortingOrderStore = useSelSortingOrderStore()
            const sorted = getSortedTricks(state.tricks, selSortingOrderStore.by)
            const filtered = getFilteredTricks(sorted)
            return filtered
        },
        getHardestMasteredTrick: (state) => (masteredTricks: Array<Trick>) => {
            if (!masteredTricks?.length) return null;
            
            // Filter mastered tricks from ALL tricks
            const mastered = state.tricks.filter(trick => 
            masteredTricks.some(m => m.trickID === trick.trickID)
            );
            
            // Sort by difficulty descending
            return [...mastered].sort((a, b) => b.difficulty - a.difficulty)[0] || null;
        }
    },
    actions: {
        async loadTricks(): Promise<boolean> {
            for (let i = 0; i < tricks.length; i++) {
                const trick = Object.assign(
                    tricks[i], 
                    {
                        releaseDate: new Date(tricks[i].releaseDate),
                        category: tricks[i].category.toLowerCase()
                    }) as Trick;
                if(isReleased(trick))
                    this.tricks.push(trick);
                else
                    console.log(trick.title[0], 'not released')
            }

            // find the newest trick
            const tmp = this.tricks.slice()
            const newestTrick = tmp.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return b.releaseDate.getTime() - a.releaseDate.getTime();
            })[0];

            //helper for datetime one month ago
            const d = new Date();
            d.setMonth(d.getMonth()-1);
            // set newestTrick Tag if max 1 month-old
            if(newestTrick.releaseDate >= d) {
                this.newestTrick = newestTrick;
            }
            return true;
        },
        getThumbnailUrl(videoId: string): string {
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        },
        getTrickByID(trickID: string): Trick | null {
            for (let i = 0; i < this.tricks.length; i++) {
                if(this.tricks[i].trickID === trickID) {
                    return this.tricks[i];
                }
            }
            return null;
        },
        getTrickByTitle(trickTitle: string): Trick | null {
            try {
                for (let i = 0; i < this.tricks.length; i++) {
                    if(this.tricks[i].title[0] === trickTitle) {
                        return this.tricks[i];
                    }
                }
                return null;
            }
            catch(e) {
                console.log(e)
                return null;
            }
        },
        getLocalTrickTitles(trick: Trick, lang: string): Array<string> {
            let res: Array<string> = [];
            for (let i = 0; i < trick.title.length; i++) {
                // only add locale alias when current language
                if(trick.title[i].includes('{')) {
                    if(trick.title[i].substring(0, 2) === lang) {
                        res.push(trick.title[i].substring(3, trick.title[i].length - 1))
                    }
                }
                // add non language specific aliases
                else {
                    res.push(trick.title[i]);
                }
            }
            return res;
        },
        getTitlesStr(lang: string): Array<string> {
            let res = [];
            for (let i = 0; i < this.tricks.length; i++) {
                const localTitles = this.getLocalTrickTitles(this.tricks[i], lang)
                res.push(localTitles);

                // add alias when hyphen in name
                // only one title available
                if(localTitles.length == 1) {
                    if(localTitles[0].includes("-")) {
                        res.push(localTitles[0].replace("-", " "));
                    }
                }
                // multiple titles
                else {
                    for (let j = 0; j < localTitles.length; j++) {
                        if(localTitles[j].includes("-")) {
                            res.push(localTitles[j].replace("-", " "));
                        }
                    }
                }
            }
            return res.flat();
        },
        getConnectionsGraph(orientation: string): Graph {
            // compute full graph for positioning
            let graph: Array<TrickNode> = [{name: "Categories", children: []}];
            const categoryStore = useCategoryStore();
            const categories = categoryStore.categories;

            // Create category map for faster lookup
            const categoryMap = new Map();
            for (let i = 0; i < categories.length; i++) {
                const categoryNode = { name: categories[i], children: [] };
                graph[0].children.push(categoryNode);
                categoryMap.set(categories[i], categoryNode);
            }

            let tricks = null;
            // check if videos already loaded from YAML
            if (this.tricks !== undefined) {
                tricks = this.tricks;
            }
            else {
                this.loadTricks()
                tricks = this.tricks
            }

            const catSizes = getCategorySizes(tricks)

            const visitedIDs = new Set();
            for (let i = 0; i < tricks.length; i++) {
                if(!visitedIDs.has(tricks[i].trickID)) {
                    const categoryNode = categoryMap.get(tricks[i].category);
                    categoryNode.children.push(trickToNode(tricks[i]));
                    // add connections if base trick and mark variants as visited
                    if(tricks[i].connections.length > 0) {
                        for (let j = 0; j < tricks[i].connections.length; j++) {
                            try {
                                categoryNode.children.at(-1).children.push(trickToNode(this.getTrickByID(tricks[i].connections[j])!));
                                visitedIDs.add(tricks[i].connections[j]);
                            } catch (e) {
                                console.log(`${tricks[i].connections[j]} not available`);
                            }
                        }
                    }
                }
            }
            // convert graph to flow chart
            function convGraph(nodes: Array<Node>, edges: Array<Edge>, parent: Node | null, g_node: TrickNode, g_parent: TrickNode | null): Graph {
                const categoryIdx = categories.indexOf(g_node.name);
                const splitIdx = 2;
                // category node
                if(categoryIdx !== -1) {
                    const prev_idx = g_parent ? g_parent.children.indexOf(g_node) - 1 : -1;

                    nodes.push({
                        id: g_node.name,
                        type: 'category',
                        // root node + x_offset scaled
                        position: { 
                            x: ((categoryIdx < splitIdx) ? -100 : 100) * xScaleFactor,
                            // if first in column -1500, else scaled to amount of tricks in category under previous node
                            y: ((prev_idx >= 0 && categoryIdx !== splitIdx) ? 
                                nodes[getNodeIdxById(g_parent!.children[prev_idx].name, nodes)].position.y + catSizes[categoryIdx] * 60
                                : -1500)
                                // children.length + prev.children.length if exists / 2 * 100
                                + ((g_node.children.length +
                                    ((prev_idx >= 0) ? g_parent!.children[prev_idx].children.length : 0)) / 2) * 100},
                        data: {
                            label: g_node.name,
                            n_children: 0,
                            // split left right
                            orientation: (categoryIdx < splitIdx) ? 3 : 1,
                            color: categoryStore.getColor(g_node.name)
                        }});
                }
                // trick node
                else if(parent && g_parent) {
                    const prev_idx = g_parent.children.indexOf(g_node) - 1;
                    nodes.push({
                        id: g_node.name,
                        type: 'clickable',
                        // parent.x +- 700 scaled +- text_offset offset according to side
                        position: { x: parent.position.x + ((parent.data.orientation === 3) ? -300 * xScaleFactor -
                                // text_offset offset according to side and orientation
                                (g_node.name.length * ((orientation === 'Portrait') ? 8 : 25)) :
                                300 * xScaleFactor),
                            // offset to prev node of parent
                            y: (prev_idx >= 0) ? nodes[getNodeIdxById(g_parent.children[prev_idx].name, nodes)].position.y + 100 +
                                // + offset to previous node if present and space for own children
                                ((g_node.children.length > 0) ? (Math.max(0, g_parent.children[prev_idx].children.length - 1)) * 100 : 0)
                                // parent.y - space for children
                                : parent.position.y - ((g_parent.children.length - 1) / 2) * 100
                        },
                        data: {
                            label: g_node.name,
                            n_children: 0,
                            orientation: parent.data.orientation,
                            color: parent.data.color
                        }});
                    edges.push({
                        id: g_parent.name + '->' + g_node.name,
                        source: g_parent.name,
                        target: g_node.name,
                        style: { stroke: 'black', strokeWidth: 3}});
                }
                for (let i = 0; i < g_node.children.length; i++) {
                    const [t_nodes, t_edges] = convGraph(nodes, edges, nodes[getNodeIdxById(g_node.name, nodes)], g_node.children[i], g_node)
                    nodes.concat(t_nodes);
                    edges.concat(t_edges);
                }
                return [nodes, edges];
            }

            let nodes: Array<Node<any>> = [];
            let edges: Array<Edge> = [];
            const xScaleFactor = (orientation === 'Portrait') ? 1 : 3;
            // compute num children for categories
            const num_children = new Array(categories.length).fill(0);
            for (let i = 0; i < tricks.length; i++) {
                num_children[categories.indexOf(tricks[i].category)]++;
            }

            [nodes, edges] = convGraph(nodes, edges, null, graph[0], null) as Graph


            return [nodes, edges];
        },
        getTrickTreeGraph(orientation: string): Graph {
            // generate base graph
            let graph = [{name: "root", children: []} as TrickNode];
            let visitedIDs: Array<string> = [];
            let i = 0;

            let tricks = null;
            // check if videos already loaded from YAML
            if (this.tricks !== undefined) {
                tricks = this.tricks;
            }
            else {
                this.loadTricks()
                tricks = this.tricks
            }

            tricks.sort((a, b) => {
                if (a.category < b.category) {
                    return -1;  // a comes before b
                }
                if (a.category > b.category) {
                    return 1;   // a comes after b
                }
                return 0;       // a and b are equal
            });
            while (visitedIDs.length <= tricks.length) {
                if(!visitedIDs.includes(tricks[i].trickID)) {
                    // check if requirements exist
                    if(tricks[i].requirements.length > 0) {
                        for (let j = 0; j < tricks[i].requirements.length; j++) {
                            try {
                                const parent = graphSearch(this.getTrickByID(tricks[i].requirements[j])!.title[0], graph[0]);
                                if(parent != null) {
                                    parent.children.push(trickToNode(tricks[i]));
                                    visitedIDs.push(tricks[i].trickID);
                                }
                            }
                            catch (e) {
                                console.log(`${tricks[i].requirements[j]} not available`)
                                visitedIDs.push(tricks[i].trickID);
                            }
                        }
                    }
                    // start new subtree
                    else {
                        // decide if left or right
                        graph[0].children.push(trickToNode(tricks[i], 2));
                        visitedIDs.push(tricks[i].trickID);
                    }
                }
                i = (i + 1) % tricks.length;tricks
            }

            // calculate tree widths and height
            function calcTreeSpace(node: TrickNode): [number, number] {
                if(!node.difficulty) 
                    throw Error("node missing difficulty for tree space calculation" + node.name);
                if(node.children.length > 0) {
                    let max_children = node.children.length;
                    let max_difficulty = node.difficulty!;
                    for (let j = 0; j < node.children.length; j++) {
                        const [tmp_children, tmp_difficulty] = calcTreeSpace(node.children[j])
                        max_children = Math.max(max_children, tmp_children);
                        max_difficulty = Math.max(max_difficulty, tmp_difficulty);
                    }
                    return [max_children, max_difficulty];
                }
                else {
                    return [1, node.difficulty!];
                }
            }
            // calc root tree height and max width
            let total_width = 0;
            for (let j = 0; j < graph[0].children.length; j++) {
                if(!graph[0].children[j].difficulty) 
                    throw Error("node missing difficulty for tree height/width calculation" + graph[0].children[j].name);
                let max_difficulty = graph[0].children[j].difficulty;
                [graph[0].children[j].width, max_difficulty] = calcTreeSpace(graph[0].children[j]);
                graph[0].children[j].height = max_difficulty - graph[0].children[j].difficulty! + 1;
                total_width += graph[0].children[j].width!;
            }

            // 2d array for allocating spaces
            const rows = total_width + 1;
            let spaces = Array(5).fill(false).map(() => Array(rows).fill(false));
            // place root nodes in allocation array
            for (let i = 0; i < graph[0].children.length; i++) {
                const node = graph[0].children[i];

                if(!node.difficulty) 
                    throw Error("node missing difficulty for tree height/width calculation" + node.name);
                if(!node.width) 
                    throw Error("node missing width for tree height/width calculation" + node.name);
                if(!node.height) 
                    throw Error("node missing height for tree height/width calculation" + node.name);

                for (let col = 0; col < rows; col++) {
                    // if space free and wide enough
                    if(checkSpace(node.difficulty! - 1, col, node.width, node.height, spaces)) {
                        // mark space as used
                        for (let x = col; x < col + node.width!; x++) {
                            for (let y = node.difficulty! - 1; y < node.difficulty! + node.height! - 1; y++) {
                                spaces[y][x] = true;
                            }
                        }
                        spaces[node.difficulty! - 1][Math.floor(col + (node.width! / 2))] = node.name;
                        break;
                    }
                    else if(col === rows - 1) {
                        console.log(node.name, ' did not fit')
                    }
                }
            }

            // convert to Flow Chart
            const convGraph = (nodes: Array<Node>, edges: Array<Edge>, parent: Node | null, g_node: TrickNode, g_parent: TrickNode | null): Graph => {
                // child node
                if(parent && g_parent && g_parent.name !== 'root') {
                    if(!g_node.difficulty) 
                        throw Error("node missing difficulty for tree height/width calculation" + g_node.name);
                    if(!g_parent.difficulty)
                        throw Error("node missing difficulty for tree height/width calculation" + g_parent.name);

                    const prev_idx = g_parent.children.indexOf(g_node) - 1;
                    nodes.push({
                        id: g_node.name,
                        type: 'clickable',
                        position: {
                            // offset to prev node of parent
                            x: (g_parent.difficulty! < g_node.difficulty!) ? g_node.difficulty! * difficultySpacing * xScaleFactor : parent.position.x + 600,
                            y: (prev_idx >= 0) ? nodes[getNodeIdxById(g_parent.children[prev_idx].name, nodes)].position.y + 100 +
                                // + offset to previous node if present and space for own children
                                ((g_node.children.length > 0) ? (Math.max(0, g_parent.children[prev_idx].children.length - 1)) * 100 : 0)
                                // parent.y - space for children
                                : parent.position.y - ((g_parent.children.length - 1) / 2) * 100,
                        },
                        data: {
                            label: g_node.name,
                            n_children: 0,
                            orientation: parent.data.orientation,
                            color: parent.data.color
                        }});
                    edges.push({
                        id: g_parent.name + '->' + g_node.name,
                        source: g_parent.name,
                        target: g_node.name,
                        style: { stroke: 'black', strokeWidth: 3}});
                }
                else if(g_node.name !== 'root') {
                    // root nodes
                    const trick = this.getTrickByTitle(g_node.name)
                    if(!trick)
                        throw Error("failed to find trick by title in Trick Tree convGraph: " + g_node.name);
                        // find node in space allocation array
                    const y = getSpaceIdx(trick.title[0], spaces)
                    nodes.push({
                        id: g_node.name,
                        type: 'clickable',
                        position: {
                            x: trick.difficulty * difficultySpacing * xScaleFactor,
                            y: y * 120},
                        data: {
                            label: g_node.name,
                            n_children: 0,
                            orientation: 1,
                            color: categoryStore.getColor(trick.category)
                        }});
                }
                // difficulty markers
                for (let j = 1; j <= 5; j++) {
                    nodes.push({id: 'Difficulty ' + j.toString(), type: 'difficulty', position: {x: j * difficultySpacing * xScaleFactor, y: -200}, data: {
                            label: j.toString(),
                        }})
                }
                // calculate conversion recursively
                for (let i = 0; i < g_node.children.length; i++) {
                    const [t_nodes, t_edges] = convGraph(nodes, edges, nodes[getNodeIdxById(g_node.name, nodes)], g_node.children[i], g_node)
                    nodes.concat(t_nodes);
                    edges.concat(t_edges);
                }

                return [nodes, edges];
            }

            let nodes: Array<Node> = [];
            let edges: Array<Edge> = [];
            const difficultySpacing = 1500;
            const xScaleFactor = (orientation === 'Portrait') ? 0.7 : 1;
            const categoryStore = useCategoryStore();

            [nodes, edges] = convGraph(nodes, edges, null, graph[0], null)


            return [nodes, edges];
        },
        getRecommendedTricks (masteredStore:  ReturnType<typeof useMasteredStore>): Array<Trick>  {
            try {
                const recommendedTricks = []
                const masteredTricks = masteredStore.getMasteredTricks(this.tricks);
                const resLength = 12
                
                const baseTrickTitles = ['Triangle', 'Backwards Donut', 'Hockey Stop', 'Eagle', 'Grapevine']
                // Starter Tricks if not mastered
                for (let i = 0; i < baseTrickTitles.length; i++) {
                    const trick = this.getTrickByTitle(baseTrickTitles[i])
                    if(!trick) throw Error("recommended trick not found by title: " + baseTrickTitles[i])
                    if(!masteredStore.isMastered(trick)) {
                        recommendedTricks.push(trick)
                    }
                }
               
                // Tricks that require mastered tricks 
                for (let i = 0; i < this.tricks.length; i++) {
                    if(!masteredStore.isMastered(this.tricks[i])) {
                        const requirementIds = this.tricks[i].requirements
                        const masteredIdSet = new Set(masteredTricks.map(t => t.trickID));
                        const allRequirementsMastered = requirementIds.every(id =>
                            masteredIdSet.has(id)
                        );
                        if(allRequirementsMastered && requirementIds.length > 0) {
                            recommendedTricks.push(this.tricks[i])
                        }
                    }
                }

                // fill with easiest non mastered tricks
                const sortedTricks: Array<Trick> = getSortedTricks(this.tricks, 'difficultyUp') as Array<Trick>
                if(recommendedTricks.length < resLength) {
                    for (let i = 0; i < sortedTricks.length; i++) {
                        if(!masteredStore.isMastered(sortedTricks[i]) && !recommendedTricks.includes(sortedTricks[i])) {
                            recommendedTricks.push(sortedTricks[i])
                            if(recommendedTricks.length == resLength) {
                                break;
                            }
                        }
                    }
                }

                return (getSortedTricks(recommendedTricks, 'difficultyUp') as Array<Trick>).slice(0, resLength)
            }
            catch(e) {
                console.log(e)
                return []
            }
        }
    }
})