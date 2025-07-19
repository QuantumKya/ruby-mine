import { Controller } from "@hotwired/stimulus"
import { getRubies, addRubies, init } from "rubies_helper";

// Connects to data-controller="mine"
export default class extends Controller {
    static targets = ["pickaxe", "breakImgs", "rubyCount"];

    connect() {
        this.playerID = 1;

        this.mining = false;
        this.durability = 8;
        this.speed = 1;

        this.cssfmt = (a) => `translateX(80%) translateY(-250px) scale(2.5) scaleX(-1) rotate(${a}deg)`;

        init(this.playerID)
        .then(response => {
            this.rubyCountTarget.innerHTML = `<strong>Rubies: ${getRubies(this.playerID)}</strong>`
        });
    }

    mine(event) {
        this.pickaxeTarget.style.transition = `transform ${400/this.speed}ms ease-in`;

        event.preventDefault();
        if (this.mining) return;
        this.pickaxeTarget.style.transform = this.cssfmt(30);
        this.mining = true;
        setTimeout(() => {
            this.pickaxeTarget.style.transform = this.cssfmt(this.pickaxeTarget.matches(':hover') ? '-10' : '0');

            this.durability--;
            for (const child of this.breakImgsTarget.children) child.style.opacity = '0%';
            if (this.durability <= 0) {
                this.durability = 8;
                addRubies(this.playerID, 1)
                .then(response => {
                    console.log("Got a ruby!!!");
                    this.rubyCountTarget.innerHTML = `<strong>Rubies: ${getRubies(this.playerID)}</strong>`;
                });
            }
            else {
                this.breakImgsTarget.children[Math.max(7 - this.durability, 0)].style.opacity = '100%';
            }

            setTimeout(() => {
                this.mining = false;
                this.pickaxeTarget.style.transition = `transform 250ms ease-in`;
            }, 500 / this.speed);

        }, 500 / this.speed);
    }

    hover(event) {
        event.preventDefault();
        if (this.mining) return;
        this.pickaxeTarget.style.transform = this.cssfmt(-10);
    }

    unhover(event) {
        event.preventDefault();
        if (this.mining) return;
        this.pickaxeTarget.style.transform = this.cssfmt(0);
    }
}
