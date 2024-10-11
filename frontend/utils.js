// Draw shapes & text functions'
import * as page from './pages.js' 

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


export function drawBall(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

export function drawText(text, x, y, color) {
    if (!ctx)
    {
        const canv = document.getElementById("table");
        canv.width = table.width 
        canv.height = table.height
        if (canv)
            ctx = canv.getContext("2d");
    }
    ctx.fillStyle = color;
    ctx.font = "14px fantasy";
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
    // if (!ctx)
    // {
        const canv = document.getElementById("table");
        canv.width = table.width 
        canv.height = table.height
        if (canv)
            ctx = canv.getContext("2d");
    // }
    
    drawRect(0, 0, table.width, table.height, table.color);
    // Draw Net
    drawNet(table, net);
    //Drawthe ball
    drawBall(ball.x, ball.y, ball.radius, ball.color)
        //Draw players
    drawPlayer(lplayer)
    drawPlayer(rplayer)
        //display scors

}


export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function setPlayersValues(player1, player2){
    let lplayer_name = document.getElementById('lplayer_name')
    let rplayer_name = document.getElementById('rplayer_name')
    if (lplayer_name && rplayer_name){
        lplayer_name.textContent = player1
        rplayer_name.textContent = player2
    }
}


export  function setPlayersScore(player1, player2){
    let lplayer_score = document.getElementById('lplayer_score')
    let rplayer_score = document.getElementById('rplayer_score')

    if (lplayer_score && rplayer_score){
        lplayer_score.textContent = player1.score
        rplayer_score.textContent = player2.score
    }
}


export async function handel_prematch(lplayerName, rplayerName){
    setPlayersValues(lplayerName, rplayerName)
    let message  = document.getElementById('start_message')
    if (message)
    {
        message.style.display = "block"
        message.innerHTML = '<div>The match is going to  start at</div> <spane id="timeToStart"></spane>'
    }
    let timer= document.getElementById('timeToStart')
    if(timer){
        for (let i = 3; i > 0; i --){
            timer.textContent = i;
            await sleep(1000)
        }
    }
    if(message)
        message.style.display="none"
}

const waitingAnimation = document.querySelector('#player2>.image_block');
let scale = 0.8;
let increasing = true;
let opacity = 0.3;
let animationId; 


function pulseAnimation(element) {
    function animate(){
        if (increasing) {
            scale += 0.01;
            opacity += 0.01; 
            if (scale >= 1) increasing = false;
        } else {
            scale -= 0.01; 
            opacity -= 0.01;  
            if (scale <= 0.8) increasing = true;
        }
        element.style.transform = `scale(${scale})`;
        element.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        animationId = requestAnimationFrame(animate);
        }
        animate();
}

export function startPulseAnimation(element) {
    
    if (!animationId) {
        pulseAnimation(element)
    }
}

export function stopPulseAnimation(element) {
    element.style.transform = `scale(1)`;
    element.style.backgroundColor = `rgba(255, 255, 255, 1)`;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null; 
    }
}


export function tournament_board(tours)
{
    let  cptTour = 1;
    let toursObjs = {}
    let objectsCpt = 0;
    changeContent(page.TournamentBoardPage())
    while (cptTour - 1 < Object.keys(tours).length)
    {
        let tourClassName = 'username_round' + cptTour;
        toursObjs = document.getElementsByClassName(tourClassName)
        if (toursObjs)
        {
            for (let i = 0; i < tours[cptTour - 1].length; i++)
            {
                toursObjs[objectsCpt++].textContent = tours[cptTour - 1][i][0];
                if (tours[cptTour - 1][i].length == 2)
                    toursObjs[objectsCpt++].textContent = tours[cptTour - 1][i][1];
            }
            cptTour++;
            objectsCpt =  0;
        }
    }
}