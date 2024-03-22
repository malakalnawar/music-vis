function DrumHero() {
    //name of visualization
    this.name = "Drum Hero";

    var now; //current time of song
    var peaks = []; //amplitude of peaks in current song

    //empty array to store each peak timing over a specific amplitude
    var peaksTime = [];
    //empty array to store all peak timing
    var allPeaksTime = [];

    var currentPeaksCount;
    var previousPeaksCount;

    var kicks;
    const kickTravelTime = 2.67; //pre-calculated time for kicks to travel across screen

    var score;

    //tiggers and their identifiers
    var redTrigger;
    var greenTrigger;
    var blueTrigger;
    var yellowTrigger;
    var trigger1;
    var trigger2;
    var trigger3;
    var trigger4;
    var yPosT; //Y-coordinates for triggers

    //lines
    var redLine;
    var greenLine;
    var blueLine;
    var yellowLine;

    this.setup = function() {
        //new group for kicks
        kicks = new Group(); //a group is an array of Sprites that share similar properties
        kicks.scale = 0.05;
        kicks.y = 0;
        kicks.collider = 'none';
        kicks.layer = 1;

        //setup main lines
        redLine = new Sprite(width/2 - 150, height/2, 'none'); //RED
        redLine.img = rlImg1;
        redLine.scale = 1.1;
        redLine.collider = 'none';
        redLine.layer = 0;

        greenLine = new Sprite(width/2 - 50, height/2, 'none'); //GREEN
        greenLine.img = glimg1;
        greenLine.scale = 1.1;
        greenLine.collider = 'none';
        greenLine.layer = 0;

        blueLine = new Sprite(width/2 + 50, height/2, 'none'); //BLUE
        blueLine.img = blImg1;
        blueLine.scale = 1.1;
        blueLine.collider = 'none';
        blueLine.layer = 0;

        yellowLine = new Sprite(width/2 + 150, height/2, 'none'); //YELLOW
        yellowLine.img = ylImg1;
        yellowLine.scale = 1.1;
        yellowLine.collider = 'none';
        yellowLine.layer = 0;

        //Y-coordinates for tiggers;
        yPosT = height - 150;

        //setup triggers
        redTrigger = new Sprite(width/2 - 150, yPosT, 'none'); //RED
        redTrigger.img = rtImg1;
        redTrigger.scale = 0.06;
        redTrigger.collider = 'none';
        redTrigger.layer = 2;

        greenTrigger = new Sprite(width/2 - 50, yPosT, 'none'); //GREEN
        greenTrigger.img = gtImg1;
        greenTrigger.scale = 0.06;
        greenTrigger.collider = 'none';
        greenTrigger.layer = 2;

        blueTrigger = new Sprite(width/2 + 50, yPosT, 'none'); //BLUE
        blueTrigger.img = btImg1;
        blueTrigger.scale = 0.06;
        blueTrigger.collider = 'none';
        blueTrigger.layer = 2;

        yellowTrigger = new Sprite(width/2 + 150, yPosT, 'none'); //YELLOW
        yellowTrigger.img = ytImg1;
        yellowTrigger.scale = 0.06;
        yellowTrigger.collider = 'none';
        yellowTrigger.layer = 2;

        //tigger identifiers
        trigger1 = false;
        trigger2 = false;
        trigger3 = false;
        trigger4 = false;

        //score to count kicks eaten by triggers
        score = 0;

        //setup song
        this.setupSong();
    }

    this.setupSong = function() {

        /*
        *the 'getPeaks()' function (provided by the p5.sound library) is the only function that can analyze peak data of a song before it plays
        *the 'setupSong()' function uses 'getPeaks()' to analyze peak amplitudes, map them to thier timing in the song, and capture peaks over a certain amplitude
        *this function along with the 'kickTravelTime' constant allow the kicks to be at the triggers when their peaks arrive
        *use ampMin to control the peak frequency. Range [-1, 1.1], '-1' being all peaks and '1.1' being no peaks.
        */

        var ampMin = 0.6;

        peaks = [];
        peaksTime = [];
        allPeaksTime = [];

        //duration of song
        var duration = nowPlaying.sound.duration();

        //get amplitude of peaks in song
        peaks = nowPlaying.sound.getPeaks();
        
        //map peaks with amplitude over ampMin to their relative time in the song
        for(i = 0; i < peaks.length; i++) {
            var time = map(i, 0, peaks.length, 0, duration);

            if(peaks[i] > ampMin) {
                peaksTime.push(time);
            }
        }

        //map all peaks to their relative time in the song
        for(i = 0; i < peaks.length; i++) {
            var time = map(i, 0, peaks.length, 0, duration);
            allPeaksTime.push(time);
        }

        //peak counters
        currentPeaksCount = 0;
        previousPeaksCount = 0;
    }

    this.whileHidden = function() {
        kicks.removeAll();
    }

    this.draw = function() {
        camera.on();
        //show lines
        redLine.draw();
        greenLine.draw();
        blueLine.draw();
        yellowLine.draw();
        //show kicks
        kicks.draw();
        //show triggers
        redTrigger.draw();
        greenTrigger.draw();
        blueTrigger.draw();
        yellowTrigger.draw();

        push();
        fill(255);
        noStroke();
        textSize(10);
        textAlign(CENTER);
        //display peak count
        if(score < 100) {
            text("Score: " + score, width/2, 50);
        }
        else {
            text("Drum Hero!\nScore: " + score, width/2, 50);
        }
		textAlign(LEFT);
		text("WAIT FOR KICKS!\n'arrow keys': trigger", 30, 50); //draw controls for user
        pop();

        //current time of song playing
        now = nowPlaying.sound.currentTime();

        //reset current peaks counter to get an updated total
        currentPeaksCount = 0;

        //count peaks
        for(i = 0; i < peaksTime.length; i++) {

            if (now > peaksTime[i] - kickTravelTime && nowPlaying.sound.isPlaying() && peaksTime[i] - kickTravelTime > 0) {
                currentPeaksCount += 1;
            }
        }

        if(currentPeaksCount > previousPeaksCount) {
            //generate new kick at random position
            var r = Math.floor(random(0, 4));
            if(r == 0) {
                var xpos = width/2 - 150;
                var type = rkImg; //RED
            }
            else if(r == 1) {
                var xpos = width/2 - 50;
                var type = gkImg; //GREEN
            }
            else if(r == 2) {
                var xpos = width/2 + 50;
                var type = bkImg; //BLUE
            }
            else if(r == 3) {
                var xpos = width/2 + 150;
                var type = ykImg; //YELLOW
            }
            else {
                console.log("control flow error!");
            }
            var kick = new kicks.Sprite(xpos, 0);
            kick.img = type;

            previousPeaksCount = currentPeaksCount; //set peaks count for next round
        }
        
        //controls for triggers
        if(kb.presses('left')) { //RED trigger
            redTrigger.img = rtImg2;
            redLine.img = rlImg2;
            trigger1 = true; //signal to eat kicks
        }
        else {
            redTrigger.img = rtImg1;
            redLine.img = rlImg1;
            trigger1 = false; //signal to not eat kicks
        }
        if(kb.presses('down')) { //GREEN trigger
            greenTrigger.img = gtImg2
            greenLine.img = glimg2;
            trigger2 = true;
        }
        else {
            greenTrigger.img = gtImg1;
            greenLine.img = glimg1;
            trigger2 = false;
        }
        if(kb.presses('up')) { //BLUE trigger
            blueTrigger.img = btImg2;
            blueLine.img = blImg2;
            trigger3 = true;
        }
        else {
            blueTrigger.img = btImg1;
            blueLine.img = blImg1;
            trigger3 = false;
        }
        if(kb.presses('right')) { //YELLOW trigger
            yellowTrigger.img = ytImg2;
            yellowLine.img = ylImg2;
            trigger4 = true;
        }
        else {
            yellowTrigger.img = ytImg1;
            yellowLine.img = ylImg1;
            trigger4 = false;
        }

        for(var kick of kicks) {
            kick.y += 3; //move kicks across the screen

            // delete kick if trigger is pressed on time
            //RED trigger
            if(trigger1 && kick.y > (yPosT - 30) && kick.y < (yPosT + 30) && kick.x > (width/2 - 150 - 30) && kick.x < (width/2 - 150 + 30)) {
                kick.remove();
                score +=1;
            }
            //GREEN trigger
            else if(trigger2 && kick.y > (yPosT - 30) && kick.y < (yPosT + 30) && kick.x > (width/2 - 50 - 30) && kick.x < (width/2 - 50 + 30)) {
                kick.remove();
                score +=1;
            }
            //BLUE trigger
            else if(trigger3 && kick.y > (yPosT - 30) && kick.y < (yPosT + 30) && kick.x > (width/2 + 50 - 30) && kick.x < (width/2 + 50 + 30)) {
                kick.remove();
                score += 1;
            }
            //YELLOW trigger
            else if(trigger4 && kick.y > (yPosT - 30) && kick.y < (yPosT + 30) && kick.x > (width/2 + 150 - 30) && kick.x < (width/2 + 150 + 30)) {
                kick.remove();
                score += 1;
            }
            else if(kick.y > (height + 200)) {
                kick.remove();
            }
        }
    }
}





    


