// Import the functions from the modules
import * as page from './pages.js';
import * as localT from './localTournament.js'
import {  matchMakingHandling } from './singleMatchRemote.js';
import * as utils from './utils.js';
// Select table
let player = {}
let opponent = {}
let net = {}
let ball = {}
let table = {}
let ctx

utils.changeContent(page.loginPage());

let ID = ""
let username = ""
let data = {}
let players = {}
let type = ""

document.addEventListener("click", event => {
    let oneVSoneBtn = document.getElementById('oneVSone')
    let loginBtn = document.getElementById('login')
    let tourBtn = document.getElementById('tournament')
    let  type 

    if (loginBtn) {
        loginBtn.onclick = function display() {
            ID = document.getElementById('ID').value;
            username = document.getElementById('username').value;
            utils.changeContent(page.matchMakingPage())

        };
    }
    if (oneVSoneBtn) {
        oneVSoneBtn.onclick = function display() {
            if (ID != "") {
                utils.changeContent(waitingOpponent());
                matchMakingHandling();
            }
        };
    }
    if (tourBtn) {
        tourBtn.onclick = function display() {
            if (ID != "") {
                utils.changeContent(page.choiseTournamentPage());
            }
            localT.handelTournament()
        };
    }
    // if (joinBtn) {
    //     joinBtn.onclick = function display() {
    //         if (ID != "") {
    //             console.log("ayooow")
    //             nickname = document.getElementById('nickname').value;
    //             console.log("hi : " + document.getElementById('nickname').value)
    //             utils.changeContent(page.watingPlayersPage());
    //             matchTournament(nickname);

    //         }
    //     };
    // }

})

