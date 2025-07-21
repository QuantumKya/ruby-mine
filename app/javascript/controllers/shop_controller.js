import { Controller } from "@hotwired/stimulus"
import { init, getPickaxes, getFortune, getEfficiency, unlockPickaxe, getPick, setPick, buyFortune, buyEfficiency, romanize } from "stats_helper";

// Connects to data-controller="shop"
export default class extends Controller {
    static targets = ["pickaxeMenu", "fortuneText", "efficiencyText"];

    connect() {
        this.playerID = 1;

        init(this.playerID)
        .then(response => {
            this.fortuneTextTarget.innerHTML = `Fortune ${romanize(getFortune())}`;
            this.efficiencyTextTarget.innerHTML = `Efficiency ${romanize(getEfficiency())}`;

            this.updatePicks();
        });
    }

    updatePicks() {
        Array.from(this.pickaxeMenuTarget.children).forEach((pick, i) => {
            pick.children[0].src = getPickaxes()[i] ? window.pickaxeImages[i] : window.missingPickaxe;
            pick.onclick = getPickaxes()[i] ? () => {
                setPick(i);
                console.log("something");
                this.updatePicks();
                window.dispatchEvent(new CustomEvent("pick_update", { detail: { message: "update the pickaxe" } }));
            }
            : () => {};

            pick.style.borderColor = getPick() === i ? "#EDC480" : "black";
        });
    }

    clickF() {
        buyFortune(this.playerID)
        .then(response => this.fortuneTextTarget.innerHTML = `Fortune ${romanize(getFortune())}`);
    }

    clickE() {
        buyEfficiency(this.playerID)
        .then(response => this.efficiencyTextTarget.innerHTML = `Efficiency ${romanize(getEfficiency())}`);
    }

    buyPickaxe(level) {
        unlockPickaxe(this.playerID, level)
        .then(response => this.updatePicks());
    }
}
