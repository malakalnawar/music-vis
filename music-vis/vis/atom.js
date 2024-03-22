/*
NOTE: this function calls from the p5.polar.js library
*/
function Atom() {
    //name of the visualisation
    this.name = "Atom";

    //draw the plots to the screen
    this.draw = function() {
        //create an array amplitude values from the fft
        var spectrum = fourier.analyze();

        var bass = fourier.getEnergy('bass');
        var low = fourier.getEnergy('lowMid');
        var mid = fourier.getEnergy('mid')
        var high = fourier.getEnergy('highMid');
        var treble = fourier.getEnergy('treble');

        var b = map(bass, 0, 255, 0.1, 0.4);
        var t = map(treble, 0, 255, 0, 0.8);

        push();
        // background(low, mid, high, 100);
        translate(windowWidth/2, windowHeight/2);

        //draw treble lines
        stroke(125);
        push();
        noFill();
        rotate(radians(frameCount * 0.05));
        polarEllipses(10, 40 + sin(t) * 20, 200, 80);
        pop();

        //draw bass circles
        noStroke();
        push();
        rotate(radians(frameCount * -0.5));
        fill(high, mid, low, 200);
        polarEllipses(8, 25 * b, 25 * b, 55 * b/0.25);
        fill(high, mid, low, 50);
        polarEllipses(8, 75 * b, 75 * b, 175 * b/0.25);
        pop();
        //draw opposite rotating bass circles
        push();
        rotate(radians(frameCount * 0.5));
        fill(high, mid, low, 100);
        polarEllipses(8, 50 * b, 50 * b, 105 * b/0.25);
        pop();

        pop();
    };
    
}
