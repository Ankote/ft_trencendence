// Draw shapes & text functions

export function changeContent(newContent) {
    // if (newContent)
    // document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('page').innerHTML = newContent;
        console.log("hello")
    // });
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i <= table.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawPlayer(player) {
    drawRect(player.x, player.y, player.width, player.height, player.color);
}

export function render() {
    // Clear the cenves
    drawRect(0, 0, table.width, table.height, "BLACK");
    // Draw Net
    drawNet();
    //Drawthe ball
    drawBall(ball.x, ball.y, ball.radius, ball.color)
        //Draw players
    drawPlayer(opponent)
    drawPlayer(player)
        //display scors
    drawText(player.score, (table.width / 4.7), table.height / 5, "purple")
    drawText(opponent.score, (table.width / 4.2) * 3, table.height / 5, "purple")
}

// Check collision and AI movement can be added here

// function game() {
// 	render();
// }

// const FPS = 60; // frames per second
// setInterval(game, 1000 / FPS);