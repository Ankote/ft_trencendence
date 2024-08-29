// Draw shapes & text functions

export function changeContent(newContent) {
        document.getElementById('page').innerHTML = newContent;
};
let ctx = null
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
function drawRoundedRect(x, y, width, height, color, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();

    // Apply shadow properties for a shiny effect
    ctx.shadowColor = 'rgba(255, 105, 180, 0.8)'; // Light pink shadow for a shiny effect
    ctx.shadowBlur = 20; // Increased shadow blur radius for a glowing effect
    ctx.shadowOffsetX = 5; // Horizontal shadow offset
    ctx.shadowOffsetY = 5; // Vertical shadow offset

    // Fill color
    ctx.fillStyle = color;
    ctx.fill(); // Apply the fill color

    // Clear shadow settings if you don't want them to affect other drawings
    ctx.shadowColor = 'transparent';
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

function drawNet(table, net) {
    for (let i = 0; i <= table.height; i += 40) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawPlayer(player) {
    drawRoundedRect(player.x,player.y, player.width, player.height, player.color, 5)
    // drawRect(player.x, player.y, player.width, player.height, player.color);
}

export function render(lplayer, rplayer, ball, table, net) {
    // Clear the cenves
    if (!ctx)
    {
        const canv = document.getElementById("table");
        canv.width = table.width 
        canv.height = table.height
        if (canv)
            ctx = canv.getContext("2d");
    }
    
    drawRect(0, 0, table.width, table.height, "#0B0D22");
    // Draw Net
    drawNet(table, net);
    //Drawthe ball
    drawBall(ball.x, ball.y, ball.radius, ball.color)
        //Draw players
    drawPlayer(lplayer)
    drawPlayer(rplayer)
        //display scors

}

// Check collision and AI movement can be added here

// function game() {
// 	render();
// }

// const FPS = 60; // frames per second
// setInterval(game, 1000 / FPS);