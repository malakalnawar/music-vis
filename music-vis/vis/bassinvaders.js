//constructor function to create bass invaders visualization
function BassInvaders() {
    //name of visualization
    this.name = 'Bass Invaders';

    //public object
    this.spaceShip = {
        x: width/2,
        y: height - 60,
        xDir: 0
    }

    //set direction of moving spaceship
    this.direction = function(dir) {
        this.spaceShip.xDir = dir;
    }

    //private variables
    var invaders = [];
    var lasers = [];
    var score = 0;

    this.whileHidden = function() {
        //reset spaceship coordinates
        this.spaceShip = {
            x: width/2,
            y: height - 60,
            xDir: 0
        }
        //clear lasers
        invaders = [];
        lasers = [];
    }

    //draw bass invaders visulaization
    this.draw = function() {
        push();
        fill(255);
        textAlign(CENTER);
        text("score: " + score, windowWidth/2, 20);
        textAlign(LEFT);
        text("'space': SHOOT\n'left arrow key': LEFT\n'right arrow key': RIGHT", 30, 50);

        //controls
        if(kb.presses('space')) {
            var laser = new Laser(this.spaceShip.x, this.spaceShip.y);
            lasers.push(laser);
        }
        if(kb.pressing('right')) {
            this.direction(1);
            this.spaceShip.x += this.spaceShip.xDir * 5;
        }
        if(kb.pressing('left')) {
            this.direction(-1);
            this.spaceShip.x += this.spaceShip.xDir * 5;
        } 
        if(this.spaceShip.x < 0 || this.spaceShip.x > width - 10) {
            this.spaceShip.x -= this.spaceShip.xDir * 5;
            this.direction(0);
        }

        //create lasers and make them disappear when colliding with invaders
        for(var i = 0; i < lasers.length; i++) {
            lasers[i].draw();
            lasers[i].move();
            for(var j = 0; j < invaders.length; j++) {
                if(!invaders[j].distroyed && lasers[i].hits(invaders[j])) {
                invaders[j].explode();
                lasers[i].evaporate();
                //increment score for each invader distroyed
                score += 1;
                }
            }
        }
        
        //create invaders at a constant rate in relation to framerate at random locations and speeds
        var xin = random(0, windowWidth);
        var lr = [random(-5, -1), random(1, 5)];
        var xds = random(lr);
        if(frameCount % 100 == 0) {
            bassInvader = new BInvader(xin, -30, xds);
            invaders.push(bassInvader);
        }
        else if(frameCount % 50 == 0) {
            waveInvader = new WInvader(xin, -30, xds);
            invaders.push(waveInvader);
        }
        
        //shift direction of invaders to opposite direction when window border is reached 
        for(var i = 0; i < invaders.length; i++) {
            invaders[i].draw();
            invaders[i].move();
            
            if(invaders[i].x > windowWidth || invaders[i].x < 0) {
                invaders[i].border = true;
            }
            
            if(invaders[i].border) {
                invaders[i].shift();
                invaders[i].border = false;
            }
        }
        
        //delete evaporated lasers and distroyed or off screen invaders
        for (var i = lasers.length - 1; i >= 0; i--) {
            if (lasers[i].toDelete || lasers[i].y < -30) {
                lasers.splice(i, 1);
            }
        }
        for (var i = invaders.length - 1; i >= 0; i--) {
            if (invaders[i].alpha < 0 || invaders[i].y > windowHeight + invaders[i].r) {
                invaders.splice(i, 1);
            }
        }
        pop();
    };
}

//constructor to create new invaders that react to bass
function BInvader(x, y, xds) {
    this.x = x;
    this.y = y;
    this.r = 1;
    this.alpha = 255;
    
    this.border = false;
    this.distroyed = false;

    this.xds = xds;
    this.yds = 1;

    this.explode = function() {
        this.distroyed = true;
        this.xds = 0;
        this.yds = 0;
    }

    //shift movement to opposite direction
    this.shift = function() {
        this.xds *= -1;
    }

    this.move = function() {
        this.x = this.x + this.xds;
        this.y = this.y + this.yds;
    }

    this.draw = function() {
        push();
        if(!this.distroyed) {
            //center point
            strokeWeight(4);
            stroke(0, 150, 255, 255);
            point(this.x, this.y);

            //calculate bass/treble/mids form the fft
            var spectrum = fourier.analyze();
            var bass = fourier.getEnergy('bass');    
            b = map(bass, 0, 255, 0.1, 0.9);
            
            var size = 60 * b;
            this.r = size;
            noStroke();
            fill(0, 150, 255, 255 * b);
            ellipse(this.x, this.y, size, size);
        }
        else {
            //shows added point and fades away
            fill(255, this.alpha);
            textSize(10);
            text("+1", this.x, this.y);
            this.alpha -= 2;
        }
        pop();
    }

}

//constructor to create new invaders that react to waves
function WInvader(x, y, xds) {
    // Set the center point of the circle
    this.x = x;
    this.y = y;
    // Set the radius of the circle
    this.r = 20;
    
    this.alpha = 255;
    
    this.border = false;
    this.distroyed = false;

    // Set the number of vertices to create the circle
    this.vnum = 128;

    // Calculate the angle between each vertex
    this.angl = (PI * 2) / this.vnum;
    
    this.xds = xds;
    this.yds = 1;

    this.explode = function() {
        this.distroyed = true;
        this.xds = 0;
        this.yds = 0;
    }

    //shift movement to opposite direction
    this.shift = function() {
        this.xds *= -1;
    }

    this.move = function() {
        this.x = this.x + this.xds;
        this.y = this.y + this.yds;
    }
    
    // Begin the shape
    this.draw = function() {
        push();
        if(!this.distroyed) {
		noFill();
		stroke(238, 75, 43);
		strokeWeight(2);
        beginShape();
        //calculate the waveform from the fft
        var wave = fourier.waveform();
        
        //iterate over the number of vertices and create a circle
        for (var i = 0; i < this.vnum; i++) {
            //create spike pattern by skipping over vertices
            if(i % 4 == 0) {
                var w = map(wave[i], -1, 1, 0.5, 1.5);
            }
            else {
                var w = 1;
            }
            //calculate the position of each vertex
            var x = this.x + (this.r * w) * cos(i * this.angl);
            var y = this.y + (this.r * w) * sin(i * this.angl);
            //ddd the vertex to the shape
            vertex(x, y);
        }
        endShape();
        }
        else {
            //shows added point and fades away
            fill(255, this.alpha);
            textSize(10);
            text("+1", this.x, this.y);
            this.alpha -= 2;
        }
        pop();
    }
    
}

//constructor to create new lasers
function Laser(x, y) {
  this.x = x;
  this.y = y;
  this.toDelete = false;

  //draw lasers
  this.draw = function() {
    push();
    noStroke();
    fill(170, 255, 0);
    rect(this.x, this.y, 2, 12);
    pop();
  }

  this.evaporate = function() {
    this.toDelete = true;
  }

  //detect collision with invaders
  this.hits = function(invader) {
    var d = dist(this.x, this.y, invader.x, invader.y);
    if (d < invader.r) {
      return true;
    } else {
      return false;
    }
  }

  this.move = function() {
    this.y = this.y - 5;
  }

}
