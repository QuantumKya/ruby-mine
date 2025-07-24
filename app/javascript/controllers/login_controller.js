import { Controller } from "@hotwired/stimulus"
import { setPID } from 'stats_helper';

// Connects to data-controller="login"
export default class extends Controller {
    static targets = ["uname", "pword", "errText"]

    connect() {
    }

    showError(err) {
        this.errTextTarget.style.display = 'block';
        this.errTextTarget.innerHTML = err;
    }

    async encodePW(pw) {
        const utf8pword = new TextEncoder().encode(password)
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', utf8pword);
        const hashArr = Array.from(new Uint8Array(hashBuffer));
        return hashArr.map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    login(event) {
        event.preventDefault();

        const username = this.unameTarget.value;
        const password = this.pwordTarget.value;

        if (username === '') {
            this.showError("Username is a required field.");
            return;
        }
        if (password === '') {
            this.showError("Password is a required field.");
            return;
        }

        fetch(`api/players/lookup?name=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'found') {
                this.encodePW(password)
                .then(hash => {
                    if (hash === data.pword) {
                        setPID(data.id);
                        window.location.href = '/game';
                    }
                    else this.showError("Incorrect password...");
                })
                .catch(error => console.error("Error while encoding password:", error));
            }
            else this.showError("No registered player with that name exists...");
        })
        .catch(error => console.error("Error while fetching:", error));
    }

    signup(event) {
        event.preventDefault();

        const username = this.unameTarget.value;
        const password = this.pwordTarget.value;
        const pwCheck = this.element.querySelector('#pw2').value;


        if (username === '') {
            this.showError("Username is a required field.");
            return;
        }
        if (password === '') {
            this.showError("Password is a required field.");
            return;
        }
        if (pwCheck === '') {
            this.showError("Password repeat check is a required field.");
            return;
        }

        if (pwCheck !== password) {
            this.showError("Passwords do not match.");
            return;
        }

        let check;
        fetch(`api/players/lookup?name=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            check = (data.status === 'found');
        })
        .catch(error => console.error("Error while looking up player name:", error));
        if (check) {
            this.showError("Name is already taken.");
            return;
        }

        this.encodePW(password)
        .then(hash => {
            fetch('api/players', {
                method: 'POST',
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({
                    player: {
                        name: encodeURIComponent(username),
                        pword: hash
                    }
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.name === username) {
                    setPID(data.id);
                    window.location.href = '/game';
                }
                else console.error("Error creating new user:", data.errors);
            })
            .catch(error => console.error("Error while fetching:", error));
        })
        .catch(error => console.error("Error while encoding password:", error));
    }
}
