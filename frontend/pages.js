export function loginPage() {
    return `
        <input type="text" id = "ID" class="form-input" placeholder="Enter ID" required>
        <input type="text" id = "username" class="form-input" placeholder="Enter Username" required>
        <button class="submit-button" id= 'login'>Submit</button>
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
    // console.log("wewwewew")
    return `
	<div class="victory-message">
		<h1>You Win!</h1>
		<p>Congratulations, ${data.winner}!</p>
		<p>Your Score: ${data.winnerScore}</p>
	</div>
`;
}

export function winningPage(data) {
    // console.log("wewwewew")
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
    // console.log("wewwewew")

    return `
	<div class="victory-message">
		<h1>You Lose!</h1>
		<p>Good luck next time, ${data.loser}!</p>
		<p>${data.winner}: ${data.winnerScore}</p>
		<p>${data.loser}: ${data.loserScore}</p>
	</div>
`;
}

export function gamePage(room_name) {

    return `
           <canvas id='canvas' style="background : black;" width="600" height="400"></canvas>
    `;
}


export function TournamentPlayersPage() {


    return `
    <h1>Players in Tournament</h1>
    <div id="playersList"></div>
	`
};

export function matchMakingPage() {


    return `
		 
	<div class="button-container">
		<button class="game-button" id="oneVSone">1 vs 1</button>
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
