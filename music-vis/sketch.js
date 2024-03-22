/*
this code uses the p5.play library and utilizes sprite constructors.
- if you are unfamiliar with sprites, see "https://p5play.org/learn/sprite.html"
- if you are unfamiliar with p5.play, see "https://p5play.org/index.html"
*/

//global for the controls and input 
var controls = null;
//store homepage in a container
var homepage = null;
//store visualisations in a container
var vis = null;
//variable for the p5 sound object
var sound = null;
//variable for p5 fast fourier transform
var fourier;

//variables for background
var colors = [];
var currentColorIndex = 0;
var nextColorIndex = 1;
var lerpAmount = 0;

//variables for homepage
var home;
//thumbnails
var logoImg, specImg1, waveImg1, ndlsImg1, nslnImg1, rdgsImg1, atomImg1, pyroImg1, binvImg1, zbrdImg1, drumImg1; 
var specImg2, waveImg2, ndlsImg2, nslnImg2, rdgsImg2, atomImg2, pyroImg2, binvImg2, zbrdImg2, drumImg2;

//variables for music library
var songs = [];
var songData = [
    { name: 'Dance of the Gypsies by Hanu Dixit', file: 'assets/songs/dance_of_the_gypsies_by_hanu_dixit.mp3'},
    { name: 'Island Dream by Chris Haugen', file: 'assets/songs/island_dream_by_chris_haugen.mp3'},
    { name: 'Press Fuse by French Fuse', file: 'assets/songs/press_fuse_by_french_fuse.mp3'},
    { name: 'Rich in the 80\'s by DivKid', file: 'assets/songs/rich_in_the_80s_by_divkid.mp3'},
    { name: 'Target Fuse by French Fuse', file: 'assets/songs/target_fuse_by_french_fuse.mp3'},
    { name: 'URL Melt by Unicorn Heads', file: 'assets/songs/url_melt_by_unicorn_heads.mp3'}
  ]; //playlist data
var nowPlaying; //current song data

//variables for gui
var gui;
var noiseLevel = 0.01;
var rotationSpeed = 0.01;
var colorPicker = [191, 64, 191];

//variables for interactive visualization
//zappy bird
var birdImg1, birdImg2, beaconImg, groundImg; 
//drum hero
var rlImg1, glimg1, blImg1, ylImg1, rkImg, gkImg, bkImg, ykImg, rtImg1, gtImg1, btImg1, ytImg1;
var rlImg2, glimg2, blImg2, ylImg2, rtImg2, gtImg2, btImg2, ytImg2;

function preload(){
	soundFormats('mp3', 'wav', 'm4a');
    //preload all songs and store them in the songs array
    for (let i = 0; i < songData.length; i++) {
        var song = loadSound(songData[i].file);
        songs.push({ 
            name: songData[i].name, 
            sound: song
         });
      };
    
    //preload all images for homepage
    logoImg = loadImage('assets/thumbnails/logo.png'); //Music Vision Pro logo
    //thumbnails (state 1)
    specImg1 = loadImage('assets/thumbnails/spectrum.png');
    waveImg1 = loadImage('assets/thumbnails/waves.png');
    ndlsImg1 = loadImage('assets/thumbnails/needles.png');
    nslnImg1 = loadImage('assets/thumbnails/noiseline.png');
    rdgsImg1 = loadImage('assets/thumbnails/ridges.png');
    atomImg1 = loadImage('assets/thumbnails/atom.png');
    pyroImg1 = loadImage('assets/thumbnails/pyrotechnics.png');
    binvImg1 = loadImage('assets/thumbnails/bass_invaders.png');
    zbrdImg1 = loadImage('assets/thumbnails/zappy_hover.png');
    drumImg1 = loadImage('assets/thumbnails/drum_hero.png');
    //thumbnails (state 2)
    specImg2 = loadImage('assets/thumbnails/spectrum_hover.png');
    waveImg2 = loadImage('assets/thumbnails/waves_hover.png');
    ndlsImg2 = loadImage('assets/thumbnails/needles_hover.png');
    nslnImg2 = loadImage('assets/thumbnails/noiseline_hover.png');
    rdgsImg2 = loadImage('assets/thumbnails/ridges_hover.png');
    atomImg2 = loadImage('assets/thumbnails/atom_hover.png');
    pyroImg2 = loadImage('assets/thumbnails/pyrotechnics_hover.png');
    binvImg2 = loadImage('assets/thumbnails/bass_invaders_hover.png');
    zbrdImg2 = loadImage('assets/thumbnails/zappy_bird_hover.png');
    drumImg2 = loadImage('assets/thumbnails/drum_hero_hover.png');

    //preload all images for zappy bird visualization
    birdImg1 = loadImage('assets/zappy_bird/zappy1.png'); //bird (state 1)
    birdImg2 = loadImage('assets/zappy_bird/zappy2.png'); //bird (state 2)
    beaconImg = loadImage('assets/zappy_bird/beacon.png');
    groundImg = loadImage('assets/zappy_bird/sand.png');

    //preload all images for drum hero visualization
    //lines (state 1)
    rlImg1 = loadImage('assets/drum_hero/laser_rd.png');
    glimg1 = loadImage('assets/drum_hero/laser_gd.png');
    blImg1 = loadImage('assets/drum_hero/laser_bd.png');
    ylImg1 = loadImage('assets/drum_hero/laser_yd.png');
    //lines (state 2)
    rlImg2 = loadImage('assets/drum_hero/laser_r.png');
    glimg2 = loadImage('assets/drum_hero/laser_g.png');
    blImg2 = loadImage('assets/drum_hero/laser_b.png');
    ylImg2 = loadImage('assets/drum_hero/laser_y.png');
    //kicks
    rkImg = loadImage('assets/drum_hero/kick_r.png');
    gkImg = loadImage('assets/drum_hero/kick_g.png');
    bkImg = loadImage('assets/drum_hero/kick_b.png');
    ykImg = loadImage('assets/drum_hero/kick_y.png');
    //triggers (state 1)
    rtImg1 = loadImage('assets/drum_hero/r_off.png');
    gtImg1 = loadImage('assets/drum_hero/g_off.png');
    btImg1 = loadImage('assets/drum_hero/b_off.png');
    ytImg1 = loadImage('assets/drum_hero/y_off.png');
    //triggers (state 2)
    rtImg2 = loadImage('assets/drum_hero/r.png');
    gtImg2 = loadImage('assets/drum_hero/g.png');
    btImg2 = loadImage('assets/drum_hero/b.png');
    ytImg2 = loadImage('assets/drum_hero/y.png');
}

