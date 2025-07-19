let totalRubies = 0;

export const init = async (playerID) => {
    return fetch(`api/players/${playerID}`)
    .then(response => response.json())
    .then(data => { totalRubies = data.rubies; console.log(totalRubies); })
    .catch(error => console.error("Error while fetching initial ruby count: ", error));
};

export const getRubies = (playerID) => {
    fetch(`api/players/${playerID}`)
    .then(response => response.json())
    .then(data => { totalRubies = data.rubies; console.log(totalRubies); })
    .catch(error => console.error("Error while fetching ruby count: ", error));

    return totalRubies;
};

export const addRubies = (playerID, dr) => {
    totalRubies += dr;
    fetch(`api/players/${playerID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            player: { rubies: totalRubies }
        })
    })
    .catch(error => console.error("Error while updating ruby count: ", error));
};