const waitingAnimation = document.querySelector('#player2>.image_block');
let scale = 0.8;
let increasing = true;
let opacity = 0.3;
let animationId; 


function pulseAnimation() {
    if (increasing) {
        scale += 0.01;
        opacity += 0.01; 
        if (scale >= 1) increasing = false;
    } else {
        scale -= 0.01; 
        opacity -= 0.01;  
        if (scale <= 0.8) increasing = true;
    }
    
    waitingAnimation.style.transform = `scale(${scale})`;
    waitingAnimation.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    animationId = requestAnimationFrame(pulseAnimation);
}

function startPulseAnimation() {
    if (!animationId) {
        animationId = requestAnimationFrame(pulseAnimation);
    }
}

function stopPulseAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null; 
    }
}

const btn1 = document.getElementById('btn1')
const btn2 = document.getElementById('btn2')

