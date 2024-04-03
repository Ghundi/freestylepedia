import { defineStore } from 'pinia';
import tricksYAML from "./DB/freestylepedia.yaml";

//helpers
function trickToNode(trick) {
    return {name: trick.title[0], children: []}
}

function graphSearch(trickTitle, graph) {
    let visited = [];
    for (let i = 0; i < graph.length; i++) {
        if(!visited.includes(graph[i])) {
            visited.push(graph[i].name)
            if(graph[i].name === trickTitle) {
                return graph[i];
            }
            else {
                let res = null;
                for (let j = 0; j < graph[i].children.length; j++) {
                    res = graphSearch(trickTitle, graph[i])
                    console.log(res, graph[i].children, graph[i].name)
                    if(res != null) {
                        console.log(`found ${trickTitle}`)
                        return res
                    }
                }
            }
        }
    }
}

// TODO read FAQ from YAML?
export const useFAQ = defineStore('FAQ', {
    state: () => {
        return {
            val: [
                {title: 'Naming', text:"Naming is done by our team with community input."},
                {title: 'Scoring', text:'We try to score every trick as fair as possible. It is represented by the number skates'},
                {title: 'Categories', text:'We divide all tricks into subsections to better organize them for you. This way a trick is easier to find'},
                {title: 'How do I use Freestylepedia?', text:'PH '},
                {title: 'How can I use Freestylepedia to improve on the ice?', text:'With Freestylepedia you can easily see which tricks are achievable for you and which tricks are similar to the tricks you already mastered'},
            ],
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

export const useSelSortingOrder = defineStore('SelSortingOrder', {
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
        }
    },
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
            // trick number - trickID - attribute

            const tricks = [];
            for (let i = 0; i < tricksYAML["tricks"].length; i++) {
                const j = i + 1;
                const lst = tricksYAML["tricks"][i][("trick" + ("000" + j).slice(-4))];
                const trick = { trickID: ("trick" + ("000" + j).slice(-4)), id: lst[1], title: lst[0], difficulty: lst[2], category: lst[3].toLowerCase(), releaseDate: new Date(lst[4]), requirements: lst[5], connections: lst[6] }
                tricks.push(trick);
            }
            // find the newest trick
            const newestTrick = tricks.sort((a, b) => a.title[0].localeCompare(b.title[0]))[0];
            //helper for datetime one month ago
            const d = new Date();
            d.setMonth(d.getMonth()-1);
            // set newestTrick Tag if max 1 month-old
            //TODO change to >=
            if(newestTrick.releaseDate != d) {
                this.newestTrick = newestTrick.title[0];
            }
            this.videos = tricks;
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
            let visitedIDs = [];
            for (let i = 0; i < state.videos.length; i++) {
                if(!visitedIDs.includes(state.videos[i].trickID)) {
                    const categoryIdx = categories.indexOf(state.videos[i].category)
                    graph[0].children[categoryIdx].children.push(trickToNode(state.videos[i]));
                    // add connections if not base trick and mark them as visited
                    if(state.videos[i].connections.length > 0) {
                        for (let j = 0; j < state.videos[i].connections.length; j++) {
                            if(parseInt(state.videos[i].trickID.slice(5)) < parseInt(state.videos[i].connections[j].slice(5))) {
                                graph[0].children[categoryIdx].children.at(-1).children.push(trickToNode(state.getTrickByID(state.videos[i].connections[j], state)));
                                visitedIDs.push(state.videos[i].connections[j]);
                            }
                        }
                    }
                }
            }
            return graph;
        },
        getTrickTreeGraph(state) {
            let graph= [];
            let visitedIDs = [];
            for (let i = 0; i < state.videos.length; i++) {
                if(!visitedIDs.includes(state.videos[i].trickID)) {
                    // check if requirements
                    if(state.videos[i].requirements.length > 0) {
                        for (let j = 0; j < state.videos[i].requirements.length; j++) {
                            const parent = graphSearch(state.getTrickByID(state.videos[i].requirements[j], state).title[0], graph);
                            if(parent != null) {
                                parent.children.push(trickToNode(state.videos[i]));
                                visitedIDs.push(state.videos[i].trickID);
                            }
                            else {
                                console.log(`error ${state.videos[i].requirements[j]} not found`)
                            }
                        }
                    }
                    // start new subtree
                    else {
                        graph.push(trickToNode(state.videos[i]))
                        visitedIDs.push(state.videos[i].trickID);
                    }
                }
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
                        return [...state.videos].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
                    case 'releasedUp':
                        return [...state.videos].sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
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
