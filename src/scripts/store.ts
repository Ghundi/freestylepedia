import {defineStore} from 'pinia';

import { ref, watch } from 'vue'

// supporter logos
import AIF from "../assets/supporters/aif w.webp";
import GlobalIce from '../assets/supporters/GlobalIce.webp';
import IFO from "../assets/supporters/Logo_IFO_schwarz-1.webp";
import MunichEast from "../assets/supporters/RZ_freestyler_Logo_1-2.webp";
import Turtle from "../assets/supporters/Turtle_upscaled.webp"
import NK from "../assets/supporters/nagyerdei korisok.webp"
import IceRad from "../assets/supporters/ICERAD.webp"
import Guardians from "../assets/supporters/Guardians.webp"
import IFP from "../assets/supporters/IFP Print Brust Link.webp"
import ICD from "../assets/supporters/ICD.webp"
import IceIceDilly from "../assets/supporters/IceIceDilly.webp"
import { Trick } from '@/pages/Trick.vue';

export const useTodoStore = defineStore('Todo', () => {
  const list = ref<Array<number>>([])

    // Initialise from localStorage
    const raw = localStorage.getItem('todo')
    if (raw) {
        try {
            list.value = JSON.parse(raw)
        } catch (e) {
            console.warn('Failed to parse todo from localStorage, resetting to empty array')
            list.value = []
        }
    } 
    else {
        list.value = []
    }

    // Keep localStorage in sync whenever list changes
    watch(list, (newVal) => {
    if (newVal.length === 0) {
        localStorage.removeItem('todo')
    } else {
        localStorage.setItem('todo', JSON.stringify(newVal))
    }
    }, { deep: true })

    function toggle(trick: Trick): void {
        // work with trickID
        const idx: number = list.value.indexOf(trick.trickID)
        if (idx > -1) list.value.splice(idx, 1)
        else list.value.push(trick.trickID)

        // removed to migrate to typescript
        // fallback remove title
        // only adding trickID
        // const idxT = list.value.indexOf(trick.title[0])
        // if (idxT > -1) list.value.splice(idxT, 1)
    }

    const isOnTodo: (trick: Trick) => boolean = (trick) => {
        const retID = list.value.includes(trick.trickID)
        return retID
        
        // removed to migrate to typescript
        // const retTitle = list.value.includes(trick.title[0])
        // if(retTitle) {
        //     // remove title and add trickID
        //     const idx = list.value.indexOf(trick.title[0])
        //     if (idx > -1) list.value.splice(idx, 1)
        //     list.value.push(trick.trickID)
        // }
        // return retTitle
    }

    const getHash: () => string = () => {
        return list.value.toString();
    }

    const loadHash: (hash: string) => Array<string> = (hash) => {
        const newList: Array<string> = hash.split(",");
        list.value = newList.map(id => Number(id));
        console.log("Loaded following todo list: ", list.value)
        return newList
    }

    return { list, toggle, isOnTodo, getHash, loadHash }
})

export const useMarkedStore = defineStore('marked', {
    state: () => {
        return {
            markers: ['mastered', 'non-mastered', 'todo', 'irrelevant'],
            selMarkers : ['mastered', 'non-mastered']
        }
    },
    actions: {
        update(value: Array<string>){
            this.selMarkers = value;
        },
        add(value: string) {
            // check if allowed string
            if(this.markers.includes(value)) {
                this.selMarkers.push(value)
            }
        },
        remove(value: string) {
            const index: number = this.selMarkers.indexOf(value);
            if (index > -1) { // only splice array when item is found
                this.selMarkers.splice(index, 1); // 2nd parameter means remove one item only
            }
        },
        reset() {
            this.selMarkers = ['mastered', 'non-mastered']
        }
    }
})

