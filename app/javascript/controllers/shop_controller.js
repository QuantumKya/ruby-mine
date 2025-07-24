import { Controller } from "@hotwired/stimulus"
import * as stats from "stats_helper";

// Connects to data-controller="shop"
export default class extends Controller {
    static targets = ["pickaxeMenu", "fortuneText", "fortunePrice", "efficiencyText", "efficiencyPrice"];

    pickPrices = [0, 10, 20, 40, 65, 100, 185, 300];

    connect() {
        window.addEventListener('rubies_updated', () => this.updatePicks());

        this.initShop();
    }

    updatePrices() {
        this.efficiencyTextTarget.innerHTML = `<strong>Efficiency ${stats.romanize(stats.getEfficiency())}</strong>`;
        this.efficiencyPriceTarget.innerHTML = `Upgrade - ${Math.floor(Math.pow(1.15, stats.getEfficiency()) * 5)} <img src=${window.rubyImg} alt="rubies" class="w-[20px] inline-block align-middle">`;

        this.fortuneTextTarget.innerHTML = `<strong>Fortune ${stats.romanize(stats.getFortune())}</strong>`;
        this.fortunePriceTarget.innerHTML = `Upgrade - ${Math.floor(35 + Math.pow(1.15, stats.getFortune()) * 5)} <img src=${window.rubyImg} alt="rubies" class="w-[20px] inline-block align-middle">`;
    }

    initShop() {
        stats.init()
        .then(response => {
            this.updatePrices();

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

    clickE() {
        const price = Math.floor(Math.pow(1.15, stats.getEfficiency()) * 5);
        if (stats.getRubies() < price) return;

        stats.subRubies(price);
        stats.buyEfficiency()
        .then(response => this.updatePrices());
    }

    clickF() {
        const price = Math.floor(35 + Math.pow(1.15, stats.getFortune()) * 5);
        if (stats.getRubies() < price) return;

        stats.subRubies(price);
        stats.buyFortune()
        .then(response => this.updatePrices());
    }

    buyPickaxe(level) {
        stats.subRubies(this.pickPrices[level]);
        stats.unlockPickaxe(level)
        .then(response => {
            stats.setPick(level);
            window.dispatchEvent(new CustomEvent('pickaxe_updated'));
            this.updatePicks();
        });
    }

    saveProgress() {
        stats.saveText(document.getElementById('save-text'));
    }
}
