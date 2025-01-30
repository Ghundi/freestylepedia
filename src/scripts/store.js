import {defineStore} from 'pinia';

// suporter logos
import AIF from "../assets/supporters/aif w.webp";
import GlobalIce from '../assets/supporters/GlobalIce.webp';
import IFO from "../assets/supporters/Logo_IFO_schwarz-1.webp";
import MunichEast from "../assets/supporters/RZ_freestyler_Logo_1-2.webp";
import Turtle from "../assets/supporters/Turtle_upscaled.webp"
import NK from "../assets/supporters/nagyerdei korisok.webp"
import IceRad from "../assets/supporters/ICERAD.webp"
import Guardians from "../assets/supporters/Guardians.webp"
import calendarYAML from "@/DB/calendar.yaml";

export const useFAQ = defineStore('FAQ', {
    state: () => {
        return {
            val: ['usage', 'naming', 'scoring', 'categories', 'existence', 'improve', 'help']
        }
    },
})

export const useEventsStore = defineStore('Events', {
    state: () => {
        return {
            events: []
        }
    },
    actions: {
        loadYAML() {
            const events = [];
            for (let i = 0; i < calendarYAML["events"].length; i++) {
                const j = i + 1;
                const lst = calendarYAML["events"][i][("event" + ("000" + j).slice(-4))];
                const event = {
                    eventID: ("event" + ("000" + j).slice(-4)),
                    title: lst[0],
                    location: lst[1],
                    moreInfo: lst[2],
                    dateStart: new Date(lst[3]), dateEnd: new Date(lst[4]),
                    description: lst[5],
                    color: lst[6], team: lst[7],
                    price: lst[8],
                    style: lst[9],
                    type: lst[10]
                }
                events.push(event)
            }

            return events;
        },
        getCalendarEvents(events) {
            const calEvents = [];
            for (let i = 0; i < events.length; i++) {
                calEvents.push( {
                    id: events[i].eventID,
                    title: events[i].title,
                    start: events[i].dateStart.toISOString().split('T')[0],
                    end: events[i].dateEnd.toISOString().split('T')[0],
                    calendarID: events[i].logo
                } )
            }
            return calEvents;
        }
    }
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
                    imgSrc: IceRad,
                    link: 'https://www.instagram.com/icerad'
                },
                {
                    imgSrc: IFO,
                    link: 'https://www.instagram.com/icefreestyleroffenburg'
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
                    imgSrc: MunichEast,
                    link: 'https://www.youtube.com/@ice.freestyler.muenchen-ost'
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
