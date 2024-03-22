function ZappyBird() {
	//name of visualization
    this.name = 'Zappy Bird';

    //private variables
	var gameOver = false;
	var zappy = new Sprite(birdImg1, 0, 300, 24);
	var desertSand = new Group();
	var acreWidth = undefined;
	var powerBeacons = new Group();
	var energyCircles = [];
	var electroWaves = [];
	var nightSky = new Stars();

	this.setup = function() {
		world.autoStep = false; //disable automatic stepping
		//setup ground
		desertSand.image = groundImg;
        desertSand.layer = 0;
		desertSand.y = 650;
		desertSand.collider = 'static';
		
		//intialize first acre of desert sand
		var firstAcre = new desertSand.Sprite();
		firstAcre.x = 0;
		acreWidth = firstAcre.width; //first acre width becomes every acre's width
		//setup power beacons
		powerBeacons.image = beaconImg;
		powerBeacons.scale = 0.75;
		powerBeacons.collider = 'static';
		powerBeacons.layer = 1;
		
		//setup zappy bird
		zappy.scale = 0.2;
		zappy.layer = 2;
		
		//setup night sky
		nightSky.setup();
		//identifiers for game over and new game
		gameOver = true; 
		newGame = true;
	}

    this.whileHidden = function() {
		this.newGame();
		die();
    }

	this.draw = function() {
		camera.off();
		nightSky.draw(); //draw night sky
		push();
		fill(255);
		textAlign(LEFT);
		textSize(12);
		stroke(0);
		text("'space': JUMP", 30, 50); //draw controls for user
		pop();
		camera.on();
		//draw energy circles
		for (var i = 0; i < energyCircles.length; i++) { //draw energy circles
			//draw
			energyCircles[i].draw();
			//remove when touched
			if (energyCircles[i].x <= zappy.x) {
				energyCircles.splice(0, 1);
			}
		};	
		//draw electro waves		
		for (var i = 0; i < electroWaves.length; i++) { //draw electro waves
			//draw
			electroWaves[i].draw();
			//remove when touched
			if (electroWaves[i].x <= zappy.x) {
				electroWaves.splice(0, 1);
			}
		};
		powerBeacons.draw(); //draw power beacons
        desertSand.draw(); //draw ground
		zappy.draw(); //draw zappy bird
        

		//acre regeneration
		if(zappy.x % acreWidth == 0) {
			newAcre = new desertSand.Sprite();
			newAcre.x = zappy.x + acreWidth;
		}
		
		//controls
		if(kb.presses('space')) {
			if (newGame) this.newGame();
			zappy.vel.y = -8; //flap
		}

		//change zappy birds image when flapping
		if(zappy.vel.y < 0) {
			zappy.img = birdImg2;
		}
		else {
			zappy.img = birdImg1;
		}

		if(!gameOver) {
			//flapping movement
			zappy.rotation = zappy.direction * 0.6;

			// prevent bird from going above the top of the screen (cheating!)
			if (zappy.y < 0) {
				zappy.y = 0;
			}

			//kill bird if it touches floor or power beacons
			if (zappy.y > 500 || zappy.overlaps(powerBeacons)) {
				die();
			}

			//create power beacons, energy circle and electro waves every 60 frames
			if (frameCount % 60 == 0) {

				var yVariantion = random(0, 200); //random variation of beacons' y positions

				//new bottom power beacon
				var bottomBeacon = new powerBeacons.Sprite();
				bottomBeacon.x = width + zappy.x;
				bottomBeacon.y = 640 - yVariantion;

				//create new energy circle object for bottom beacon and push into array
				var bottomEnergyCircle = new EnergyCircle(bottomBeacon, yVariantion, false);
				energyCircles.push(bottomEnergyCircle); //push
			
				//new top power beacon
				var topBeacon = new powerBeacons.Sprite();
				topBeacon.x = bottomBeacon.x;
				topBeacon.y = 600 - yVariantion - 500;
				topBeacon.mirror.y = -1;

				//create new energy circle object for top beacon and push into array
				var topEnergyCircle = new EnergyCircle(topBeacon, yVariantion, true);
				energyCircles.push(topEnergyCircle); //push

				//create new electro wave object between bottom and top beacon and push into array
				var electroWave = new ElectroWave(bottomEnergyCircle, topEnergyCircle);
				electroWaves.push(electroWave); //push
			}

			//get rid of passed beacons, energy circles and electro waves
			for (var beacon of powerBeacons) {
				if (beacon.x < zappy.x - width/2) {
					beacon.remove();
				}
			}
		}

		//move zappy bird and world
		if (!gameOver) {
			camera.x = zappy.x + 200;
			world.step(); //manual stepping
		}

		//game over message
		if(gameOver) {
			camera.off();
			push();
			fill(255);
			textAlign(CENTER);
			textSize(12);
			stroke(0);
			text("PRESS 'space'", windowWidth/2, windowHeight/2);
			pop();
			camera.on();
		}
	}

	async function die() {
		gameOver = true;
		//500 millisecond delay 
		await delay(500);
		newGame = true;
	}

	this.newGame = function() {
		powerBeacons.removeAll();
		desertSand.removeAll();
		energyCircles = [];
		electroWaves = [];
		gameOver = false;
		newGame = false;
		zappy.x = 0;
		zappy.y = height / 2;
		zappy.vel.x = 5;
		zappy.vel.y = 0;
		world.gravity.y = 24;
		//intialize first two acres
		var firstAcre = new desertSand.Sprite();
		firstAcre.x = 0;
		var secondAcre = new desertSand.Sprite();
		secondAcre.x = firstAcre.x + firstAcre.width;
	}
}

