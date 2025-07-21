import { Controller } from "@hotwired/stimulus"
import { setPID } from 'stats_helper';

// Connects to data-controller="login"
export default class extends Controller {
    connect() {
    }

    login(event) {
        event.preventDefault();

        const username = this.element.querySelector("#username").value;

        fetch(`api/players/lookup?name=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'found') {
                console.log(`Player ID: ${data.id}`);

                setPID(data.id);
                window.location.href = '/game';
            }
            else console.error(`Error finding player with given username '${username}'`, data.error);
        })
        .catch(error => console.error("Error while fetching:", error));
    }
}
