import { defineStore } from 'pinia'

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
            categories: ['Footwork', 'Ground', 'Jumps', 'Acrobatics', 'Hydroblading', 'Spins', 'Stops'],
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
        videos: [
            { id: 'ot8MGzXZln0', title: 'Zulu Spin', difficulty: '2', category: 'Ground', releaseDate: new Date('2024-02-02') },
            { id: 'yKWyPTtDCX8', title: 'Inward Triangle', difficulty: '2', category: 'Footwork', releaseDate: new Date('2023-08-11') },
            { id: 'Xo2frGP3Q8A', title: 'Brush', difficulty: '3', category: 'Footwork', releaseDate: new Date('2019-02-15') },
            { id: 'JbvdGJe0XSs', title: 'Jumped X', difficulty: '3', category: 'Footwork', releaseDate: new Date('2019-02-21') },
            { id: 'GBdYeRkjkos', title: 'Toe Donut', difficulty: '2', category: 'Footwork', releaseDate: new Date('2019-02-28') },
            { id: 'uQNzU8hD0u4', title: 'Cantilever', difficulty: '5', category: 'Hydroblading', releaseDate: new Date('2019-03-01') },
            { id: 'lrwQ1GLtL6o', title: 'Split Jump', difficulty: '5', category: 'Jumps', releaseDate: new Date('2019-03-07') },
            { id: 'Ymh5bwfYAcs', title: 'Spiderman', difficulty: '4', category: 'Hydroblading', releaseDate: new Date('2019-03-08') },
            { id: 'qVQYXi9jMSU', title: 'Cannon', difficulty: '2', category: 'Hydroblading', releaseDate: new Date('2019-03-14') },  // Difficulty F: 2, B: 3
            { id: 'QZBqAVg9GoM', title: 'V-Stop', difficulty: '3', category: 'Stops', releaseDate: new Date('2019-04-19') },
            { id: 'AmZFtgm9Is4', title: 'Butterfly', difficulty: '4', category: 'Acrobatics', releaseDate: new Date('2020-01-23') },
        ],
    }),
    // Adding a method to get a thumbnail URL by video ID
    actions: {
        getThumbnailUrl(videoId) {
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        },
        sortedVideos: (state, sortOption) => {
                switch (sortOption) {
                    case 'Difficulty (Hard to Easy)':
                        return [...state.videos].sort((a, b) => b.difficulty - a.difficulty || a.title.localeCompare(b.title));
                    case 'Difficulty (Easy to Hard)':
                        return [...state.videos].sort((a, b) => a.difficulty - b.difficulty || a.title.localeCompare(b.title));
                    case 'Title (A-Z)':
                        return [...state.videos].sort((a, b) => a.title.localeCompare(b.title));
                    case 'Title (Z-A)':
                        return [...state.videos].sort((a, b) => b.title.localeCompare(a.title));
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
                        if((curSearch) ? videos[i].title.toLowerCase().includes(curSearch.toLowerCase()) : true) {
                            filtered.push(videos[i])
                        }
                    }
                }
            }
            return filtered;
        },
    }
})
