// Import the functions from the modules
import * as page from './pages.js';
import * as localT from './localTournament.js'
import * as remoteTour from './remoteTournamnet.js'
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
    let tourRemoteBtn = document.getElementById('Remot_tour_button')

    if (singleBtn) {
        singleBtn.addEventListener("click",event =>{
                matchMakingHandling();
        } )
    }
    if (tourRemoteBtn) {

        tourRemoteBtn.addEventListener("click", event=>{
            utils.changeContent(page.choiseTournamentPage());
            remoteTour.handelRemoteTournament()
        });
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
