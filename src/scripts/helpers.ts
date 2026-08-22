//helpers
import {useCategoryStore, useCurSearchStore, useMarkedStore, useMasteredStore, useSelCategoryStore, useSelDifficultyStore, useTodoStore} from "@/scripts/store";
import { TrickNode, Trick } from "@/scripts/trickStore";
import { Position, Node } from '@vue-flow/core'

export function list2Trick(list: Array<any>): Trick {
    return Object({
        trickID: list[0].slice(5),
        title: list[1],
        videoID: list[2],
        difficulty: list[3],
        category: list[4].toLowerCase(),
        releaseDate: new Date(list[5]),
        requirements: list[6].map((t: string) => t.slice(5)),
        connections: list[7].map((t: string) => t.slice(5))
    })
}

export function isMobile(): boolean {
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function getOrientation(): string {
  return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
}

export function getPosition(orientation: number): Position {
  switch (orientation) {
    case 0:
      return Position.Top;
    case 1:
      return Position.Right;
    case 2:
      return Position.Bottom;
    case 3:
      return Position.Left;
    default:
    return Position.Top;
  }
}

export function strToUrl(str: string): string {
    return str.replaceAll(' ', '+')
}

export function UrlToStr(str: string): string {
    return str.replaceAll('+', ' ')
}

export function getCategorySizes(tricks: Array<Trick>): Array<number> {
    const categories = useCategoryStore().categories;
    const catSizes = new Array(categories.length).fill(0)
    for (let i = 0; i < tricks.length; i++) {
        const idx = categories.indexOf(tricks[i].category)
        catSizes[idx] += 1; 
    }
    return catSizes
}

function logicalOR(res: boolean, x: boolean): boolean {
    return res || x;
}

function trickMatchesSearch(trick: Trick, searchVal: string | null) {
    // empty search field
    if(!searchVal) {
        return true;
    }
    const search = searchVal.toLowerCase();
    // include results with hyphens
    if(!search.includes("-") && trick.title.toString().includes("-")) {
        return trick.title.map( x => x.toLowerCase().replaceAll("-", " ").includes(search) ).reduce(logicalOR, false)        
    }
    return trick.title.map( x => x.toLowerCase().includes(search) ).reduce(logicalOR, false)
}

export function getSortedTricks(tricks: Array<Trick>, sortOption: string): Array<Trick>  {
    try{
        switch (sortOption) {
            case 'difficultyDown':
                return [...tricks].sort((a, b) => b.difficulty - a.difficulty || a.title[0].localeCompare(b.title[0]));
            case 'difficultyUp':
                return [...tricks].sort((a, b) => a.difficulty - b.difficulty || a.title[0].localeCompare(b.title[0]));
            case 'nameUp':
                return [...tricks].sort((a, b) => a.title[0].localeCompare(b.title[0]));
            case 'nameDown':
                return [...tricks].sort((a, b) => b.title[0].localeCompare(a.title[0]));
            case 'releasedDown':
                return [...tricks].sort((a, b) => a.releaseDate.getTime() - b.releaseDate.getTime());
            case 'releasedUp':
                return [...tricks].sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());
            default:
                return [...tricks];
        }
    }
    catch(e) {
        console.log("Error while sorting tricks");
        return tricks;
    }
}

export function getFilteredTricks(tricks: Array<Trick>): Array<Trick> {
            const selDifficulties = useSelDifficultyStore().val;
            const selCategories = useSelCategoryStore().categories;
            const curSearch = useCurSearchStore().val;
            const markedStore = useMarkedStore();
            const masteredStore = useMasteredStore();
            const todoStore = useTodoStore();

            const filtered = [];
            try{
                for(let i = 0; i < tricks.length; i++) {
                    // if in between difficulty
                    if( selDifficulties[0] <= tricks[i].difficulty && tricks[i].difficulty <= selDifficulties[1]) {
                        // if matches selected categories
                        if((selCategories.length > 0) ? selCategories.includes(tricks[i].category) : true) {
                            // if search at least partially matches
                            if(trickMatchesSearch(tricks[i], curSearch)) {
                                // if selected mastered matches 
                                if( (markedStore.selMarkers.includes('mastered') && masteredStore.isMastered(tricks[i]))
                                    || (markedStore.selMarkers.includes('non-mastered') && !masteredStore.isMastered(tricks[i]))
                                ) {
                                    // if selected todo matches
                                    if( (markedStore.selMarkers.includes('todo') && todoStore.isOnTodo(tricks[i]))
                                        || (!markedStore.selMarkers.includes('todo') && !markedStore.selMarkers.includes('irrelevant'))
                                        || (markedStore.selMarkers.includes('irrelevant') && !todoStore.isOnTodo(tricks[i]))) 
                                    {
                                        filtered.push(tricks[i]);
                                    }
                                }
                            }
                        }
                    }
                }
                return filtered;
            }
            catch(e) {
                console.log("Error occured while filtering tricks", e)
                return tricks;
            }
        }

export function trickToNode(trick: Trick, orientation = 3): TrickNode {
    return Object({
        name: trick.title[0],
        children: [],
        orientation: orientation,
        difficulty: trick.difficulty,
        width: 1,
        height: 1
    });
}

export function graphSearch(trickTitle: string, graph: TrickNode): TrickNode {
    let visited: Array<string> = [];
    for (let i = 0; i < graph.children.length; i++) {
        if (!visited.includes(graph.children[i].name)) {
            visited.push(graph.children[i].name)
            if (graph.children[i].name === trickTitle) {
                return graph.children[i];
            } 
            else {
                if (graph.children[i].children.length > 0) {
                    let res = graphSearch(trickTitle, graph.children[i]);
                    if (res != null) {
                        return res
                    }
                }
            }
        }
    }
    console.log("Error: graphSearch failed for node titled " + trickTitle);
    return graph;
}

export function getNodeIdxById(id: string, nodes: Array<Node>) {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
            return i;
        }
    }
    return -1;
}

export function getSpaceIdx(name: string, spaces: Array<Array<any>>): number {
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < spaces[0].length; x++) {
            if (spaces[y][x] === name) {
                return x
            }
        }
    }
    console.log(name, 'not found in spaces')
    return 0;
}

export function checkSpace(y: number, x: number, width: number, height: number, spaces: Array<Array<any>>): boolean {
    for (let i = y; i < y + height; i++) {
        for (let j = x; j < x + width; j++) {
            if (spaces[i][j] !== false) {
                return false;
            }
        }
    }
    return true;
}

export function getBgColor(dark: boolean): string {
    return dark ? '#222222' : '#eeeeee'
}

function changeTimeZone(date: Date, timeZone: string) {
    if (typeof date === 'string') {
        return new Date(
            new Date(date).toLocaleString('en-US', {
                timeZone,
            }),
        );
    }

    return new Date(
        date.toLocaleString('en-US', {
            timeZone,
        }),
    );
}

export function isReleased(trick: Trick) {
    let trickDate = new Date(trick.releaseDate);
    let today = new Date();
    today = changeTimeZone(today, 'Europe/Berlin');
    // UNIX timestamp of trick in the past
    return (Math.floor(trickDate.getTime() / 1000) < Math.floor(today.getTime() / 1000));
}
