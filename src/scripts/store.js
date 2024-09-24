import {defineStore} from 'pinia';
import tricksYAML from "../DB/freestylepedia.yaml";

import {graphSearch, getNodeIdxById, getSpaceIdx, checkSpace, trickToNode} from "./helpers.js"


export const useFAQ = defineStore('FAQ', {
    state: () => {
        return {
            val: ['usage', 'naming', 'scoring', 'categories', 'existence', 'improve', 'help']
        }
    },
})
export const useMembers = defineStore('members', {
    state: () => {
        return {
            val: ['Matti', 'Niklas', 'Alex', 'Basti', 'Danny' , 'Eduard', 'Lena' , 'Markus', 'Vio'],
        }
    },
})

export const useSortingOrderStore = defineStore('sortingOrderStore', {
    state: () => {
        return {
            sortingOrders: ['difficultyUp' , 'difficultyDown', 'nameUp', 'nameDown', 'releasedDown', 'releasedUp']
        }
    },
})

export const useSelSortingOrderStore = defineStore('SelSortingOrder', {
    state: () => {
        const sortingOrders = useSortingOrderStore().sortingOrders;
        return {
            by: sortingOrders[0],
        };
    },
    actions: {
        update(value){
            this.by = value;
        },
        reset() {
            const sortingOrders = useSortingOrderStore().sortingOrders;
            this.by = sortingOrders[0];
        },
    }
})

export const useCategoryStore = defineStore('categoryStore', {
    state: () => {
        return {
            categories: ['footwork', 'ground', 'jump', 'acrobatic', 'hydroblading', 'spin', 'stop'],
            colors: ['rgba(151,0,197,0.48)', 'rgba(152,221,69,0.75)', 'rgba(255,136,0,0.68)', '#e03030', 'rgba(6,187,211,0.78)', 'rgba(23,35,255,0.53)', 'rgba(252,247,0,0.76)']
        }
    },
    actions: {
        getColor(category) {
            const index = this.categories.indexOf(category.toLowerCase());
            return this.colors[index];
        }
    }
})

export const useSelCategoryStore = defineStore('SelCategoryStore', {
    state: () => {
        return {
            categories: [],
        };
    },
    actions: {
        update(value){
            this.categories = value;
        },
        remove(value) {
            const index = this.categories.indexOf(value);
            if (index > -1) { // only splice array when item is found
                this.categories.splice(index, 1); // 2nd parameter means remove one item only
            }
        },
        reset() {
            this.categories = []
        }
    }
})

export const useSelDifficultyStore = defineStore('selDifficultyStore', {
    state: () => {
        return {
            val: [1, 5]
        };
    },
    actions: {
        update(value){
            this.val = value;
        },
        reset() {
            this.val = [1,5]
        }
    }
})

export const useCurSearchStore = defineStore('curSearchStore', {
    state: () => {
        return {
            val: null
        };
    },
    actions: {
        update(value){
            this.val = value;
        },
        reset() {
            this.val = null;
        }
    }
})

