//helpers
export function trickToNode(trick, orientation = 3) {
    return {name: trick.title[0], children: [],  orientation: orientation, difficulty: trick.difficulty, width: 1, height: 1};
}

export function graphSearch(trickTitle, graph) {
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

export function getNodeIdxById(id, nodes) {
    for (let i = 0; i < nodes.length; i++) {
        if(nodes[i].id === id) {
            return i;
        }
    }
    return -1;
}

export function getSpaceIdx(name, spaces) {
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < spaces[0].length; x++) {
            if(spaces[y][x] === name) {
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
            if(spaces[i][j] !== false) {
                return false;
            }
        }
    }
    return true;
}

export function getBgColor (dark) {
    return dark ? '#222222' : '#eeeeee'
}