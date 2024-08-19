PLAYER_HEIGHT 		= 100
PLAYER_WIDTH 		=	8
BALL_START_SPEED  	= .5
COMPONRNT_LEV 		= .3
BALL_DELTA_SPEED  	= .01

class   Table:
        width = 600
        height = 400
        def __init__(self):
            self.width   = 600
            self.height  = 400
            pass
        
        def to_dict(self):
            return{
                "width" : self.width,
                "height" : self.height
            }


class Player:
    def __init__(self, x):
        self.x = x
        self.y          = Table.height / 2 - PLAYER_HEIGHT / 2
        self.width      = PLAYER_WIDTH
        self.height     = PLAYER_HEIGHT
        self.color      = "#00cc66"
        self.score      = 0
    


    def to_dict(self):
        return {
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
            "color": self.color,
            "score": self.score
        }

class Opponent:
# def __init__(self):
    x          = Table.width - PLAYER_WIDTH - 1
    y          = Table.height / 2 - PLAYER_HEIGHT / 2
    width      = PLAYER_WIDTH
    height     = PLAYER_HEIGHT
    color      = "#cc8100"
    score      = 0

    def to_dict(self):
        return {
            "x"         : self.x,
            "y"         : self.y,
            "width"     : self.width,
            "height"    : self.height,
            "color"     : self.color,
            "score"     : self.score
        }

    def update(self, event):
        if event == 'up':
            self.y += 1
        elif event == 'down':
            self.y -= 1

class Net:
    # def __init__(self):
    x      =   Table.width / 2 - 1
    y      =   0
    width  =   2
    height =   10
    color  =   'green'
    
    def to_dict(self):
        return{
            'x'     :   self.x,
            'y'     :   self.y,
            'width' :   self.width,
            'height':   self.height,
            'color' :   self.color
        }


class Ball:
    
    def __init__(self) :
        self.x			=	Table.width / 2
        self.y 			=	Table.height / 2
        self.radius		=	8
        self.speed 		=	BALL_START_SPEED
        self.color		=	"#ff4d4d"
        self.velocityX 	=	-5
        self.velocityY	=	5

    def update(self, player, opponent):
        selectPlayer = player if self.x < Net.x else opponent
        opponentP = player if self.x > Net.x else opponent
        # print(selectPlayer)
        if collision(self, selectPlayer):
            self.velocityX  =   -   self.velocityX
            self.speed      +=      BALL_DELTA_SPEED
        if self.x - self.radius < 0:
            opponentP.score += 1
            resetBall(self)
            
        if self.x - self.radius > Table.width:
            player.score += 1
            resetBall(self)

        # if (gameOver(player, opponent)):
        #     # resetBall(self)
        #     resetPlayers(player, opponent)

        # print(selectPlayer.y)
        self.x += self.velocityX * self.speed
        self.y += self.velocityY * self.speed
        if self.y - self.radius > Table.height or self.y < 0:
                self.velocityY *= -1


    def to_dict(sefl):
         return{
              
              'x'           :   sefl.x,
              'y'           :   sefl.y,
              'radius'      :   sefl.radius,
              'speed'       :   sefl.speed,
              'color'       :   sefl.color,
              'velocityX'   :   sefl.velocityX,
              'velocityY'   :   sefl.velocityY
                       
            }

def collision(ball, player):
    ball.top      = ball.y - ball.radius
    ball.bottom   = ball.y + ball.radius
    ball.left     = ball.x - ball.radius
    ball.right    = ball.x + ball.radius

    player.top    = player.y
    player.bottom = player.y + player.height
    player.left   = player.x
    player.right  = player.x + player.width
    # print(player.y)
    # print(f"Ball - Top: {ball.top}, Bottom: {ball.bottom}, Left: {ball.left}, Right: {ball.right}")
    # print(f"Player - Top: {player.top}, Bottom: {player.bottom}, Left: {player.left}, Right: {player.right}")


    collision_detected = (
        ball.right > player.left and ball.bottom > player.top
        and ball.left < player.right and ball.top < player.bottom
    )

    # print(f"Collision detected: {collision_detected}")
    
    return collision_detected



def alep(a, b, t):
	return (a + (b - a) * t)

# print("Start")
# time.sleep(2)  # Pause for 2 seconds
# print("End")

def resetBall(ball):

    ball.x			=	Table.width / 2
    ball.y 			=	Table.height / 2
    ball.radius		=	8
    ball.speed 		=	BALL_START_SPEED
    ball.color		=	"#ff4d4d"
    ball.velocityX 	=	- ball.velocityX
    ball.velocityY	=	- ball.velocityY
	

def moveBot(paddle, ball):
    paddle.y = ball.y - paddle.height / 2

def gameOver(player1, player2, winScore):
    if player1.score == winScore:
        return player1
    elif player2.score == winScore:
        return player2
    else :
        return None

def resetPlayers(player, opponent):
     player.y = Table.height / 2 - PLAYER_HEIGHT / 2
     player.score = 0
     opponent.y = Table.height / 2 - PLAYER_HEIGHT / 2
     opponent.score = 0

def gameOver(player1, player2):
    if player1.score >= 2 and player1.score - player2.score >= 2:
        return player1
    elif player2.score >= 2 and player2.score - player1.score >= 2:
        return player2
    return None

def movePlayer(key, lplaye, rplayer):
    pass
#instiate objects
# player = Player()
# opponent = Opponent()
# ball = Ball()
# net = Net()

