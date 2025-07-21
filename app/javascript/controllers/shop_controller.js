import { Controller } from "@hotwired/stimulus"
import * as stats from "stats_helper";

// Connects to data-controller="shop"
export default class extends Controller {
    static targets = ["pickaxeMenu", "fortuneText", "efficiencyText"];

    pickPrices = [0, 10, 20, 40, 65, 100, 185, 300];

    connect() {
        window.addEventListener('rubies_updated', () => this.updatePicks());

        this.initShop();
    }

    initShop() {
        stats.init(stats.getPID())
        .then(response => {
            this.fortuneTextTarget.innerHTML = `Fortune ${stats.romanize(stats.getFortune())}`;
            this.efficiencyTextTarget.innerHTML = `Efficiency ${stats.romanize(stats.getEfficiency())}`;

            this.pickaxeMenuTarget.innerHTML = '';

            for (let i = 0; i < 8; i++) {
                let div = document.createElement('div');

                let p = document.createElement('p');
                p.style.position = 'absolute';
                p.style.left = '50%';
                p.style.top = '50%';
                p.style.translate = '-50% -50%';
                p.style.color = 'white';
                p.style.textAlign = 'center';
                p.style.textShadow = '0 0 20px gray, 0 0 10px black';
                p.style.pointerEvents = 'none';
                p.style.fontSize = '125%';
                p.innerHTML = `<strong>${this.pickPrices[i]}<br>Rubies</strong>`;

                let button = document.createElement('button');
                button.appendChild(document.createElement('img'));
                button.childNodes[0].src = window.missingPickaxe;
                button.style.display = 'block';

                div.appendChild(button);
                div.appendChild(p);
                div.style.alignItems = 'center';
                div.style.position = 'relative';
                div.style.display = 'inline-block';
                this.pickaxeMenuTarget.appendChild(div);
            }

            this.updatePicks();
        });
    }

    updatePicks() {
        Array.from(this.pickaxeMenuTarget.children).forEach((pick, i) => {
            const pickBtn = pick.children[0];
            const priceText = pick.children[1];

            const isPick = stats.getPickaxes()[i];

            pickBtn.children[0].src = isPick ? window.pickaxeImages[i] : window.missingPickaxe;
            priceText.style.opacity = isPick ? '0%' : '100%';
            priceText.style.color = this.pickPrices[i] <= stats.getRubies() ? 'white' : 'red' ;

            pickBtn.onclick = isPick ? () => {
                stats.setPick(i);
                this.updatePicks();
                window.dispatchEvent(new CustomEvent('pickaxe_updated'));
            }
            : () => {
                if (stats.getRubies() >= this.pickPrices[i]) this.buyPickaxe(i);
            };

            pick.style.borderColor = stats.getPick() === i ? "#EDC480" : "black";
        });
    }

    clickF() {
        stats.buyFortune()
        .then(response => this.fortuneTextTarget.innerHTML = `Fortune ${stats.romanize(stats.getFortune())}`);
    }

    clickE() {
        stats.buyEfficiency()
        .then(response => this.efficiencyTextTarget.innerHTML = `Efficiency ${stats.romanize(stats.getEfficiency())}`);
    }

    buyPickaxe(level) {
        stats.addRubies(-this.pickPrices[level]);
        stats.unlockPickaxe(level)
        .then(response => {
            stats.setPick(level);
            window.dispatchEvent(new CustomEvent('pickaxe_updated'));
            this.updatePicks();
        });
    }
}
