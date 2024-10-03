// Import the functions from the modules
import * as page from './pages.js';
import * as localT from './localTournament.js'
import {  matchMakingHandling } from './singleMatchRemote.js';
import * as utils from './utils.js';
import * as singleLocalDashboard from './singleLocalDashboard.js'
import * as singleLocal from './singleMatchLocal.js'
// Select table

utils.changeContent(page.game_dashboard());

document.addEventListener("DOMContentLoaded", event => {
    let oneVSoneBtn = document.getElementById('local_button')
    let singleBtn = document.getElementById('online_button')
    let tourBtn = document.getElementById('tour_button')

    if (singleBtn) {
        singleBtn.addEventListener("click",event =>{
                console.log("clicked")
                // matchMakingHandling();
        } )
    }
    if (tourBtn) {

        tourBtn.addEventListener("click", event=>{
            utils.changeContent(page.choiseTournamentPage());
            localT.handelTournament()
        });
    }
    if (oneVSoneBtn)
    { 
        oneVSoneBtn.addEventListener("click", event=> {
        singleLocal.singleMatchHandle();
        // utils.changeContent(page.singleMatchPage());
        // sigleLocal.initGame()
        });
    }
})
