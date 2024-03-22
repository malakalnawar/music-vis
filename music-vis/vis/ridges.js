//constructor function to draw
function Ridges(){
    //name of visualisation
    this.name = "Ridges";

    //array to strore waves
    var output = [];
    
    //properties
    var startX = width/5;
    var endY = height/5;
    var startY = height - endY;
    var spectrumWidth = (width/5) * 3;
    
    //speed of line movement
    var speed = 0.7;

    //draw the lines to the screen
    this.draw = function () {
        push();
        strokeWeight(2);
        noFill();
        if (frameCount % 10 == 0) {
            addWave();
        }

        for (var i = 0; i < output.length; i++) {
            var o = output[i];
            beginShape()
            for (var j = 0; j < o.length; j++) {
                var opac = random(150, 255); //neon effect
                o[j].y -= speed;
                stroke(o[j].r, o[j].g, o[j].b, opac);
                vertex(o[j].x, o[j].y);
            }
            endShape()
            if (o[0].y < endY) {
                output.splice(i, 1);
            }
        }
        pop(); 
    }

    //fill 'output' array with wave data
    function addWave() {
        var w = fourier.waveform();
        var outputWave = [];
        var smallScale = 6;
        var bigScale = 40;

        for (var i = 0; i < w.length; i++) {
            if (i % 20 == 0) {
                //rainbow color
                var r = random(255);
                var g = random(255);
                var b = random(255);
                //create waves
                var x = map(i, 0, 1024, startX, startX + spectrumWidth);
                if (i < 1024 * 0.25 || i > 1024 * 0.75) {
                    var y = map(w[i], -1, 1, -smallScale, smallScale);
                    outputWave.push({
                        x: x,
                        y: startY + y,
                        r: r,
                        g: g,
                        b: b
                    });
                }
                else {
                    var y = map(w[i], -1, 1, -bigScale, bigScale);
                    outputWave.push({
                        x: x,
                        y: startY + y,
                        r: r,
                        g: g,
                        b: b
                    });
                }
            }
        }
        output.push(outputWave);
    }
}