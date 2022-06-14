var currentSetScale = undefined;

BasicGame = {

    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null,

    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    orientated: false

};

BasicGame.Boot = function (game) {
};

BasicGame.Boot.prototype = {

    init: function () {

        this.input.maxPointers = 1;
        // this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            // this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setResizeCallback(this.gameResized, this);
        }
        else
        {
            // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            // this.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
            // this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            // this.scale.forceOrientation(true, false);
            this.scale.setResizeCallback(this.gameResized, this);
            // this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            // this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }

        // this.scale.setShowAll();
        // this.gameResized();

    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        // this.load.image('preloaderBackground', 'images/preloader_background.jpg');
        this.load.image('preloaderBar', 'assets/images/preloaderBar.png');

    },

    create: function () {

        this.state.start('Preloader');

    },

    gameResized: function (gameSize,newSize) 
    {
        if (this.game.device.desktop)
        {
            // console.log("Called!");
            // console.log("inner: " + window.innerWidth + "x" + window.innerHeight);
            // console.log("gameSize: " + gameSize.width + "x" + gameSize.height);
            // console.log("newSize: " + newSize.width + "x" + newSize.height);

            if (window.innerWidth > window.innerHeight)
            {
                // console.log(newSize.width + "x" + newSize.height);
                // this.scale.setUserScale (newSize.height / gameSize.height , newSize.height / gameSize.height);          
                this.scale.setUserScale (window.innerHeight / 480 , window.innerHeight / 480);          
            }
            else
            {
                this.scale.setUserScale (window.innerWidth / 640 , window.innerWidth / 640 );          
            }   

        }
        else if (!this.game.scale.isFullScreen)
        {
            if (window.innerWidth > window.innerHeight)
            {
                // console.log(newSize.width + "x" + newSize.height);
                // this.scale.setUserScale (newSize.height / gameSize.height , newSize.height / gameSize.height);          
                this.scale.setUserScale (window.innerHeight / 480 , window.innerHeight / 480);          
            }
            else
            {
                this.scale.setUserScale (window.innerWidth / 640 , window.innerWidth / 640 );          
            }   
        }

        // currentSetScale.width = window.innerWidth/gameSize.width * 640;
        // currentSetScale.height = window.innerWidth/gameSize.width * 640;

        // this.scale.setUserScale (2 , 3);          

        // this.scale.refresh();
    },

    enterIncorrectOrientation: function () {

        BasicGame.orientated = false;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        BasicGame.orientated = true;

        document.getElementById('orientation').style.display = 'none';

    }

};