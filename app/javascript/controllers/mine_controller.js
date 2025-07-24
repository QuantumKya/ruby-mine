import { Controller } from "@hotwired/stimulus"
import { getRubies, addRubies, getPick, init, getEfficiency, getFortune, getPID } from "stats_helper";

// Connects to data-controller="mine"
export default class extends Controller {
    static targets = ["pickaxe", "breakImg", "rubyCount"];

    connect() {
        if (localStorage.length <= 0) {
            window.alert("You haven't logged in yet!\nRedirecting to login page.");
            window.location.href = '/';
        }

        this.mining = false;
        this.durability = 8;
        this.speed = 1;

        this.cssfmt = (a) => `translateX(80%) translateY(-250px) scale(2.5) scaleX(-1) rotate(${a}deg)`;

        window.addEventListener('pickaxe_updated', () => this.updatePickaxe());
        window.addEventListener('rubies_updated', () => this.updateRubyCount());

        this.initMine();
    }

    initMine() {
        init()
        .then(response => {
            this.updateRubyCount();
            this.updatePickaxe();
        });
    }

    calcSpeed() {
        let spd = 1;
        spd = 1 + [0, 5, 7, 10, 15, 23, 30, 50].at(getPick()) / 7.5;
        spd *= 1 + 0.145 * getEfficiency();
        this.speed = spd;
    }

    updateRubyCount() {
        this.rubyCountTarget.innerHTML = `<strong>Rubies: ${getRubies()}</strong>`;
    }

    updatePickaxe() {
        this.pickaxeTarget.src = window.pickaxeImages[getPick()];
    }

    mine(event) {
        this.calcSpeed();
        this.pickaxeTarget.style.transition = `transform ${400/this.speed}ms ease-in`;

        event.preventDefault();
        if (this.mining) return;
        this.pickaxeTarget.style.transform = this.cssfmt(30);
        this.mining = true;
        setTimeout(() => {
            this.pickaxeTarget.style.transform = this.cssfmt(this.pickaxeTarget.matches(':hover') ? '-10' : '0');

            this.durability -= (this.speed >= 30) ? Math.floor(this.speed / 30) : 1;
            this.breakImgTarget.style.opacity = '0%';
            if (this.durability <= 0) {
                addRubies((Math.floor(-this.durability/8) + 1) * (getFortune() + 1))
                .then(response => {
                    this.durability += 8 * Math.floor(-this.durability/8) + 8;
                    console.log("Got a ruby!!!");
                    this.updateRubyCount();
                });
            }
            if (this.durability !== 0) {
                this.breakImgTarget.src = window.breakImages[Math.max(7 - this.durability, 0)];
                this.breakImgTarget.style.opacity = '100%';
            }


            setTimeout(() => {
                this.mining = false;
                this.pickaxeTarget.style.transform = this.cssfmt(this.pickaxeTarget.matches(':hover') ? '-10' : '0');
                this.pickaxeTarget.style.transition = `transform ${250 * 2/this.speed}ms ease-in`;
            }, 350 / this.speed);

        }, 350 / this.speed);
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
