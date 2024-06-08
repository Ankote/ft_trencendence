PLAYER_HEIGHT 		= 100
PLAYER_WIDTH 		=	8
BALL_START_SPEED  	= 1
COMPONRNT_LEV 		= .3
BALL_DELTA_SPEED  	= .1

class Canvas:
	width = 600
	height = 400
	
# game.py
# game.py
# game.py

class Player:
    def __init__(self):
        self.x = 1
        self.y = 1
        self.width = 10
        self.height = 10
        self.color = "#00cc66"
        self.score = 0

    def to_dict(self):
        return {
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
            "color": self.color,
            "score": self.score
        }
