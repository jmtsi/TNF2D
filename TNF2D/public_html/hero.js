function Hero(startVector) {
    this.position = startVector;
    this.turnSpeed = 1;
    this.walkingSpeed = 1.3;
    this.width = 100;
    this.height = 100;
    this.angle = 0;
    this.sprite = loader.loadImage("img/herosheet.png");
    //console.log(this.sprite);

}

Hero.prototype.update = function() {
    this.turn();
    if(keyhandler.up) {
        this.move();
    }
}

Hero.prototype.turn = function() {
    var dx = keyhandler.cursorX - game.canvas.width/2;
    var dy = keyhandler.cursorY - game.canvas.height/2;
    var newAngle = -(Math.atan2(dy, dx)*(180/Math.PI));
    //console.log(newAngle);

    if(newAngle > this.angle % 360) {
        this.turnRight();
    }
    else if(newAngle < this.angle % 360) {
        this.turnLeft();
    }
}

Hero.prototype.turnRight = function() {
    this.angle += this.turnSpeed;

}

Hero.prototype.turnLeft = function() {
    this.angle -= this.turnSpeed;
}


Hero.prototype.move = function() {
    var x = Math.floor(this.position.x/400);
    var y = Math.floor(this.position.y/400);

    var positionX = this.position.x/400-(Math.floor(this.position.x/400));
    var positionY = this.position.y/400-(Math.floor(this.position.y/400));

    var xMovement = Math.sin(this.angle * (Math.PI / 180)+ Math.PI/2) * this.walkingSpeed;
    var yMovement = Math.cos(this.angle * (Math.PI / 180)+ Math.PI/2) * this.walkingSpeed;

    if (xMovement > 0) {
        if(dungeon.map[x][y].RIGHTWALL && positionX > .64) {
            xMovement = 0;
        }
    }
    if (xMovement < 0) {
        if(dungeon.map[x][y].LEFTWALL && positionX < .36) {
            xMovement = 0;
        }
    }
    if (yMovement > 0) {
        if(dungeon.map[x][y].TOPWALL && positionY > .64) {
            yMovement = 0;
        }
    }
    if (yMovement < 0) {
        if(dungeon.map[x][y].LEFTWALL && positionY < .36) {
            yMovement = 0;
        }
    }
    this.position.x += xMovement;
    this.position.y += yMovement;
}