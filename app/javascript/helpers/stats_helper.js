
export const apiPath = window.location.hostname === "localhost"
    ? "/api/players"
    : "https://ruby-mine.onrender.com/api/players";

export const init = async () => {
    return fetch(`${apiPath}/${getPID()}`)
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("totalRubies", data.rubies);
        localStorage.setItem("pickaxesUnlocked", data.pickaxe);
        localStorage.setItem("fortune", data.fortune);
        localStorage.setItem("efficiency", data.efficiency);
        localStorage.setItem("selectedPickaxe", 0);
    })
    .catch(error => console.error("Error while fetching initial player data: ", error));
};

export const getRubies = () => parseInt(localStorage.getItem("totalRubies"));
export const getPickaxes = () => {
    const binArr = parseInt(localStorage.getItem("pickaxesUnlocked")).toString(2).split('');
    return binArr.map(char => char === '1').reverse();
}

export const setPID = (id) => localStorage.setItem('player_id', id);
export const getPID = () => parseInt(localStorage.getItem('player_id'));

export const getFortune = () => parseInt(localStorage.getItem("fortune"));
export const getEfficiency = () => parseInt(localStorage.getItem("efficiency"));

export const getPick = () => parseInt(localStorage.getItem("selectedPickaxe"));
export const setPick = (pick) => localStorage.setItem("selectedPickaxe", pick);


export const addRubies = async (dr) => {
    localStorage.setItem("totalRubies", getRubies() + dr);
    return fetch(`${apiPath}/${getPID()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            player: { rubies: getRubies() }
        })
    })
    .then(response => window.dispatchEvent(new CustomEvent('rubies_updated')))
    .catch(error => console.error("Error while updating ruby count: ", error));
};

export const subRubies = async (dr) => addRubies(-dr);

export const unlockPickaxe = async (level) => {
    localStorage.setItem("pickaxesUnlocked", parseInt(localStorage.getItem("pickaxesUnlocked")) + Math.pow(2, level));
    return fetch(`${apiPath}/${getPID()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            player: { pickaxe: localStorage.getItem("pickaxesUnlocked") }
        })
    })
    .then(response => window.dispatchEvent(new CustomEvent('pickaxe_updated')))
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
    localStorage.setItem("fortune", getFortune() + 1);
    return fetch(`${apiPath}/${getPID()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            player: { fortune: getFortune() }
        })
    })
    .catch(error => console.error("Error while buying Fortune: ", error));
};

export const buyEfficiency = async () => {
    localStorage.setItem("efficiency", getEfficiency() + 1);
    return fetch(`${apiPath}/${getPID()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            player: { efficiency: getEfficiency() }
        })
    })
    .catch(error => console.error("Error while buying Fortune: ", error));
};