function setup(){
    createCanvas(windowWidth, windowHeight);

    allSprites.autoDraw = false; //if set to true, all sprite elements will be drawn automaticaly

    //instantiate the fft object
    fourier = new p5.FFT();
    //intitialize now playing
    nowPlaying = songs[0];

    //create a new visualisation container and add visualisations
    vis = new Visualisations();
    vis.add(new Spectrum());
    vis.add(new WavePattern());
    vis.add(new Needles());
    vis.add(new Ridges());
    vis.add(new NoiseLine());
    vis.add(new Atom());
    vis.add(new BassInvaders());
    vis.add(new Pyrotechnics());
    vis.add(new ZappyBird());
    vis.add(new DrumHero());
    //setup for visualizations
    for(i = 0; i < vis.visuals.length; i++) {
        if(vis.visuals[i].hasOwnProperty('setup')){
            vis.visuals[i].setup();
        }
    }

    //initialize controls
    controls = new ControlsAndInput();
    //setup controls
    controls.setup();
    
    //create new homepage
    homepage = new Homepage();
    //setup homepage
    homepage.setup();
    home = true; //identifier

    //setup colors for background
    setupColors(30);
}

function draw(){
    angleMode(RADIANS);
    frameRate(60);

    background(lerpedColor()); //gradient changing background

    camera.on(); //camera must be set to on when allSprites.autuDraw is set to false

    if(home) {
        //RESET
        controls.reset(); //reset controls

        //HIDE//
        hideUnusedElements(); //hide elements not being used by user

        //DRAW
        homepage.draw(); //draw homepage
	    controls.draw(); //draw controls
    }
    else {
        //HIDE
        hideUnusedElements(); //hide elements not being used by user

        //DRAW
        if(vis.selectedVisual.name == 'Bass Invaders') {
            vis.selectedVisual.draw(); //draw
            //configure controls
            controls.map(vis.selectedVisual.spaceShip.x);
        }
        else if(vis.selectedVisual.name == 'Zappy Bird') {
            vis.selectedVisual.draw(); //draw
            //configure controls
            controls.follow();
        }
        else {
            vis.selectedVisual.draw(); //draw
            //controls are reset by returning to the homepage
        };
	    controls.draw(); //draw controls
    }

    //setup song data before next song loop
    var now = Math.ceil(nowPlaying.sound.currentTime());
    var duration = Math.floor(nowPlaying.sound.duration()) - 0.01;
    if(now > duration) {
        setupSong();
    }
}

function hideUnusedElements() {
    //hide elements from each visulaization not in use
    for(i = 0; i < vis.visuals.length; i++) {
        if(home) {
            if(vis.visuals[i].hasOwnProperty('whileHidden')) {
                vis.visuals[i].whileHidden();
            }
        }
        else {
            homepage.whileHidden(); //hide homepage
            if(vis.visuals[i].name !== vis.selectedVisual.name && vis.visuals[i].hasOwnProperty('whileHidden')) {
                vis.visuals[i].whileHidden();
            }
        }
    };
}

function setupSong() {
    //stop song
    for (let i = 0; i < songs.length; i++) {
        if(songs[i].sound.isPlaying()){
            songs[i].sound.stop();
        }
    }
    //setup song data for visualizations
    for(i = 0; i < vis.visuals.length; i++) {
        if(vis.visuals[i].name == 'Drum Hero') {
            vis.visuals[i].setupSong();
        }
    }
    //play song
    nowPlaying.sound.loop();
}

function lerpedColor() {
    //lerped color for background
    var lerpedColor = lerpColor(colors[currentColorIndex], colors[nextColorIndex], lerpAmount);
    //increment lerpAmount based on frame rate
    lerpAmount += 1 / (frameRate() * 4);
    //switch to the next pair of colors
    if (lerpAmount >= 1) {
        lerpAmount = 0;
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        nextColorIndex = (nextColorIndex + 1) % colors.length;
    }
    return lerpedColor;
}

function setupColors(brightness) {
    //array of colors for gradient
    var alpha = brightness; //brightness
    colors.push(color(alpha, 0, 0)); //red
    colors.push(color(0, alpha, 0)); //green
    colors.push(color(0, 0, alpha)); //blue
    colors.push(color(alpha, alpha, 0)); //yellow
    colors.push(color(0, alpha, alpha)); //cyan
    colors.push(color(alpha, 0, alpha)); //magenta
}
