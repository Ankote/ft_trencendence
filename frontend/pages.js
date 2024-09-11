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
						<div class="player_name" id="lplayer_name">Ankote Ayoub</div>
						<div class="player_score" id="lplayer_score">11</div>
					</div>

					<div class="player_info" id="rplayer_info" style="order: 3">
						<div class="player_name" id="rplayer_name"  style="order: 2">Ayoub belhadj</div>
						<div class="player_score" id="rplayer_score"  style="order: 1">9</div>
					</div>

				</div>
				<div class="separate"></div>
				<div class="game">
					<canvas id='table'></canvas>
				</div>
			</div>

		</div>
    `;
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

export function matchMakingPage() {


    return `
		 
	<div class="button-container">
		<button class="game-button" id="oneVSone">1 vs 1</button>
		<button class="game-button" id="singleLocal">1 vs 1 local</button>
		<button class="game-button play-bot-button">Play with Bot</button>
		<button class="game-button play-bot-button" id="tournament">Play Tournament</button>
	</div>'
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

