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
import IcePulse from "../assets/supporters/IcePulse.webp"
import { Trick } from '@/scripts/trickStore';
import { visibleOnBackground } from '@/scripts/contrast';
import { THEME_COLORS, THEME_SURFACE_2, useThemeMode } from '@/scripts/theme';
import configJSON from "@/data/config.json";

// Ids saved before the "trick" prefix was dropped from tricks.json ("trick0042") are
// normalized to the current form ("0042"); anything that is not an id, and duplicates, go; order is kept.
export function normalizeIds(ids: Array<unknown>): Array<string> {
    return [...new Set(ids.map(id => String(id).replace('trick', '')).filter(id => /^\d+$/.test(id)))]
}

// localStorage can be missing or throw (privacy modes, blocked site data): progress then lives in memory.
function readStorage(key: string): string | null {
    try { return localStorage.getItem(key) } catch { return null }
}
function writeStorage(key: string, value: string | null): void {
    try {
        if (value === null) localStorage.removeItem(key)
        else localStorage.setItem(key, value)
    } catch { /* storage full or unavailable: keep the list in memory */ }
}

// Reads a stored id list, normalizes it and writes the normalized list back.
function loadStoredIds(key: string): Array<string> {
    const raw = readStorage(key)
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []
        const ids = normalizeIds(parsed)
        if (JSON.stringify(ids) !== raw) writeStorage(key, ids.length ? JSON.stringify(ids) : null)
        return ids
    } catch (e) {
        console.warn(`Failed to parse ${key} from localStorage, resetting to empty array`)
        return []
    }
}

// Splits a transfer-link list ("0001,trick0006, ,abc") into clean ids; `isKnown` drops ids no trick has.
export function parseIdList(hash: string, isKnown?: (id: string) => boolean): Array<string> {
    const ids = normalizeIds(hash.split(',').map(id => id.trim()).filter(Boolean))
    return isKnown ? ids.filter(isKnown) : ids
}

// An id list kept in localStorage under `key`, and reloaded when another tab changes it,
// so a tab left open never writes back a stale list over newer marks.
function usePersistedIds(key: string) {
    const list = ref<Array<string>>(loadStoredIds(key))
    watch(list, (ids) => {
        const value = ids.length ? JSON.stringify(ids) : null
        if (readStorage(key) !== value) writeStorage(key, value)
    }, { deep: true })
    if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
            if (e.key === key || e.key === null) list.value = loadStoredIds(key)
        })
    }
    // A transfer link adds its ids to the ones already here: opening it never erases progress.
    const loadHash = (hash: string, isKnown?: (id: string) => boolean): Array<string> => {
        const added = parseIdList(hash, isKnown)
        list.value = normalizeIds([...list.value, ...added])
        return added
    }
    const getHash = (): string => list.value.toString()
    return { list, loadHash, getHash }
}

