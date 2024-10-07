export function game_dashboard() {
    return `
     <div class="game_body">
        <section class="game_board">
            <div class="title">Choose Your Game Mode</div>
            <div class="choose_buttons">
                <div class="type_button" id="local_button">
                    <div class="texts_button play_txt">play</div>
                    <div class="texts_button type_txt">Local Match</div>
                    <div class="texts_button icon_txt mannet_icon">icon</div>
                </div>
                <div class="type_button" id="online_button">
                    <div class="texts_button play_txt">play</div>
                    <div class="texts_button type_txt">Online Match</div>
                    <div class="texts_button icon_txt global_icon">icon</div>
                </div>
                <div class="type_button" id="tour_button">
                    <div class="texts_button play_txt">play</div>
                    <div class="texts_button type_txt">Tournament</div>
                    <div class="texts_button icon_txt trophy_icon">icon</div>
                </div>
            </div>
        </section>
    </div>
    `;
}

export function beforStartMatch() {

    return `
		<div class="game_body">
			<div class="content-container">
			    <div class="left-player players-block">
                    <div class="players-card" id="lplayer-div"> <span id="lplayer_name">Alami youssef</span></div>
                    <button class="ready-button" id="left-button">Ready</button>
                </div>
                <div class="players-block">
                    <div class="vs" >
                        <span>VS</span>
                    </div>
                    <div id="timer"></div>
                </div>
			    <div class="right-player players-block">
                    <div  class="players-card"  id="rplayer-div"><span id="rplayer_name">Alami youssef</span></div>
                    <button class="ready-button" id="right-button">Ready</button>
                </div>
			</div>

		</div>
        
    `;
}

export function JoinTournamentPage() {
    return `
        <input type="text" id = "nickname" class="form-input" placeholder="Enter nickname" required>
        <button class="submit-button" id= 'join'>join</button>
    `;
}

export function choiseTournamentPage() {
    return `
        <div class="container">
            <div class="button-container">
                <button class="btn" id="tour4">Tournament 4 Players</button>
                <button class="btn" id="tour8">Tournament 8 Players</button>
                <button class="btn" id="tour16">Tournament 16 Players</button>
            </div>
        </div>
    `;
}

export function leavingGamePage() {
    // //console.log("wewwewew")
    return `
	<div class="victory-message">
		<h1>You Win!</h1>
		<p>Congratulations, ${data.winner}!</p>
		<p>Your Score: ${data.winnerScore}</p>
	</div>
`;
}

export function winningPage(data) {
    // //console.log("wewwewew")
    return `
	<div class="victory-message">
		<h1>You Win!</h1>
		<p>Congratulations, ${data.winner}!</p>
		<p>${data.winner}: ${data.winnerScore}</p>
		<p>${data.loser}: ${data.loserScore}</p>
	</div>
`;
}

export function lossingPage(data) {
    // //console.log("wewwewew")

    return `
	<div class="victory-message">
		<h1>You Lose!</h1>
		<p>Good luck next time, ${data.loser}!</p>
		<p>${data.winner}: ${data.winnerScore}</p>
		<p>${data.loser}: ${data.loserScore}</p>
	</div>
`;
}

