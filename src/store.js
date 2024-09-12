import {defineStore} from 'pinia';
import tricksYAML from "./DB/freestylepedia.yaml";

//helpers
function trickToNode(trick, left = false) {
    return {name: trick.title[0], children: [],  left: left}
}

function graphSearch(trickTitle, graph) {
    let visited = [];
    for (let i = 0; i < graph.children.length; i++) {
        if(!visited.includes(graph.children[i])) {
            visited.push(graph.children[i].name)
            if(graph.children[i].name === trickTitle) {
                return graph.children[i];
            }
            else {
                if(graph.children[i].children.length > 0) {
                    let res = graphSearch(trickTitle, graph.children[i]);
                    if (res != null) {
                        return res
                    }
                }
            }
        }
    }
}

function getNodeIdxById(id, nodes) {
    for (let i = 0; i < nodes.length; i++) {
        if(nodes[i].id === id) {
            return i;
        }
    }
    console.log(id, ' nde not found');
    return -1;
}

export const useFAQ = defineStore('FAQ', {
    state: () => {
        return {
            val: ['usage', 'naming', 'scoring', 'categories', 'existence', 'improve']
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
            const newestTrick = tricks.sort(function(a,b){
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
            console.log(`${ trickTitle } could not be found`)
            return state.videos[0];
        },
        getTitles(state) {
            let res = [];
            for (let i = 0; i < state.videos.length; i++) {
                res.push(state.videos[i].title);
            }
            return res.flat();
        },
        getConnectionsGraph(state) {
            let graph= [{name: "Categories", children: []}];
            const categories = useCategoryStore().categories;
            //category nodes
            for (let i = 0; i < categories.length; i++) {
                //TODO translate categories, atm translate not available
                const categorySentenceCase = categories[i].charAt(0).toUpperCase() + categories[i].slice(1);
                graph[0].children.push({name: categorySentenceCase, children: [], left: (i / categories.length < 0.5)});
            }
            let videos = state.loadYAML()
            let visitedIDs = [];
            for (let i = 0; i < videos.length; i++) {
                if(!visitedIDs.includes(videos[i].trickID)) {
                    const categoryIdx = categories.indexOf(videos[i].category)
                    graph[0].children[categoryIdx].children.push(trickToNode(videos[i]));
                    // add connections if not base trick and mark them as visited
                    if(videos[i].connections.length > 0) {
                        for (let j = 0; j < videos[i].connections.length; j++) {
                            if(parseInt(videos[i].trickID.slice(5)) < parseInt(videos[i].connections[j].slice(5))) {
                                graph[0].children[categoryIdx].children.at(-1).children.push(trickToNode(state.getTrickByID(videos[i].connections[j], state)));
                                visitedIDs.push(videos[i].connections[j]);
                            }
                        }
                    }
                }
            }
            return graph;
        },
        getConnectionFlowChart(state) {
            //calc number of category children for positioning
            const categoryStore = useCategoryStore()
            const categories = categoryStore.categories;
            const num_children = new Array(categories.length).fill(0);
            for (let i = 0; i < state.videos.length; i++) {
                num_children[categories.indexOf(state.videos[i].category)]++;
            }

            const sum_children = num_children.reduce((a, b) => a + b, 0);
            let splitIdx = 0;
            let curSum = 0;
            for (let i = 0; i < categories.length; i++) {
                curSum += num_children[i];
                if (curSum > sum_children / 2) {
                    splitIdx = i;
                    break;
                }
            }

            let nodes = [];
            let edges = [];

            //category nodes
            for (let i = 0; i < categories.length; i++) {
                nodes.push({
                    id: i,
                    type: 'category',
                    position: { x: (i < splitIdx) ? -200 : 200,
                                y: ((i > 0 && i !== Math.round(splitIdx)) ? nodes[i-1].position.y : 0) + (((i > 0 && i !== Math.round(splitIdx)) ? num_children[i-1] / 2 : 0) + (num_children[i] / 2)) * 100 },
                    data: {
                        label: categories[i],
                        n_children: 0,
                        left: (i < splitIdx),
                        color: categoryStore.getColor(categories[i])
                    }});
            }

            // trick nodes
            let visitedIDs = [];
            let childIdx = 1000;
            for (let i = categories.length; i < (state.videos.length + categories.length); i++) {
                const trick = state.videos[i - categories.length];
                if(!visitedIDs.includes(trick.trickID)) {
                    const categoryIdx = categories.indexOf(trick.category)
                    const xOffset = (categoryIdx < splitIdx) ? -300 : 300;
                    nodes.push({
                        id: i,
                        type: 'special',
                        position: { x: nodes[categoryIdx].position.x + xOffset,
                                    y: (nodes[categoryIdx].position.y - (num_children[categoryIdx] / 2 - 1) * 100) + (nodes[categoryIdx].data.n_children * 100) },
                        data: {
                            label: trick.title[0],
                            n_children: 0,
                            left: nodes[categoryIdx].data.left,
                            color: nodes[categoryIdx].data.color
                        }});
                    nodes[categoryIdx].data.n_children++;
                    edges.push({
                        id: (i-1) + '->' + i,
                        source: categoryIdx.toString(),
                        target: i.toString()});
                    // add connections if not base trick and mark them as visited
                    if(trick.connections.length > 0) {
                        for (let j = 0; j < trick.connections.length; j++) {
                            if(parseInt(trick.trickID.slice(5)) < parseInt(trick.connections[j].slice(5))) {
                                const parentIdx = getNodeIdxById(i, nodes);
                                nodes.push({
                                    id: childIdx,
                                    type: 'special',
                                    position: {
                                        x: nodes[parentIdx].position.x + xOffset,
                                        y: nodes[parentIdx].position.y + (nodes[parentIdx].data.n_children * 100) },
                                    data: {
                                        label: state.getTrickByID(trick.connections[j], state).title[0],
                                        n_children: 0,
                                        left: nodes[parentIdx].data.left,
                                        color: nodes[parentIdx].data.color
                                    }});
                                nodes[parentIdx].data.n_children++;
                                edges.push({id: i + '->' + childIdx, source: i.toString(), target: childIdx.toString()});
                                visitedIDs.push(trick.connections[j]);
                                childIdx--;
                            }
                        }
                    }
                }
                else{
                    console.log('skipped', trick)
                }
            }

            return [nodes, edges];
        },
        getTrickTreeGraph(state) {
            let graph= [{name: "Starting Points", children: []}];
            let visitedIDs = [];
            let i = 0;
            while (visitedIDs.length <= state.videos.length) {
                if(!visitedIDs.includes(state.videos[i].trickID)) {
                    // check if requirements exist
                    if(state.videos[i].requirements.length > 0) {
                        for (let j = 0; j < state.videos[i].requirements.length; j++) {
                            const parent = graphSearch(state.getTrickByID(state.videos[i].requirements[j], state).title[0], graph[0]);
                            if(parent != null) {
                                parent.children.push(trickToNode(state.videos[i]));
                                visitedIDs.push(state.videos[i].trickID);
                            }
                        }
                    }
                    // start new subtree
                    else {
                        // decide if left or right
                        graph[0].children.push(trickToNode(state.videos[i], i < 35));
                        visitedIDs.push(state.videos[i].trickID);
                    }
                }
                i = (i + 1) % state.videos.length;
            }
            return graph;
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
