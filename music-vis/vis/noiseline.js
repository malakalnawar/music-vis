//constructor function to draw a
function NoiseLine() {
    //name of visulisation
    this.name = "Noiseline"

    var rot = 0;
    var prog = 0;
    
    //draw blocks and line
    this.draw = function() {
        fourier.analyze();

        var b = fourier.getEnergy("bass");
        var t = fourier.getEnergy("treble");

        gui.show();
        rotatingBlocks(t);
        noiseLine(b,t);
    };

    this.whileHidden = function() {
        gui.hide();
    }

    //create rotating blocks
    function rotatingBlocks(energy) {
        //control rotation speed
        rot += 0.01 + rotationSpeed;

        var r = map(energy, 0, 255, 20, 100);

        push();
        rectMode(CENTER);
        translate(width/2, height/2);
        rotate(rot);
        noStroke();
        fill(colorPicker);

        var incr = width/(10 - 1);

        for(var i = 0; i < 10; i++)
        {
            rect(i * incr - width/2,0,r,r);
        }
        pop();
    };

    //create moving line
    function noiseLine(energy, energy2) {
        push();
        translate(width/2, height/2);
        beginShape();
        noFill();
        stroke(0,255,0);
        strokeWeight(3);

        for(var i = 0; i < 100; i++)
        {
            var x = map(noise(i* noiseLevel + prog),0,1,-250,250);
            var y = map(noise(i* noiseLevel + prog + 1000),0,1,-250,250);

            vertex(x,y);
        }

        if(energy > 100)
        {
            prog += 0.05;
        }

        if(energy2 > 100)
        {
            noiseSeed();
        }

        endShape();
        pop();
    };
}