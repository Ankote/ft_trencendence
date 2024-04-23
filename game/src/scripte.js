document.open();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

class Ball {
    constructor(x, y, velX, velY, color, size) {
      this.x = x;
      this.y = y;
      this.velX = velX;
      this.velY = velY;
      this.color = color;
      this.size = size;
    }
}

function random(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
function randomRGB() {
return `rgb(${random(0, 255)} ${random(0, 255)} ${random(0, 255)})`;
};

function draw() {
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  const testBall = new Ball(50, 100, 4, 4, "blue", 10);
  document.close();