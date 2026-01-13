import {defineStore} from 'pinia';

import { ref, watch } from 'vue'

// suporter logos
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

export const useTodoStore = defineStore('Todo', () => {
  const list = ref([])

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

    function toggle(title) {
        const idx = list.value.indexOf(title)
        if (idx > -1) list.value.splice(idx, 1)
        else list.value.push(title)
    }

        const isOnTodo = (title) => list.value.includes(title)

    return { list, toggle, isOnTodo }
})

export const useMarkedStore = defineStore('marked', {
    state: () => {
        return {
            markers: ['mastered', 'non-mastered', 'todo'],
            selMarkers : ['mastered', 'non-mastered']
        }
    },
    actions: {
        update(value){
            this.selMarkers = value;
        },
        add(value) {
            if(markers.includes(value)) {
                selMarkers.push(value)
            }
        },
        remove(value) {
            const index = this.selMarkers.indexOf(value);
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
  const list = ref([])

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

  function toggle(title) {
    const idx = list.value.indexOf(title)
    if (idx > -1) list.value.splice(idx, 1)
    else list.value.push(title)
  }

  const getMasteredTricks = (tricks) => {
    const res = []
    if(tricks) {
        for (let i = 0; i < tricks.length; i++) {
            if (isMastered(tricks[i].title[0])) {
                res.push(tricks[i])
            }
        }
        return res
    }
    else {
        return res
    }
  }

  const calcCategoryShareMastered = (tricks, categories) => {
    var tricks_mastered = new Array(categories.length).fill(0)
    var tricks_category = new Array(categories.length).fill(0)
    if(tricks) {
        for (let i = 0; i < tricks.length; i++) {
            const idx = categories.indexOf(tricks[i].category)
            tricks_category[idx] += 1
            if (isMastered(tricks[i].title[0])) {
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

  const calcShareMastered = (tricks) => {
    var tricks_mastered = 0
    if(tricks) {
        for (let i = 0; i < tricks.length; i++) {
            if (isMastered(tricks[i].title[0])) {
                tricks_mastered += 1
            }
        }
        return tricks_mastered
    }
    else {
        return 0
    }
  }

  const isMastered = (title) => list.value.includes(title)

  return { list, toggle, isMastered, calcShareMastered, calcCategoryShareMastered, getMasteredTricks }
})

export const useFAQ = defineStore('FAQ', {
    state: () => {
        return {
            val: ['usage', 'naming', 'scoring', 'categories', 'existence', 'improve', 'help']
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