export function gamePage() {

    return `
		
        <div class="game_body">
        <div class="game_container">
            <div class="keysInfo">
                <div class="keys" id="rightInfo"><span class="key">W</span> move up, <span class="key">S</span> move down</div>
                <div class="keys" id="leftInfo"><span class="key">⬆</span> move up, <span class="key">⬇</span> move down</div>
            </div>

            <div class="playersInfo">
                <div class="player_img" id="lplayer_img" style="order: 1;"></div>
                <div class="player_img" id="rplayer_img" style="order: 4";></div>

                <div class="player_info" id="lplayer_info" style="order: 2">
                    <div class="player_name" id="lplayer_name"></div>
                    <div class="player_score" id="lplayer_score"></div>
                </div>

                <div class="player_info" id="rplayer_info" style="order: 3">
                    <div class="player_name" id="rplayer_name"  style="order: 2"></div>
                    <div class="player_score" id="rplayer_score"  style="order: 1"></div>
                </div>

            </div>
            <div class="separate"></div>
            <div class="game">
                <canvas id='table'></canvas>
                <div class="players_carts player1" id="player1" style="display:block">
                    <div class="image_block">
                        <div class="image player1-image"></div>
                    </div>
                    <div class="name_block">Ayoub</div>
                </div>
                <div class="players_carts player2" id="player2"  style="display:block">
                    <div class="image_block">
                        <div class="image player2-image"></div>
                    </div>
                    <div class="name_block">Looking...</div>
                    <!-- <div class="name_block">Ayoub</div> -->
                </div>
                <div class="vs">VS</div>
                <div class="start_message" id="start_message" style="display:none">
                        <div>The match is going to  start at</div> <spane id="timeToStart">5</spane>
                </div>
            </div>
            </div>
        </div>

    </div>
    `;
}
export function singleMatchPage() {
    return `
    <div class="game_body">
        <div class="page_container">
            <div class="single-titles">
                <div class="oneVone"> 1 V 1 Match</div>
                <div class="custom">Cunstomize Your Game</div>
            </div>
                <div class="blocks">
                    <div class="customTable">
                        <div class="customTabelTitle single-title">Choose A table Them</div>
                        <div class="classicTbl tables" data-value="classic">
                            <div class="table">
                                <div class="lpaddle"></div>
                                <div class="rpaddle"></div>
                                <div class="ball"></div>
                                <div class="net"></div>
                            </div>
                            <div class="type">Classic</div>
                        </div>

                        <div class="standardTbl tables" data-value="standard">
                            <div class="table">
                                <div class="lpaddle"></div>
                                <div class="rpaddle"></div>
                                <div class="ball"></div>
                                <div class="net"></div></div>
                            <div class="type">Standard</div>
                        </div>

                            <div class="footballTbl tables" data-value="foot">
                                <div class="table">
                                    <div class="lpaddle"></div>
                                    <div class="rpaddle"></div>
                                    <div class="ball"></div>
                                    <div class="net"></div></div>
                                <div class="type">Football</div>
                            </div>
                    </div>

                    <div class="customPlayers">
                            <div class="customPlayersTitle single-title">Customize your player</div>
                            <div class="players">
                                <div class="player1 player">
                                    <div class="player-title">Player 1</div>
                                    <input type="text" class="playerName" placeholder="Alias/name" id ='player01'>
                                    <div class="choosePaddle">Choose paddle</div>
                                    <div class="paddles">
                                        <div class="basic" data-value="basic"><div></div></div>
                                        <div class="blood" data-value="blood"><div></div></div>
                                        <div class="ice" data-value="ice"><div></div></div>
                                    </div>
                                    <button>Ready</button>
                                </div>
                                <div class="player2 player">
                                    <div class="player-title">Player 2</div>
                                    <input type="text" class="playerName" placeholder="Alias/name" id ='player02'>
                                    <div class="choosePaddle">Choose paddle</div>
                                    <div class="paddles">
                                        <div class="basic" data-value="basic"><div></div></div>
                                        <div class="blood" data-value="blood"><div></div></div>
                                        <div class="ice" data-value="ice"><div></div></div>
                                    </div>
                                    <button>Ready</button>
                                </div>
                            </div>
                            <button id="startGame" disabled>Start Game</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
    `
}
export function tournamentPlayersJoinPage() {

    return `
    <div class="game_body">
        <div class="tournament-container">
            <h1 class="tournament-title">Join the Tournament</h1>
            <div class="input-section">
                <input type="text" id="nickname" class="player-input" placeholder="Enter your name" />
                <button class="join-btn" id='join'>Join</button>
            </div>
            <p class="player-count">Players joined: <span id="countPlayers">0</span>/<span id="tourType">4</span></p>
            <ul class="player-list">
                <!-- Joined player names will be shown here -->
            </ul>
        </div>
    </div>
    `;
}


export function TournamentBoardPage() {


    return `
     <div class="game_body">
        <section class="tournament">
            <div class="tour_divisions">
                <div class="div div1">
                    <div class="player_round1 player1 lplayer">
                        <div class="col1">
                            <div class="username_round1 username" id = "player1">player 1</div>
                        </div>
                    </div>

                    <div class="player_round1 player2 lplayer">
                        <div class="col1">
                            <div class="username_round1 username" id = "player2">player 2</div>
                        </div>
                    </div>
                </div>

                <div class="div div2">

                    <div class="player_round2 player1">
                        <div class="col1">
                            <div class="username_round2 username" id = "player11">player 1</div>
                        </div>
                    </div>
                </div>

                <div class="div div3">
                    <div class="tournament_title">pong game tournament</div>
                    <div class="trophy"></div>
                    <div class="username_round3 winner">Player 1</div>
                    <!-- <div class="champion_str">champion</div> -->
                   <!-- <input class="users_field" type="text" placeholder="username/nickname" id="nickname">-->
                    <button id="start">Start</button>
                </div>

                <div class="div div4">

                    <div class="player_round2 player1">
                        <div class="col1">
                            <div class="username_round2 username" id = "player1">player 3</div>
                        </div>
                    </div>
                </div>
                
                <div class="div div5">
                    <div class="player_round1 player1 rplayer">
                        <div class="col1">
                            <div class="username_round1 username" id = "player3">player 3</div>
                        </div>
                    </div>

                    <div class="player_round1 player2 rplayer">
                        <div class="col1">
                            <div class="username_round1 username" id = "player4">player 4</div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    </div>
	`
};


export function watingPlayersPage() {

    return `
		<div class="waiting-container">
			<div class="waiting-text">Waiting For  other Players . . .</div>
		</div>
	`
}

export function Congratulations(winner) {

    return `
		<div class="waiting-container">
			<div> Congratulation ${winner}</div>
		</div>
	`
}