export const useMasteredStore = defineStore('Mastered', () => {
  const list = ref<Array<number>>([])

    // Initialise from localStorage
    const raw = localStorage.getItem('mastered')
    if (raw) {
    try {
        list.value = JSON.parse(raw)
    } catch (e) {
        console.warn('Failed to parse mastered from localStorage, resetting to empty array')
        list.value = []
    }
    } else {
    list.value = []
    }

    // Keep localStorage in sync whenever list changes
    watch(list, (newVal) => {
    if (newVal.length === 0) {
        localStorage.removeItem('mastered')
    } else {
        localStorage.setItem('mastered', JSON.stringify(newVal))
    }
    }, { deep: true })

  function toggle(trick: Trick): void {
    // work with trickID
    const idx = list.value.indexOf(trick.trickID)
    if (idx > -1) list.value.splice(idx, 1)
    else list.value.push(trick.trickID)

    // removed to migrate to typescript
    // fallback to title
    // const idxT = list.value.indexOf(trick.title[0])
    // if (idxT > -1) list.value.splice(idxT, 1)
  }

  const getMasteredTricks = (tricks: Array<Trick>): Array<Trick> => {
    const res: Array<Trick> = []
    if(tricks) {
        for (let i = 0; i < tricks.length; i++) {
            if (isMastered(tricks[i])) {
                res.push(tricks[i])
            }
        }
        return res
    }
    else {
        return res
    }
  }

  const calcCategoryShareMastered = (tricks: Array<Trick>, categories: Array<string>): Array<number> => {
    var tricks_mastered: Array<number> = new Array(categories.length).fill(0)
    var tricks_category: Array<number> = new Array(categories.length).fill(0)
    if(tricks) {
        for (let i = 0; i < tricks.length; i++) {
            const idx = categories.indexOf(tricks[i].category)
            tricks_category[idx] += 1
            if (isMastered(tricks[i])) {
                tricks_mastered[idx] += 1
            }
        }
        tricks_mastered.forEach( (_, i) => 
            tricks_mastered[i] = tricks_mastered[i] / tricks_category[i])
        return tricks_mastered
    }
    else {
        return []
    }
  }

  const calcShareMastered = (tricks: Array<Trick>): number => {
    var tricks_mastered: number = 0
    if(tricks) {
        for (let i = 0; i < tricks.length; i++) {
            if (isMastered(tricks[i])) {
                tricks_mastered += 1
            }
        }
        return tricks_mastered
    }
    else {
        return 0
    }
  }

  const isMastered = (trick: Trick): boolean => {
    const retID: boolean = list.value.includes(trick.trickID)
    return retID

    // removed to migrate to typescript
    // const retTitle = list.value.includes(trick.title[0])
    // if(retTitle) {
    //     // remove title and add trickID
    //     const idx = list.value.indexOf(trick.title[0])
    //     if (idx > -1) list.value.splice(idx, 1)
    //     list.value.push(trick.trickID)
    //     console.log('removed: ' + trick.title[0])
    // }
    // return retTitle
  }

    const getHash = (): string => {
        return list.value.toString();
    }

    const loadHash = (hash: string): Array<number> => {
        const newList: Array<number> = hash.split(",").map(id => Number(id));
        list.value = newList;
        console.log("Loaded following mastered list: ", list.value)
        return newList
    }

  return { list, toggle, isMastered, calcShareMastered, calcCategoryShareMastered, getMasteredTricks, getHash, loadHash }
})

export const useFAQ = defineStore('FAQ', {
    state: () => {
        return {
            val: ['usage', 'naming', 'scoring', 'categories', 'existence', 'improve', 'help', 'transfer']
        }
    },
})
export const useSupporters = defineStore('supporters', {
    state: () => {
        return {
            images: [
                {
                    imgSrc: AIF,
                    link: 'https://www.youtube.com/@AlpineIceFreestyle'
                },
                {
                    imgSrc: GlobalIce,
                    link: 'https://www.instagram.com/globaliceskate'
                },
                {
                    imgSrc: Guardians,
                    link: 'https://www.youtube.com/@icefreestyleguardians'
                },
                {
                    imgSrc: ICD,
                    link: 'https://www.instagram.com/ice.cracks_dresden'
                },
                {
                    imgSrc: MunichEast,
                    link: 'https://www.youtube.com/@ice.freestyler.muenchen-ost'
                },
                {
                    imgSrc: IFO,
                    link: 'https://www.instagram.com/icefreestyleroffenburg'
                },
                {
                    imgSrc: IFP,
                    link: 'https://www.instagram.com/ice_freestyler_polarion'
                },
                {
                    imgSrc: IceRad,
                    link: 'https://www.instagram.com/icerad'
                },
                {
                    imgSrc: NK,
                    link: 'https://www.youtube.com/@NagyerdeiKorisok'
                },
                {
                    imgSrc: Turtle,
                    link: 'https://www.instagram.com/turtlestyleofficial'
                },
                {
                    imgSrc: IceIceDilly,
                    link: 'https://www.youtube.com/@IceIceDilly'
                },
            ]
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
        const sortingOrders: Array<string> = useSortingOrderStore().sortingOrders;
        return {
            by: sortingOrders[0],
        };
    },
    actions: {
        update(value: string): boolean {
            this.by = value;
            return true;
        },
        reset(): boolean {
            const sortingOrders = useSortingOrderStore().sortingOrders;
            this.by = sortingOrders[0];
            return true;
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
        getColor(category: string): string {
            const index = this.categories.indexOf(category.toLowerCase());
            return this.colors[index];
        }
    }
})

export const useSelCategoryStore = defineStore('SelCategoryStore', {
    state: (): { categories: Array<string> } => ({
        categories: [] as Array<string>
    }),
    actions: {
        update(value: Array<string>): boolean {
            this.categories = value;
            return true;
        },
        remove(value: string): boolean {
            const index = this.categories.indexOf(value);
            if (index > -1) { // only splice array when item is found
                this.categories.splice(index, 1); // 2nd parameter means remove one item only
                return true;
            }
            return false;
        },
        reset(): boolean {
            this.categories = [];
            return true;
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
        update(newVal: Array<number>){
            if(newVal.length != 2 || !newVal.every(num => 1 <= num && num <= 5)) return false;
            this.val = newVal;
            return true;
        },
        reset(): boolean {
            this.val = [1,5]
            return true;
        }
    }
})

export const useCurSearchStore = defineStore('curSearchStore', {
    state: (): { val: string | null } => {
        return {
            val: null
        };
    },
    actions: {
        update(value: string | null): boolean {
            this.val = value;
            return true;
        },
        reset(): boolean {
            this.val = null;
            return true;
        }
    }
})
