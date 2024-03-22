function Pyrotechnics() {
    //name of visualization
    this.name = 'Pyrotechnics';

    //setup variables
    var beatDetect = new BeatDetect();
    var fireworks = new Fireworks();

    //draw pyrotechnics visulaization
    this.draw = function() {
            push();
            angleMode(DEGREES);
            //get array of amplitudes then detect beat
            var spectrum = fourier.analyze();
            //if beat is detected, add a firework to array
            if(beatDetect.detectBeat(spectrum)) {
                fireworks.addFirework();
            };
            //draw fireworks
            fireworks.draw(); 
            pop();
        }
    }

function Fireworks() {

    //array to store fireworks
    var fireworks = [];

    //add random firework to fireworks array
    this.addFirework = function() {
        var f_color = color(
            random(0, 255),
            random(0, 255),
            random(0, 255)
        );
        var f_x = random(width * 0.2, width * 0.8);
        var f_y = random(height * 0.2, height * 0.8);

        fireworks.push(new Firework(f_color, f_x, f_y));
    }

    //draw all fireworks
    this.draw = function() {
        for(var i = 0; i < fireworks.length; i++) {
            fireworks[i].draw();
            //delete fireworks that are depleted
            if(fireworks[i].depleted) {
                fireworks.splice(i, 1);
            }
        }
        
    }

}

function Firework(color, x, y) {
    var color = color;
    var x = x;
    var y = y;

    //array to store particles
    var particles = [];

    //fill particles array with 360/18 particles that form a circle
    for(var i = 0; i < 360; i+=18) {
        particles.push(new Particle(x, y, color, i, 10));
    }

    //lifespan identifier
    this.depleted = false;

    //draw the firework
    this.draw = function() {

        //draw each particles
        for(var i = 0; i < particles.length; i++) {
            particles[i].draw();
        }

        //signal the end of lifespan
        if(particles[0].speed < 0) {
            this.depleted = true;
        }
    }
}

function Particle(x, y, color, angle, speed) {
    var x = x;
    var y = y;
    var color = color;
    var angle = angle;

    this.speed = speed;

    //draw particles
    this.draw = function() {
        this.speed -= 0.75
        //update x and y
        x += cos(angle) * speed;
        y += sin(angle) * speed;
        fill(color);
        ellipse(x, y, 10, 10);
    }
}

function BeatDetect() {

    var sampleBuffer = [];

    this.detectBeat = function(spectrum) {
        var sum = 0;
        var isBeat = false;

        for(var i = 0; i < spectrum.length; i++) {
            sum += spectrum [i] * spectrum[i];
        }

        if(sampleBuffer.length == 60) {
            //detect a beat
            var sampleSum = 0;
            for(var i = 0; i < sampleBuffer.length; i++) {
                sampleSum += sampleBuffer[i];
            }

            var sampleAverage = sampleSum / sampleBuffer.length;

            var c = calculateConstant(sampleAverage);
            if(sum > sampleAverage * c) {
                //beat
                isBeat = true;
            }
            sampleBuffer.splice(0, 1);
            sampleBuffer.push(sum);
        }
        else {
            sampleBuffer.push(sum);
        }
        return isBeat;
    }

    function calculateConstant(sampleAverage) {
        //calculate variance
        var varianceSum = 0;
        for(var i = 0; i < sampleBuffer.length; i++) {
            varianceSum += sampleBuffer[i] - sampleAverage;
        }

        var variance = varianceSum / sampleBuffer.length;

        var m = -0.15 / (25 - 200);
        var b = 1 + (m * 200);

        return (m * variance) + b;
    }
}