function Stars() {

	//array to store star objects
	var stars = [];

	//fill stars array with 500 stars objects with random x, y positions
	this.setup = function () {
		for (var i = 0; i < 500; i++) {
			var star = {
				x: random(0, width),
				y: random(0, height),
				pulse: 255,
				draw: function() {
					stroke(255, 255, 255, this.pulse);
					strokeWeight(1.5);
					point(this.x, this.y);
				}
			}
			stars.push(star);
		}
	}

	//generate random alpha variable for flickering and draw stars to screen
	this.draw = function () {
		push();
		for (var i = 0; i < stars.length; i++) {
			var pulse = random(100, 255);
			stars[i].pulse = pulse;
			stars[i].draw();
		};
		pop();
	}
}

function EnergyCircle(beacon, yVariantion, mirror) {

	var yVariation = yVariantion;

	var mirror = mirror;

	this.x = beacon.x;
	
	this.y = function() {
			if(!mirror) {
				var y = 650 - yVariation - (beacon.height/2);
				return y;
			}
			else {
				var y = 90 - yVariation + (beacon.height/2);
				return y;
			}
	};

	this.draw = function () {
		//calculate bass form the fft
		var spectrum = fourier.analyze();
		var bass = fourier.getEnergy('bass');    
		b = map(bass, 0, 255, 0.1, 0.9);
		var size = 30 + (30 * b);
		noStroke();
		fill(0, 150, 255, 255 * b);
		ellipse(this.x, this.y(), size, size);
	};
}

function ElectroWave(bottomBeacon, topBeacon) {

	var yBottom = bottomBeacon.y();

	var yTop = topBeacon.y();

	this.x = bottomBeacon.x;

	this.draw = function() {
		push(); 
		noFill();
		stroke(0, 150, 255, 200);
		strokeWeight(1.5);
		beginShape();
		//calculate the waveform from the fft.
		var wave = fourier.waveform();
		for (var i = 0; i < wave.length; i++) {
			//for each element of the waveform map it to screen
			//coordinates and make a new vertex at the point.
			var y = map(i, 0, wave.length, yTop, yBottom);

			var c = map(i, 0, wave.length, 0, Math.PI);
			var range = Math.sin(c);
			
			var x = map(wave[i], -1, 1, this.x - (150 * range), this.x + (150 * range));

			vertex(x, y); 
		}
		endShape();
		pop();
	};
}