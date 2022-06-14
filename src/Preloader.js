
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		// this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(0, 0, 'preloaderBar');
		this.preloadBar.y = this.game.canvas.width/2 - this.preloadBar.height/2;

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		this.load.bitmapFont('atari', 'assets/fonts/atari.png', 'assets/fonts/atari.xml');

		this.load.image('bg','assets/images/bg.jpg');
		this.load.image('paddle','assets/images/paddle.png');
		this.load.image('ball','assets/images/ball.png');
		this.load.image('left_wall','assets/images/left_wall.png');
		this.load.image('right_wall','assets/images/right_wall.png');
		this.load.image('top_wall','assets/images/top_wall.png');

		this.load.image('5','assets/images/brick_blue.png');
		this.load.image('4','assets/images/brick_green.png');
		this.load.image('3','assets/images/brick_yellow.png');
		this.load.image('2','assets/images/brick_orange.png');
		this.load.image('1','assets/images/brick_oranger.png');
		this.load.image('0','assets/images/brick_red.png');

		this.load.audio('5',['assets/sounds/brick_blue.mp3','assets/sounds/brick_blue.ogg']);
		this.load.audio('4',['assets/sounds/brick_green.mp3','assets/sounds/brick_green.ogg']);
		this.load.audio('3',['assets/sounds/brick_yellow.mp3','assets/sounds/brick_yellow.ogg']);
		this.load.audio('2',['assets/sounds/brick_orange.mp3','assets/sounds/brick_orange.ogg']);
		this.load.audio('1',['assets/sounds/brick_oranger.mp3','assets/sounds/brick_oranger.ogg']);
		this.load.audio('0',['assets/sounds/brick_red.mp3','assets/sounds/brick_red.ogg']);

		this.load.audio('drum0',['assets/sounds/kick.mp3','assets/sounds/kick.ogg']);
		this.load.audio('drum1',['assets/sounds/snare.mp3','assets/sounds/snare.ogg']);
		this.load.audio('drum2',['assets/sounds/hihat.mp3','assets/sounds/hihat.ogg']);
		this.load.audio('drum3',['assets/sounds/kick2.mp3','assets/sounds/kick2.ogg']);
		this.load.audio('drum4',['assets/sounds/snare2.mp3','assets/sounds/snare2.ogg']);
		this.load.audio('drum5',['assets/sounds/clap.mp3','assets/sounds/clap.ogg']);
	},


	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},


	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.cache.isSoundDecoded('5') && this.cache.isSoundDecoded('4') && this.cache.isSoundDecoded('3') && 
			this.cache.isSoundDecoded('2') && this.cache.isSoundDecoded('1') && this.cache.isSoundDecoded('drum5') && 
			this.cache.isSoundDecoded('drum4') && this.cache.isSoundDecoded('drum3') && this.cache.isSoundDecoded('drum2') && 
			this.cache.isSoundDecoded('drum1') && this.cache.isSoundDecoded('0') && this.cache.isSoundDecoded('drum0'))
		{
			this.ready = true;
			this.state.start('Game');
		}

	}

};
