document.open();
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let width = (canvas.width = (window.innerWidth / 2 + window.innerWidth / 16))
let height = (canvas.height = (width / 2 + width / 16))

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB() {
  return `rgb(${random(0, 255)} ${random(0, 255)} ${random(0, 255)})`;
}

class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

    draw()
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

  update(player1, player2)
  {

        if ((this.x) >= width - player2.playerW - 1) {
			if ((this.y >= player2.y - player2.playerH / 2) && (this.y < player2.y + player2.playerH / 2) )
			{
				this.velX = -(this.velX);
			}
			else
			{
				this.x = width / 2;
				this.y = height / 2;
				this.velX = -(this.velX);

				player1.score ++;
				console.log("player 2 : " + player2.score);
				console.log("player 1 : " + player1.score);

			}
        }
        if ((this.x) <= player1.playerW - 1)
		{
		
			if ((this.y >= player1.y - player1.playerH / 2) && (this.y < player1.y + player1.playerH / 2) )
			{
				this.velX = -(this.velX);
			}
			else
			{
				this.x = width / 2;
				this.y = height / 2;
				this.velX = -(this.velX);
				player2.score ++;
				console.log("player 2 : " + player2.score);
				console.log("player 1 : " + player1.score);
	
			}
        }
        if ((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        }
        if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }
        this.x += this.velX;
        this.y += this.velY;
	}    
}

class player
{
    constructor(x, y, velY, playerH, playerW, score)
    {
        this.playerH = playerH;
        this.playerW = playerW;
        this.velY = velY;
        this.x = x;
        this.y = y;
		this.score = score;
    }
    draw()
    {
        ctx.beginPath();
        ctx.fillStyle = "#fb0";
        ctx.fillRect(this.x, this.y - (this.playerH / 2),this.playerW , this.playerH);
    }

  
}

function  update(player1, player2)
{
	document.addEventListener("keydown", event =>
	{
		if (event.key == "w")
		{
			if (player1.y > player1.playerH / 2)
			{
				player1.y -= 0.05;
				console.log(player1.y);
			}
		}
		else if (event.key == "s")
		{
			if (player1.y <= height - player1.playerH / 2)
			{
				player1.y += 0.05;
				console.log(player1.y);
			}
		}
		else if (event.key == "ArrowUp")
		{
			if (player2.y > player2.playerH / 2)
			{
				player2.y -= 0.05;
				console.log(player2.y);
			}
		}
		else if (event.key == "ArrowDown")
		{
			if (player2.y <= height - player2.playerH / 2)
			{
				player2.y += 0.05;
				console.log(player2.y);
			}
		}
	});
}

    const size = 5;
    const ball = new Ball(width / 2, height / 2, 3, 3, randomRGB(),size,);
    const player1 = new player(0, height / 2, 3, 100, 10, 0);
    const player2 = new player(width - 10, height / 2, 2, 100, 10, 0);

function loop() {
	ctx.fillStyle = "rgb(152 246 243 / 50%)";
	ctx.fillRect(0, 0, width, height);

	ball.draw();
	ball.update(player1, player2		);
	player1.draw();
	player2.draw();
	update(player1, player2);
	//   ball.collisionDetect();

	requestAnimationFrame(loop);
}

loop(); 

document.addEventListener("keydown", event =>
{ 
	console.log("ankote reda");
});

// document.addEventListener("keyup", event =>
// {
//   	console.log(event.key);
// });
// console.log(" a YUOUIUU!");