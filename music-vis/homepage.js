function Homepage() {

    var btnXVar = width/6;

    var btnScaleVar = 0.2;

    var btn0 = new Sprite(width/2, 100);

    var btn1 = new Sprite(btnXVar * 1, 275);

    var btn2 = new Sprite(btnXVar * 2, 275);

    var btn3 = new Sprite(btnXVar * 3, 275);

    var btn4 = new Sprite(btnXVar * 4, 275);

    var btn5 = new Sprite(btnXVar * 5, 275);

    var btn6 = new Sprite(btnXVar * 1, 425);

    var btn7 = new Sprite(btnXVar * 2, 425);

    var btn8 = new Sprite(btnXVar * 3, 425);

    var btn9 = new Sprite(btnXVar * 4, 425);

    var btn10 = new Sprite(btnXVar * 5, 425);

    this.setup = function() {
        //attach thumbnail to each sprite and scale it
        btn0.img = logoImg;
        btn0.scale = 0.4;
        btn0.layer = 5;
        
        btn1.img = specImg1;
        btn1.scale = btnScaleVar;
        btn1.layer = 5;

        btn2.img = waveImg1;
        btn2.scale = btnScaleVar;
        btn2.layer = 5;

        btn3.img = ndlsImg1;
        btn3.scale = btnScaleVar;
        btn3.layer = 5;

        btn4.img = rdgsImg1;
        btn4.scale = btnScaleVar;
        btn4.layer = 5;

        btn5.img = nslnImg1;
        btn5.scale = btnScaleVar;
        btn5.layer = 5;

        btn6.img = atomImg1;
        btn6.scale = btnScaleVar;
        btn6.layer = 5;

        btn7.img = pyroImg1;
        btn7.scale = btnScaleVar;
        btn7.layer = 5;

        btn8.img = binvImg1;
        btn8.scale = btnScaleVar;
        btn8.layer = 5;

        btn9.img = zbrdImg1;
        btn9.scale = btnScaleVar;
        btn9.layer = 5;

        btn10.img = drumImg1;
        btn10.scale = btnScaleVar;
        btn10.layer = 5;
    }

    this.draw = function() {
        camera.on();
        //show all thumbnails
        btn0.draw();
        btn1.draw();
        btn2.draw();
        btn3.draw();
        btn4.draw();
        btn5.draw();
        btn6.draw();
        btn7.draw();
        btn8.draw();
        btn9.draw();
        btn10.draw();

        //intialize thumbnail physics (ability to interact)
        btn0.collider = 'none';
        btn1.collider = 'static';
        btn2.collider = 'static';
        btn3.collider = 'static';
        btn4.collider = 'static';
        btn5.collider = 'static';
        btn6.collider = 'static';
        btn7.collider = 'static';
        btn8.collider = 'static';
        btn9.collider = 'static';
        btn10.collider = 'static';

        //mouse hover and press actions for each visualization thumbnail
        if(btn1.mouse.presses()) {
            home = false;
            vis.selectVisual("Spectrum");
        }
        if(btn1.mouse.hovering()) {
            btn1.img = specImg2;
        }
        else {
            btn1.img = specImg1;
        }

        if(btn2.mouse.presses()) {
            home = false;
            vis.selectVisual("Wave");
        }
        if(btn2.mouse.hovering()) {
            btn2.img = waveImg2;
        }
        else {
            btn2.img = waveImg1;
        }

        if(btn3.mouse.presses()) {
            home = false;
            vis.selectVisual("Needles");
        }
        if(btn3.mouse.hovering()) {
            btn3.img = ndlsImg2;
        }
        else {
            btn3.img = ndlsImg1;
        }

        if(btn4.mouse.presses()) {
            home = false;
            vis.selectVisual("Ridges");
        }
        if(btn4.mouse.hovering()) {
            btn4.img = rdgsImg2;
        }
        else {
            btn4.img = rdgsImg1;
        }

        if(btn5.mouse.presses()) {
            home = false;
            vis.selectVisual("Noiseline");
        }
        if(btn5.mouse.hovering()) {
            btn5.img = nslnImg2;
        }
        else {
            btn5.img = nslnImg1;
        }

        if(btn6.mouse.presses()) {
            home = false;
            vis.selectVisual("Atom");
        }
        if(btn6.mouse.hovering()) {
            btn6.img = atomImg2;
        }
        else {
            btn6.img = atomImg1;
        }

        if(btn7.mouse.presses()) {
            home = false;
            vis.selectVisual("Pyrotechnics");
        }
        if(btn7.mouse.hovering()) {
            btn7.img = pyroImg2;
        }
        else {
            btn7.img = pyroImg1;
        }

        if(btn8.mouse.presses()) {
            home = false;
            vis.selectVisual("Bass Invaders");
        }
        if(btn8.mouse.hovering()) {
            btn8.img = binvImg2;
        }
        else {
            btn8.img = binvImg1;
        }

        if(btn9.mouse.presses()) {
            home = false;
            vis.selectVisual("Zappy Bird");
        }
        if(btn9.mouse.hovering()) {
            btn9.img = zbrdImg2;
        }
        else {
            btn9.img = zbrdImg1;
        }

        if(btn10.mouse.presses()) {
            home = false;
            vis.selectVisual("Drum Hero");
        }
        if(btn10.mouse.hovering()) {
            btn10.img = drumImg2;
        }
        else {
            btn10.img = drumImg1;
        }
    }

    this.whileHidden = function() {
        //hide all buttons (sprites) and remove all physics associated with them
        btn0.collider = 'none';
        btn1.collider = 'none';
        btn2.collider = 'none';
        btn3.collider = 'none';
        btn4.collider = 'none';
        btn5.collider = 'none';
        btn6.collider = 'none';
        btn7.collider = 'none';
        btn8.collider = 'none';
        btn9.collider = 'none';
        btn10.collider = 'none';
    }
}