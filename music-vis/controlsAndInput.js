//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
function ControlsAndInput(){

    //private variables
    var menuY = 100;
    var menuX = 30;
	var menuDisplayed = false;
    //main menu button
    var mainMenuButton = new Sprite(menuX + 50, windowHeight - 50, 75, 35, 'static');
    //home button
    var homeButton = new Sprite(menuX + width - 100, windowHeight - 50, 75, 35, 'static');
    //playback controller
	var playbackController = new PlaybackController();
    //button containers
    var songButtons = []; //song buttons
    var ugButton; //user generated button
    var uploadButtons = []; //upload buttons

    //setup
    this.setup = function() {
        //setup main menu button
        mainMenuButton.text = 'Menu';
        mainMenuButton.color = 'white';
        mainMenuButton.layer = 5;
        //setup home button
        homeButton.text = 'Home';
        homeButton.color = 'white';
        homeButton.layer = 5;
        //setup playback button
        playbackController.setup(); 
        //setup music libray
        setupLibrary();
        //setup gui
        setupGUI();
    }

	//draws the playback button and the main menu
	this.draw = function(){
        //display now playing
        push();
        fill(255);
        stroke(0);
        strokeWeight(2);
        textSize(11);
        textAlign(RIGHT);
        text("now playing: " + nowPlaying.name, menuX + windowWidth - 50, 50);
        pop();

        //DRAW
        playbackController.draw(); //draw playback button 
        //draw home button
        if(!home) {
            showHomeButton(); //show home button
        }
        //draw main menu
        if(!menuDisplayed){
            mainMenu(); //hide main menu
        }
        else{
            closeMainMenu(); //show main menu
        }

        //controls
        if(kb.presses('m')) menuDisplayed = !menuDisplayed; //press 'm' key to display main menu
    };

    /*
    *map playback button to an input x position
    *@param xPos: central x coordinate of object to follow
    */
    this.map = function(xPos) {
        //map playback controller
        playbackController.xPos = xPos;	
    }

    //allow playback and menu to follow camera movement
    this.follow = function() {
        menuX = camera.x - windowWidth/2 + 30;
        //update playback cotroller according to window position
        playbackController.xPos = camera.x;
    }
    
    //reset camera
    this.reset = function() {
        menuX = 30;
        //recenter playback controller
        playbackController.xPos = width/2;
        //recenter camera
		camera.x = width/2;
    }

    //setup music library buttons and functionality
    function setupLibrary() {
        //create upload button
        var upload = createButton("Upload Song").position(30, menuY + 100).mousePressed(uploadSong);
        uploadButtons.push(upload);

        //create buttons for each song in library
        for(i = 0; i < songs.length; i++){
            //s = space between buttons and margin
            var s = 30;
            var col = color(50, 50, 50, 100);
            var btn = createButton(songs[i].name);
            btn.position(s + (((width - s - s * songs.length)/songs.length) + s) * i, menuY);
            btn.size((width - s - s * songs.length)/songs.length, 60);
            btn.style('background-color', col);
            btn.style('color', 'white');
            songButtons.push(btn);
        };
        //main functionality of pressed buttons
        function fn(index) {
            nowPlaying = songs[index];
            setupSong();
        };
        //empty array to store button functions
        var fns = [];
        // Create functions in the fns array
        for (var i = 0; i < songButtons.length; i++) {
            //IIFE to capture the current value of index
            (function(i) {
                fns.push(function() {
                fn(i);
                });
            })(i);
        };
        //assign event handlers to songButtons
        for (var i = 0; i < fns.length; i++) {
            //IIFE to capture the current value of i
            (function(i) {
                songButtons[i].mousePressed(function() {
                fns[i]();
                });
            })(i);
        };
    };

    //button to upload file
    function uploadSong() {
        var fileInput = createFileInput(handleFile).position(150, menuY + 100);
        uploadButtons.push(fileInput);

        //handling of file upload: add song to library and create new button for it
        function handleFile(file) {
            //if the file uploaded is an audio file
            if (file.type == 'audio') {
                //ask user to name the song
                var songName = prompt('Please enter the name of the song:');
                if (songName) {
                    //if user uploads another song, delete old song and button
                    if(songs.length == 7) {
                        songs.pop();
                        ugButton.remove();
                    };
                    var newSong = loadSound(file);
                    //add new song to songs array
                    songs.push({ name: songName, sound: newSong });
                    //test
                    console.log('Song uploaded:', songName);
                    //create button for new song
                    var col = color(50, 50, 50, 100);
                    ugButton = createButton(songName);
                    ugButton.position(width/2, menuY + 100);
                    ugButton.size(150, 60);
                    ugButton.style('background-color', col);
                    ugButton.style('color', 'white');
                    //main functionality of pressed button
                    function fn() {
                        for (let i = 0; i < songs.length; i++) {
                            if(songs[i].sound.isPlaying()){
                                songs[i].sound.stop();
                            }
                        }
                        songs[songs.length - 1].sound.loop();
                        nowPlaying = songs[songs.length - 1];
                    };
                    //assign event handler to new button
                    ugButton.mousePressed(fn);
                }
            } 
            else {
                //alert user if they upload wrong file
                alert('Please select an MP3 or WAV audio file format.');
            }
        };
    };

    //setup gui and add globals
    function setupGUI() {
        gui = createGui('Controls');
        sliderRange(0.001,0.1,0.001);
        gui.addGlobals('noiseLevel');
        sliderRange(-0.5,0.5,0.001);
        gui.addGlobals('rotationSpeed');
        sliderRange(0,255,1);
        gui.addGlobals('colorPicker');
    }

    function showHomeButton() {
        //home button controls
        if(homeButton.mouse.presses()) home = true;
        if(homeButton.mouse.hovering()) {
            homeButton.color = '#D3D3D3';
        }
        else {
            homeButton.color = 'white';
        };
        homeButton.x = menuX + width - 100;
        homeButton.text = 'Home';
        homeButton.draw();
    }

    function mainMenu() {
        //hide song and upload buttons
        for (i = 0; i < songButtons.length; i++) {
            songButtons[i].hide(); //music library buttons
        };
        for (i = 0; i < uploadButtons.length; i++) {
            uploadButtons[i].hide(); //upload buttons
            //hide user generated button if song is uploaded
            if(ugButton) ugButton.hide();
        };
        //main menu button controls
        if(mainMenuButton.mouse.presses()) menuDisplayed = true;
        if(mainMenuButton.mouse.hovering()) {
            mainMenuButton.color = '#D3D3D3';
        }
        else {
            mainMenuButton.color = 'white';
        };
        mainMenuButton.x = menuX + 40;
        mainMenuButton.text = 'Menu';
        mainMenuButton.draw(); //draw main menu button
    }

    function closeMainMenu() {
        //show song and upload buttons
        for (i = 0; i < songButtons.length; i++) {
            songButtons[i].show(); //music library buttons
        };
        for (i = 0; i < uploadButtons.length; i++) {
            uploadButtons[i].show(); //upload buttons
            //show user generated button if song is uploaded
            if(ugButton) ugButton.show();
        };
        //main menu button controls
        if(mainMenuButton.mouse.presses()) menuDisplayed = false;
        if(mainMenuButton.mouse.hovering()) {
            mainMenuButton.color = '#D3D3D3';
        }
        else {
            mainMenuButton.color = 'white';
        };
        mainMenuButton.x = menuX + 40;
        mainMenuButton.text = 'Close';
        mainMenuButton.draw(); //draw main menu button
    }
}




