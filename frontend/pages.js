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


export function TournamentPlayersPage() {


    return `
    <h1>Players in Tournament</h1>
		<button class="game-button" id="next">next Match</button>
    <div id="playersList"></div>
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

