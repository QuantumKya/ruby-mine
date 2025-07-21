let totalRubies = 0;
let pID = 0;

let pickaxesUnlocked = 0;
let selectedPickaxe = 0;
let fortune = 0;
let efficiency = 0;

export const init = async (playerID) => {
    pID = playerID;
    return fetch(`api/players/${pID}`)
    .then(response => response.json())
    .then(data => {
        totalRubies = data.rubies;
        pickaxesUnlocked = data.pickaxe;
        fortune = data.fortune;
        efficiency = data.efficiency;
    })
    .catch(error => console.error("Error while fetching initial player data: ", error));
};

export const getRubies = () => totalRubies;
export const getPickaxes = () => {
    const binArr = pickaxesUnlocked.toString(2).split('');
    return binArr.map(char => char === '1').reverse();
}

export const getFortune = () => fortune;
export const getEfficiency = () => efficiency;

export const getPick = () => selectedPickaxe;
export const setPick = (pick) => { selectedPickaxe = pick; };


export const addRubies = async (dr) => {
    totalRubies += dr;
    return fetch(`api/players/${pID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            player: { rubies: totalRubies }
        })
    })
    .then(response => window.dispatchEvent(new CustomEvent('rubies_updated', { detail: { rubyCount: totalRubies }})))
    .catch(error => console.error("Error while updating ruby count: ", error));
};

export const unlockPickaxe = async (level) => {
    pickaxesUnlocked += Math.pow(2, level);
    return fetch(`api/players/${pID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            player: { pickaxe: pickaxesUnlocked }
        })
    })
    .then(response => window.dispatchEvent(new CustomEvent('pickaxe_updated', { detail: { rubyCount: totalRubies }})))
    .catch(error => console.error("Error while updating pickaxes: ", error));
};

export const romanize = (num) => {
    if (num === 0) return '0';

    var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;
    for (i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}

export const buyFortune = async () => {
    fortune++;
    return fetch(`api/players/${pID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            player: { fortune: fortune }
        })
    })
    .catch(error => console.error("Error while buying Fortune: ", error));
};

export const buyEfficiency = async () => {
    efficiency++;
    return fetch(`api/players/${pID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            player: { efficiency: efficiency }
        })
    })
    .catch(error => console.error("Error while buying Fortune: ", error));
};