export const useTodoStore = defineStore('Todo', () => {
    const { list, loadHash, getHash } = usePersistedIds('todo')

    function toggle(trick: Trick): void {
        const idx: number = list.value.indexOf(trick.trickID)
        if (idx > -1) list.value.splice(idx, 1)
        else {
            // back on the list to learn again: no longer mastered
            list.value.push(trick.trickID)
            const mastered = useMasteredStore().list
            const at = mastered.indexOf(trick.trickID)
            if (at > -1) mastered.splice(at, 1)
        }
    }

    function remove(trick: Trick): void {
        const idx = list.value.indexOf(trick.trickID)
        if (idx > -1) list.value.splice(idx, 1)
    }

    const isOnTodo: (trick: Trick) => boolean = (trick) => list.value.includes(trick.trickID)

    return { list, toggle, remove, isOnTodo, getHash, loadHash }
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
  const { list, loadHash, getHash } = usePersistedIds('mastered')

  // A trick marked mastered leaves the todo list.
  function toggle(trick: Trick): void {
    const idx = list.value.indexOf(trick.trickID)
    if (idx > -1) list.value.splice(idx, 1)
    else {
      list.value.push(trick.trickID)
      useTodoStore().remove(trick)
    }
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

  const isMastered = (trick: Trick): boolean => list.value.includes(trick.trickID)

  return { list, toggle, isMastered, calcShareMastered, calcCategoryShareMastered, getMasteredTricks, getHash, loadHash }
})

export const useFAQ = defineStore('FAQ', {
    state: () => {
        return {
            val: configJSON.initialValues.faqStore,
        }
    },
})
export const useSupporters = defineStore('supporters', {
    state: () => {
        return {
            images: [
                {
                    imgSrc: AIF,
                    name: 'Alpine Ice Freestyle',
                    link: 'https://www.youtube.com/@AlpineIceFreestyle'
                },
                {
                    imgSrc: GlobalIce,
                    name: 'Global Ice Skate',
                    link: 'https://www.instagram.com/globaliceskate'
                },
                {
                    imgSrc: Guardians,
                    name: 'Ice Freestyle Guardians',
                    link: 'https://www.youtube.com/@icefreestyleguardians'
                },
                {
                    imgSrc: ICD,
                    name: 'Ice Cracks Dresden',
                    link: 'https://www.instagram.com/ice.cracks_dresden'
                },
                {
                    imgSrc: MunichEast,
                    name: 'Ice Freestyler München Ost',
                    link: 'https://www.youtube.com/@ice.freestyler.muenchen-ost'
                },
                {
                    imgSrc: IFO,
                    name: 'Ice Freestyler Offenburg',
                    link: 'https://www.instagram.com/icefreestyleroffenburg'
                },
                {
                    imgSrc: IFP,
                    name: 'Ice Freestyler Polarion',
                    link: 'https://www.instagram.com/ice_freestyler_polarion'
                },
                {
                    imgSrc: IceRad,
                    name: 'IceRad',
                    link: 'https://www.instagram.com/icerad'
                },
                {
                    imgSrc: NK,
                    name: 'Nagyerdei Korisok',
                    link: 'https://www.youtube.com/@NagyerdeiKorisok'
                },
                {
                    imgSrc: Turtle,
                    name: 'Turtle Style',
                    link: 'https://www.instagram.com/turtlestyleofficial'
                },
                {
                    imgSrc: IceIceDilly,
                    name: 'IceIceDilly',
                    link: 'https://www.youtube.com/@IceIceDilly'
                },
                {
                    imgSrc: IcePulse,
                    name: 'IcePulse',
                    link: 'https://www.instagram.com/icepulse18'
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
            categories: configJSON.initialValues.categoryStore.categories, //['footwork', 'ground', 'jump', 'acrobatic', 'hydroblading', 'spin', 'stop'],
            colors: configJSON.initialValues.categoryStore.colors //['rgba(151,0,197,0.48)', 'rgba(152,221,69,0.75)', 'rgba(255,136,0,0.68)', '#e03030', 'rgba(6,187,211,0.78)', 'rgba(23,35,255,0.53)', 'rgba(252,247,0,0.76)']
        }
    },
    actions: {
        getColor(category: string): string {
            const index = this.categories.indexOf(category.toLowerCase());
            return this.colors[index];
        },
        /** The category colour adjusted to reach 3:1 on the page background (or on --surface-2) in the current theme. */
        getDotColor(category: string, on: 'bg' | 'surface-2' = 'bg'): string {
            const { resolved } = useThemeMode();
            return visibleOnBackground(
                this.getColor(category),
                (on === 'bg' ? THEME_COLORS : THEME_SURFACE_2)[resolved.value],
                resolved.value,
            );
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

// The one filter reset for the home page and its filter sheet (same as the old toolbar's):
// sort order is a preference, not a filter, so it is kept.
export function resetFilters(): void {
    useSelCategoryStore().reset();
    useSelDifficultyStore().reset();
    useCurSearchStore().reset();
    useMarkedStore().reset();
}
