PLAYER_HEIGHT 		= 128
PLAYER_WIDTH 		=	16
BALL_START_SPEED  	= 1.1
PLAYER_SPEED  	= 15
BALL_DELTA_SPEED  	= .01

class   Table:
        width = 1086
        height = 624
        def __init__(self):
            self.width   = 1086
            self.height  = 624
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
        self.color      = "#FF00FF"
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
    color      = "#FF00FF"
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
    width  =   1
    height =   20
    color  =   '#857EBB'
    
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
        self.radius		=	8.5
        self.speed 		=	BALL_START_SPEED
        self.color		=	"#D9D9D9"
        self.velocityX 	=	-5
        self.velocityY	=	5

    def update(self, lplayer, rplayer):
        selectPlayer = lplayer if self.x < Net.x else rplayer
        opponentP = lplayer if self.x > Net.x else rplayer
        # print(selectPlayer)
        if collision(self, selectPlayer):
            self.velocityX  =   -   self.velocityX
            self.speed      +=      BALL_DELTA_SPEED
            selectPlayer.color = "#FFBB00"
        else:
            selectPlayer.color = "#FF00FF"
        if self.x - self.radius < 0:
            opponentP.score += 1
            resetBall(self)
            
        if self.x - self.radius > Table.width:
            lplayer.score += 1
            resetBall(self)
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
    collision_detected = (
        ball.right > player.left and ball.bottom > player.top
        and ball.left < player.right and ball.top < player.bottom
    )

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
    ball.velocityX 	=	- ball.velocityX
    ball.velocityY	=	- ball.velocityY
	

def moveBot(paddle, ball):
    paddle.y = ball.y - paddle.height / 2

def gameOver(lplayer, rplayer, winScore):
    if lplayer.score == winScore:
        return lplayer
    elif rplayer.score == winScore:
        return rplayer
    else :
        return None

def resetPlayers(lplayer, rplayer):
     lplayer.y = Table.height / 2 - PLAYER_HEIGHT / 2
     lplayer.score = 0
     rplayer.y = Table.height / 2 - PLAYER_HEIGHT / 2
     rplayer.score = 0

def gameOver(lplayer, rplayer):
    if lplayer.score >= 10 and lplayer.score - rplayer.score >= 2:
        return lplayer
    elif rplayer.score >= 10 and rplayer.score - lplayer.score >= 2:
        return rplayer
    return None

def movePlayer(key, lplayer, rplayer, table):
    key = key.lower()
    if key == 'arrowup' and rplayer.y + PLAYER_HEIGHT -  PLAYER_SPEED > 4:
        rplayer.y -= PLAYER_SPEED
    if key == 'arrowdown' and rplayer.y + PLAYER_SPEED <  table.height -  4:
        rplayer.y += PLAYER_SPEED
    if key.lower() == 'w' and lplayer.y + PLAYER_HEIGHT -  PLAYER_SPEED > 4:
        lplayer.y -= PLAYER_SPEED
    if key.lower() == 's' and lplayer.y  + PLAYER_SPEED <  table.height -  4:
        lplayer.y+= PLAYER_SPEED

    
def getMaxPlayers(tourType):
    numberPlayers = {
        "tour4": 4,
        "tour8": 8,
        "tour16": 16
    }
    return numberPlayers.get(tourType)