export const useVideoStore = defineStore('videoStore', {
    state: () => ({
        videos: [],
        newestTrick: null,
    }),
    actions: {
        loadYAML() {
            const tricks = [];
            for (let i = 0; i < tricksYAML["tricks"].length; i++) {
                const j = i + 1;
                const lst = tricksYAML["tricks"][i][("trick" + ("000" + j).slice(-4))];
                const trick = { trickID: ("trick" + ("000" + j).slice(-4)), id: lst[1], title: lst[0], difficulty: lst[2], category: lst[3].toLowerCase(), releaseDate: new Date(lst[4]), requirements: lst[5], connections: lst[6] }
                tricks.push(trick);
            }
            // find the newest trick
            const tmp = tricks.slice()
            const newestTrick = tmp.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.releaseDate) - new Date(a.releaseDate);
            })[0];

            //helper for datetime one month ago
            const d = new Date();
            d.setMonth(d.getMonth()-1);
            // set newestTrick Tag if max 1 month-old
            if(newestTrick.releaseDate >= d) {
                this.newestTrick = newestTrick.title[0];
            }

            return tricks;
        },
        getThumbnailUrl(videoId) {
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        },
        getTrickByID(trickID, state) {
            for (let i = 0; i < state.videos.length; i++) {
                if(state.videos[i].trickID === trickID) {
                    return state.videos[i];
                }
            }
            console.log(`${ trickID } could not be found`)
            return state.videos[0];
        },
        getTrickByTitle(trickTitle, state) {
            for (let i = 0; i < state.videos.length; i++) {
                if(state.videos[i].title[0] === trickTitle) {
                    return state.videos[i];
                }
            }
            return state.videos[0];
        },
        getTitles(state) {
            let res = [];
            for (let i = 0; i < state.videos.length; i++) {
                res.push(state.videos[i].title);
            }
            return res.flat();
        },
        getConnectionsGraph(state, orientation) {
            // compute full graph for positioning
            let graph= [{name: "Categories", children: []}];
            const categoryStore = useCategoryStore();
            const categories = categoryStore.categories;
            //category nodes
            for (let i = 0; i < categories.length; i++) {
                graph[0].children.push({name: categories[i], children: []});
            }
            let videos = state.loadYAML()
            let visitedIDs = [];
            for (let i = 0; i < videos.length; i++) {
                if(!visitedIDs.includes(videos[i].trickID)) {
                    const categoryIdx = categories.indexOf(videos[i].category)
                    graph[0].children[categoryIdx].children.push(trickToNode(videos[i]));
                    // add connections if base trick and mark variants as visited
                    if(videos[i].connections.length > 0) {
                        for (let j = 0; j < videos[i].connections.length; j++) {
                            graph[0].children[categoryIdx].children.at(-1).children.push(trickToNode(state.getTrickByID(videos[i].connections[j], state)));
                            visitedIDs.push(videos[i].connections[j]);
                            }
                    }
                }
            }
            // convert graph to flow chart
            function convGraph(nodes, edges, parent, g_node, g_parent) {
                // category node
                if(categories.includes(g_node.name)) {
                    const categoryIdx = categories.indexOf(g_node.name);
                    const splitIdx = 2;
                    const prev_idx = g_parent.children.indexOf(g_node) - 1;
                    nodes.push({
                        id: g_node.name,
                        type: 'category',
                                    // root node + x_offset scaled
                        position: { x: ((categoryIdx < splitIdx) ? -100 : 100) * xScaleFactor,
                                    // if first in column -1500, else 100 under previous node
                                    y: ((prev_idx >= 0 && categoryIdx !== splitIdx) ? nodes[getNodeIdxById(g_parent.children[prev_idx].name, nodes)].position.y + 100 : -1500)
                                        // children.length + prev.children.length if exists / 2 * 100
                                        + ((g_node.children.length +
                                            ((prev_idx >= 0) ? g_parent.children[prev_idx].children.length : 0)) / 2) * 100},
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

            let nodes = [];
            let edges = [];
            const xScaleFactor = (orientation === 'Portrait') ? 1 : 3;
            // compute num children for categories
            const num_children = new Array(categories.length).fill(0);
            for (let i = 0; i < videos.length; i++) {
                num_children[categories.indexOf(videos[i].category)]++;
            }

            [nodes, edges] = convGraph(nodes, edges, null, graph[0], null)


            return [nodes, edges];
        },
        getTrickTreeGraph(state, orientation) {
            // generate base graph
            let graph= [{name: "root", children: []}];
            let visitedIDs = [];
            let i = 0;
            let videos = state.loadYAML();
            videos.sort((a, b) => {
                if (a.category < b.category) {
                    return -1;  // a comes before b
                }
                if (a.category > b.category) {
                    return 1;   // a comes after b
                }
                return 0;       // a and b are equal
            });
            while (visitedIDs.length <= videos.length) {
                if(!visitedIDs.includes(videos[i].trickID)) {
                    // check if requirements exist
                    if(videos[i].requirements.length > 0) {
                        for (let j = 0; j < videos[i].requirements.length; j++) {
                            const parent = graphSearch(state.getTrickByID(videos[i].requirements[j], state).title[0], graph[0]);
                            if(parent != null) {
                                parent.children.push(trickToNode(videos[i]));
                                visitedIDs.push(videos[i].trickID);
                            }
                        }
                    }
                    // start new subtree
                    else {
                        // decide if left or right
                        graph[0].children.push(trickToNode(videos[i], 2));
                        visitedIDs.push(videos[i].trickID);
                    }
                }
                i = (i + 1) % videos.length;
            }

            // calculate tree widths and height
            function calcTreeSpace(node) {
                if(node.children.length > 0) {
                    let max_children = node.children.length;
                    let max_difficulty = node.difficulty;
                    for (let j = 0; j < node.children.length; j++) {
                        const [tmp_children, tmp_difficulty] = calcTreeSpace(node.children[j])
                        max_children = Math.max(max_children, tmp_children);
                        max_difficulty = Math.max(max_difficulty, tmp_difficulty);
                    }
                    return [max_children, max_difficulty];
                }
                else {
                    return [1, node.difficulty];
                }
            }
            // calc root tree height and max width
            let total_width = 0;
            for (let j = 0; j < graph[0].children.length; j++) {
                let max_difficulty = graph[0].children[j].difficulty;
                [graph[0].children[j].width, max_difficulty] = calcTreeSpace(graph[0].children[j]);
                graph[0].children[j].height = max_difficulty - graph[0].children[j].difficulty + 1;
                total_width += graph[0].children[j].width;
            }

            // 2d array for allocating spaces
            const rows = total_width + 1;
            let spaces = Array(5).fill(false).map(() => Array(rows).fill(false));
            // place root nodes in allocation array
            for (let i = 0; i < graph[0].children.length; i++) {
                const node = graph[0].children[i];
                for (let col = 0; col < rows; col++) {
                    // if space free and wide enough
                    if(checkSpace(node.difficulty - 1, col, node.width, node.height, spaces)) {
                        // mark space as used
                        for (let x = col; x < col + node.width; x++) {
                            for (let y = node.difficulty - 1; y < node.difficulty + node.height - 1; y++) {
                                spaces[y][x] = true;
                            }
                        }
                        spaces[node.difficulty - 1][Math.floor(col + (node.width / 2))] = node.name;
                        break;
                    }
                    else if(col === rows - 1) {
                        console.log(node.name, ' did not fit')
                    }
                }
            }

            // convert to Flow Chart
            function convGraph(nodes, edges, parent, g_node, g_parent) {
                // child node
                if(parent && g_parent && g_parent.name !== 'root') {
                    const prev_idx = g_parent.children.indexOf(g_node) - 1;
                    nodes.push({
                        id: g_node.name,
                        type: 'clickable',
                        position: {
                            // offset to prev node of parent
                            x: (g_parent.difficulty < g_node.difficulty) ? g_node.difficulty * difficultySpacing * xScaleFactor : parent.position.x + 600,
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
                else {
                    // root nodes
                    const trick = state.getTrickByTitle(g_node.name, state)
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

            let nodes = [];
            let edges = [];
            const difficultySpacing = 1500;
            const xScaleFactor = (orientation === 'Portrait') ? 0.7 : 1;
            const categoryStore = useCategoryStore();

            [nodes, edges] = convGraph(nodes, edges, null, graph[0], null)


            return [nodes, edges];
        },
        sortedVideos: (state, sortOption) => {
                switch (sortOption) {
                    case 'difficultyDown':
                        return [...state.videos].sort((a, b) => b.difficulty - a.difficulty || a.title[0].localeCompare(b.title[0]));
                    case 'difficultyUp':
                        return [...state.videos].sort((a, b) => a.difficulty - b.difficulty || a.title[0].localeCompare(b.title[0]));
                    case 'nameUp':
                        return [...state.videos].sort((a, b) => a.title[0].localeCompare(b.title[0]));
                    case 'nameDown':
                        return [...state.videos].sort((a, b) => b.title[0].localeCompare(a.title[0]));
                    case 'releasedDown':
                        return [...state.videos].sort((a, b) => a.releaseDate - b.releaseDate);
                    case 'releasedUp':
                        return [...state.videos].sort((a, b) => b.releaseDate - a.releaseDate);
                    default:
                        return [...state.videos];
                }
        },
        filteredVideos: (videos) => {
            const selDifficulties = useSelDifficultyStore().val;
            const selCategories = useSelCategoryStore().categories;
            const curSearch = useCurSearchStore().val;
            const filtered = [];

            for(let i = 0; i < videos.length; i++) {
                if( selDifficulties[0] <= videos[i].difficulty && videos[i].difficulty <= selDifficulties[1]) {
                    if((selCategories.length > 0) ? selCategories.includes(videos[i].category) : true) {
                        for (let j = 0; j < videos[i].title.length; j++) {
                            if((curSearch) ? videos[i].title[j].toLowerCase().includes(curSearch.toLowerCase()) : true) {
                                filtered.push(videos[i]);
                                break;
                            }
                        }
                    }
                }
            }
            return filtered;
        },
    }
})
