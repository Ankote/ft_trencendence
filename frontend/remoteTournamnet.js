
function logicTournament(room_name) {
    let url = `ws://127.0.0.1:8000/ws/tournamentLogic/` + room_name + '/'
    const tournamentLogicSocket = new WebSocket(url);
    tournamentLogicSocket.onopen = function(event) {
        console.log("connection stablished logic")
    };

}

export function matchTournament() {
    let url = `ws://127.0.0.1:8000/ws/tournament/` + type + '/'
    const tounamentSockcet = new WebSocket(url);

    tounamentSockcet.onopen = function(event) {
        console.log("connection stablished")
        tounamentSockcet.send(JSON.stringify({
            'id': ID,
            'username': username
        }))
    };

    tounamentSockcet.onmessage = function(event) {
        console.log("message recieved")

        let data = JSON.parse(event.data);
        console.log(data)
        if (data.status == 'waiting') {

            console.log("waiting")
        }
        if (data.status == 'start_game') {

            players = data.players
            changeContent(TournamentPlayersPage())
            logicTournament(data.room_name);
        }
    };
};
