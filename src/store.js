import { defineStore } from 'pinia';
import yamlFile from "./DB/freestylepedia.yaml";

export const useMembers = defineStore('members', {
    state: () => {
        return {
            val: ['Matti', 'Niklas', 'Alex', 'Basti', 'Danny' , 'Eduard', 'Lena' , 'Markus', 'Vio'],
        }
    },
})
export const useCurPage = defineStore('curPage', {
    state: () => {
        return {
            val: "VideoList",
        }
    },
    actions: {
        update(value){
            this.val = value;
        },
        reset() {
            this.val = "VideoList";
        }
    }
})

export const useSortingOrderStore = defineStore('sortingOrderStore', {
    state: () => {
        return {
            sortingOrders: ['Difficulty (Easy to Hard)' , 'Difficulty (Hard to Easy)', 'Title (A-Z)', 'Title (Z-A)', 'Released (New - Old)', 'Released (Old - New)']
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
            categories: ['Footwork', 'Grounds', 'Jumps', 'Acrobatics', 'Hydroblading', 'Spins', 'Stops'],
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
            val: ""
        };
    },
    actions: {
        update(value){
            this.val = value;
        },
        reset() {
            this.val = "";
        }
    }
})

export const useVideoStore = defineStore('videoStore', {
    state: () => ({
        videos: [],
        /*[
            { id: ['ot8MGzXZln0'], title: ['Zulu Spin'], difficulty: '2', category: 'Ground', releaseDate: new Date('2024-02-02') },
            { id: ['yKWyPTtDCX8'], title: ['Inward Triangle'], difficulty: '2', category: 'Footwork', releaseDate: new Date('2023-08-11') },
            { id: ['Xo2frGP3Q8A'], title: ['Brush'], difficulty: '3', category: 'Footwork', releaseDate: new Date('2019-02-15') },
            { id: ['JbvdGJe0XSs'], title: ['Jumped X'], difficulty: '3', category: 'Footwork', releaseDate: new Date('2019-02-21') },
            { id: ['GBdYeRkjkos'], title: ['Toe Donut'], difficulty: '2', category: 'Footwork', releaseDate: new Date('2019-02-28') },
            { id: ['uQNzU8hD0u4'], title: ['Cantilever'], difficulty: '5', category: 'Hydroblading', releaseDate: new Date('2019-03-01') },
            { id: ['lrwQ1GLtL6o'], title: ['Split Jump'], difficulty: '5', category: 'Jumps', releaseDate: new Date('2019-03-07') },
            { id: ['Ymh5bwfYAcs'], title: ['Spiderman'], difficulty: '4', category: 'Hydroblading', releaseDate: new Date('2019-03-08') },
            { id: ['qVQYXi9jMSU'], title: ['Cannon'], difficulty: '2', category: 'Hydroblading', releaseDate: new Date('2019-03-14') },  // Difficulty F: 2, B: 3
            { id: ['QZBqAVg9GoM'], title: ['V-Stop'], difficulty: '3', category: 'Stops', releaseDate: new Date('2019-04-19') },
            { id: ['AmZFtgm9Is4'], title: ['Butterfly'], difficulty: '4', category: 'Acrobatics', releaseDate: new Date('2020-01-23') },
        ],

         */
    }),
    // Adding a method to get a thumbnail URL by video ID
    actions: {
        loadYAML() {
            // trick number - trickID - attribute

            const tricks = [];
            for (let i = 0; i < yamlFile["tricks"].length; i++) {
                const j = i + 1;
                const lst = yamlFile["tricks"][i][("trick" + ("000" + j).slice(-4))];
                const trick = { id: lst[1], title: lst[0], difficulty: lst[2], category: lst[3], releaseDate: new Date(lst[4]), requirements: lst[5], connections: lst[6] }
                tricks.push(trick);
            }
            //console.log(tricks);
            this.videos = tricks;
            console.log("loaded tricks")
        },
        getThumbnailUrl(videoId) {
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        },
        sortedVideos: (state, sortOption) => {
                switch (sortOption) {
                    case 'Difficulty (Hard to Easy)':
                        return [...state.videos].sort((a, b) => b.difficulty - a.difficulty || a.title[0].localeCompare(b.title[0]));
                    case 'Difficulty (Easy to Hard)':
                        return [...state.videos].sort((a, b) => a.difficulty - b.difficulty || a.title[0].localeCompare(b.title[0]));
                    case 'Title (A-Z)':
                        return [...state.videos].sort((a, b) => a.title[0].localeCompare(b.title[0]));
                    case 'Title (Z-A)':
                        return [...state.videos].sort((a, b) => b.title[0].localeCompare(a.title[0]));
                    case 'Released (New - Old)':
                        return [...state.videos].sort((a, b) => b.releaseDate < a.releaseDate);
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
                        if((curSearch) ? videos[i].title[0].toLowerCase().includes(curSearch.toLowerCase()) : true) {
                            filtered.push(videos[i]);
                        }
                    }
                }
            }
            return filtered;
        },
    }
})
