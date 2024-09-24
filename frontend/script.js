// Import the functions from the modules
import * as page from './pages.js';
import * as localT from './localTournament.js'
import {  matchMakingHandling } from './singleMatchRemote.js';
import * as utils from './utils.js';
import * as sigleLocal from './singleMatchLocal.js'
// Select table

utils.changeContent(page.game_dashboard());

let ID = ""
let username = ""
let data = {}
let players = {}
let type = ""

// console.log(document.baseURI)
// console.log(document.URL)
// console.log(document.cookie)
// console.log(document.documentElement)
// document.body.style.backgroundColor = 'red'
document.addEventListener("DOMContentLoaded", event => {
    let oneVSoneBtn = document.getElementById('local_button')
    let singleBtn = document.getElementById('online_button')
    let loginBtn = document.getElementById('login')
    let tourBtn = document.getElementById('tour_button')

    if (singleBtn) {
        //console.log("found")
        singleBtn.onclick = function display() {
                // utils.changeContent(page.watingPlayersPage());
                matchMakingHandling();
        };
    }
    if (tourBtn) {
        tourBtn.onclick = function display() {
            utils.changeContent(page.choiseTournamentPage());
            localT.handelTournament()
        };
    }
    if (oneVSoneBtn)
    { 
        //console.log("single")
        oneVSoneBtn.onclick = function display() {
            sigleLocal.singleMatchHandle();
        // localT.handelTournament()
    };

    }
    // if (joinBtn) {
    //     joinBtn.onclick = function display() {
    //         if (ID != "") {
    //             //console.log("ayooow")
    //             nickname = document.getElementById('nickname').value;
    //             //console.log("hi : " + document.getElementById('nickname').value)
    //             utils.changeContent(page.watingPlayersPage());
    //             matchTournament(nickname);

    //         }
    //     };
    // }

})
