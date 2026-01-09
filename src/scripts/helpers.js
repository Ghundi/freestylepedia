//helpers
import {useCategoryStore, useCurSearchStore, useMarkedStore, useMasteredStore, useSelCategoryStore, useSelDifficultyStore} from "@/scripts/store.js";


export function sortedVideos(tricks, sortOption)  {
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
                return [...tricks].sort((a, b) => a.releaseDate - b.releaseDate);
            case 'releasedUp':
                return [...tricks].sort((a, b) => b.releaseDate - a.releaseDate);
            default:
                return [...tricks];
        }
    }
    catch(e) {
        return e
    }
}

export function filteredVideos(videos) {
            const selDifficulties = useSelDifficultyStore().val;
            const selCategories = useSelCategoryStore().categories;
            const curSearch = useCurSearchStore().val;
            const markedStore = useMarkedStore();
            const masteredStore = useMasteredStore();
            const filtered = [];
            try{
                for(let i = 0; i < videos.length; i++) {
                    // if in between difficulty
                    if( selDifficulties[0] <= videos[i].difficulty && videos[i].difficulty <= selDifficulties[1]) {
                        // if matches selected categories
                        if((selCategories.length > 0) ? selCategories.includes(videos[i].category) : true) {
                            for (let j = 0; j < videos[i].title.length; j++) {
                                // if search at least partially matches
                                if((curSearch) ? videos[i].title[j].toLowerCase().includes(curSearch.toLowerCase()) : true) {
                                    // if trick is mastered
                                    if(markedStore.selMarkers.includes('mastered') && masteredStore.isMastered(videos[i].title[0])) {
                                        filtered.push(videos[i]);
                                        break;
                                    }
                                    else if(markedStore.selMarkers.includes('non-mastered') && !masteredStore.isMastered(videos[i].title[0])) {
                                        filtered.push(videos[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                return filtered;
            }
            catch(e) {
                return e
            }
        }

export function trickToNode(trick, orientation = 3) {
    return {
        name: trick.title[0],
        children: [],
        orientation: orientation,
        difficulty: trick.difficulty,
        width: 1,
        height: 1
    };
}

export function graphSearch(trickTitle, graph) {
    let visited = [];
    for (let i = 0; i < graph.children.length; i++) {
        if (!visited.includes(graph.children[i])) {
            visited.push(graph.children[i].name)
            if (graph.children[i].name === trickTitle) {
                return graph.children[i];
            } else {
                if (graph.children[i].children.length > 0) {
                    let res = graphSearch(trickTitle, graph.children[i]);
                    if (res != null) {
                        return res
                    }
                }
            }
        }
    }
}

export function getNodeIdxById(id, nodes) {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
            return i;
        }
    }
    return -1;
}

export function getSpaceIdx(name, spaces) {
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

export function checkSpace(y, x, width, height, spaces) {
    for (let i = y; i < y + height; i++) {
        for (let j = x; j < x + width; j++) {
            if (spaces[i][j] !== false) {
                return false;
            }
        }
    }
    return true;
}

export function getBgColor(dark) {
    return dark ? '#222222' : '#eeeeee'
}

export function toPath(str) {
    return str.replaceAll(' ', '_');
}

export function pathToStr(path) {
    return path.replaceAll('_', ' ');
}

function changeTimeZone(date, timeZone) {
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

export function isReleased(trick) {
    let trickDate = new Date(trick.releaseDate);
    let today = new Date();
    today = changeTimeZone(today, 'Europe/Berlin');
    // UNIX timestamp of trick in the past
    return (Math.floor(trickDate.getTime() / 1000) < Math.floor(today.getTime() / 1000));
}
