const pickaxe = document.getElementById('pickaxe');
const breakImgs = document.getElementById('break-imgs');
const rubyCount = document.getElementById('ruby-count');

let playerID = 1;

let mining = false;
let durability = 8;

let rubies = 0;
fetch(`api/players/${playerID}`)
.then(response => response.json())
.then(data => { rubies = data["rubies"]; rubyCount.textContent = `Rubies: ${rubies}`; console.log(data); })
.catch(error => console.error("Error while fetching initial ruby count: ", error));


function updateRubyCount(dr) {
    rubies += dr;
    rubyCount.textContent = `Rubies: ${rubies}`;
    fetch(`api/players/${playerID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            player: { rubies: rubies }
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error while updating ruby count: ", error));
}



pickaxe.onmousedown = (event) => {
    event.preventDefault();
    if (mining) return;
    pickaxe.style.transform = 'translateX(80%) translateY(-250px) scale(2.5) scaleX(-1) rotate(30deg)';
    mining = true;
    setTimeout(() => {
        pickaxe.style.transform = `translateX(80%) translateY(-250px) scale(2.5) scaleX(-1) rotate(${pickaxe.matches(':hover') ? '-10deg' : '0deg'})`;

        durability--;
        for (const child of breakImgs.children) child.style.opacity = '0%';
        if (durability <= 0) {
            durability = 8;
            updateRubyCount(1);
        }
        else {
            breakImgs.children[Math.max(7 - durability, 0)].style.opacity = '100%';
        }

        setTimeout(()=>mining = false, 350);
    }, 350);
}

pickaxe.onmouseenter = (event) => {
    event.preventDefault();
    if (mining) return;
    pickaxe.style.transform = 'translateX(80%) translateY(-250px) scale(2.5) scaleX(-1) rotate(-10deg)';
}
pickaxe.onmouseleave = (event) => {
    event.preventDefault();
    if (mining) return;
    pickaxe.style.transform = 'translateX(80%) translateY(-250px) scale(2.5) scaleX(-1) rotate(0deg)';
}