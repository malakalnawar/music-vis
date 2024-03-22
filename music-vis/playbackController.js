//displays and handles clicks on the playback button.
function PlaybackController(){
	
	//public variables
	this.xPos = windowWidth/2;

	//private variables
	var yPos = windowHeight - 50;
	var controllerWidth = 20;
	var controllerHeight = 20;
	//play button
	var playButton = new Sprite(this.xPos, yPos, 25, 'triangle', 'static');
	//pause button
	var pauseBar1 = new Sprite(this.xPos, yPos, controllerWidth/2 - 2, controllerHeight, 'static');
	var pauseBar2 = new Sprite(this.xPos + (controllerWidth/2 + 2), yPos, controllerWidth/2 - 2, controllerHeight, 'static');

	this.setup = function() {
		//setup play button
		playButton.rotation = 90;
		playButton.color = 'white';
		playButton.layer = 5;
		//setup pause button
		pauseBar1.color = 'white';
		pauseBar1.layer = 5;
		pauseBar2.color = 'white';
		pauseBar2.layer = 5;
	}

	this.draw = function() {
		//keep x coordinates updated
		playButton.x = this.xPos;
		pauseBar1.x = this.xPos - 5;
		pauseBar2.x = this.xPos + (controllerWidth/2 + 2) - 5;

		if(nowPlaying.sound.isPlaying()){
			showPauseButton();
		}
		else{
			showPlayButton();
		}
	}

	function showPlayButton(){
		//show play button
		playButton.draw();

		//functionality of buttons
		if(playButton.mouse.presses() || pauseBar1.mouse.presses() || pauseBar2.mouse.presses()){
			for (let i = 0; i < songs.length; i++) {
				if(songs[i].sound.isPlaying()){
					songs[i].sound.pause();
				}
				else if(!songs[i].sound.isPlaying() && songs[i].name == nowPlaying.name) {
					songs[i].sound.loop();
				}
			};
		}
	}

	function showPauseButton() {
		//show pause button
		pauseBar1.draw();
		pauseBar2.draw();
		
		//functionality of buttons
		if(playButton.mouse.presses() || pauseBar1.mouse.presses() || pauseBar2.mouse.presses()){
			for (let i = 0; i < songs.length; i++) {
				if(songs[i].sound.isPlaying()){
					songs[i].sound.pause();
				}
				else if(!songs[i].sound.isPlaying() && songs[i].name == nowPlaying.name) {
					songs[i].sound.loop();
				}
			};
		}
	}
}