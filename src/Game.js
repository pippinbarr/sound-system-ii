var PADDLE_SPEED = 800;
var BALL_SPEED = 400;
var BRICKS;
var LEVEL = 1;
var NUM_LEVELS = 10;
var SEQUENCER_LENGTH = 40;
var SEQUENCER_SCALE = 0.125;
var TIME_SCALE = 0.25;
var SEEN_CONTROLS = false;
var CONTROLS_SEEN_THRESHOLD = 60;


var CURRENT_INSTRUMENT = "TONES";
var TONES = undefined;
var DRUMS = undefined;
var SHOW_LEVEL_HINT = true;

BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.state;     //  the state manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};


BasicGame.Game.prototype = {

    create: function () {

        this.game.stage.backgroundColor = '#000000';

        this.level = LEVEL;

        if (this.level <= 5)
        {
            CURRENT_INSTRUMENT = "TONES";
        }
        else
        {
            CURRENT_INSTRUMENT = "DRUMS";
        }

        this.bg = this.game.add.sprite(0,0,'bg');

        this.physics.startSystem(Phaser.Physics.ARCADE);


        // PADDLE

        this.paddle = this.game.add.sprite(0,0,'paddle');
        this.paddle.x = this.game.canvas.width/2 - this.paddle.width/2;
        this.paddle.y = this.game.canvas.height - 3*this.paddle.height;
        this.game.physics.enable(this.paddle, Phaser.Physics.ARCADE);
        this.paddle.body.immovable = true;


        // BALL

        this.ball = this.game.add.sprite(0,0,'ball');
        this.ball.x = this.game.canvas.width/2 - this.ball.width/2;
        this.ball.y = this.game.canvas.height/2 + this.ball.height*4;
        this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);
        this.ball.body.bounce.setTo(1,1);

        this.ball.collides = false;

        this.ball.body.velocity.x = 0;
        this.ball.body.velocity.y = 0;
        this.ball.body.x = this.paddle.x + this.paddle.width/2 - this.ball.width/2;
        this.ball.body.y = this.paddle.y - 160;

        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.restartBall, this);

        // this.ball.body.enable = false;

        // WALLS

        this.walls = this.game.add.group();

        this.leftWall = this.game.add.sprite(0,40,'left_wall');
        this.game.physics.enable(this.leftWall, Phaser.Physics.ARCADE);
        this.walls.add(this.leftWall);
        this.leftWall.body.immovable = true;

        this.rightWall = this.game.add.sprite(0,0,'right_wall');
        this.rightWall.x = this.game.canvas.width - this.rightWall.width;
        this.rightWall.y = this.leftWall.y;
        this.game.physics.enable(this.rightWall, Phaser.Physics.ARCADE);
        this.walls.add(this.rightWall);
        this.rightWall.body.immovable = true;

        this.topWall = this.game.add.sprite(0,0,'top_wall');
        this.topWall.x = 0;
        this.topWall.y = this.leftWall.y;
        this.game.physics.enable(this.topWall, Phaser.Physics.ARCADE);
        this.walls.add(this.topWall);
        this.topWall.body.immovable = true;


        // BRICKS

        this.bricks = this.game.add.group();


        BRICKS = [];

        this.addBrickRow(0,'brick_red');
        this.addBrickRow(1,'brick_oranger');
        this.addBrickRow(2,'brick_orange');
        this.addBrickRow(3,'brick_yellow');
        this.addBrickRow(4,'brick_green');
        this.addBrickRow(5,'brick_blue');


        // SOUNDS

        // this.kick = this.game.add.audio('drum0',1,false);
        // this.snare = this.game.add.audio('drum1',1,false);

        // this.tones = [];
        // for (i = 0; i < 6; i++)
        // {
        //     this.tones.push(this.game.add.audio('' + i,1,false));
        // }

        // this.drums = [];
        // for (i = 0; i < 6; i++)
        // {
        //     this.drums.push(this.game.add.audio('drum' + i,1,false));
        // }

        if (TONES == undefined)
        {
            TONES = [];
            for (i = 0; i < 6; i++)
            {
                TONES.push(this.game.add.audio('' + i,1,false));
            }
        }

        if (DRUMS == undefined)
        {
            DRUMS = [];
            for (i = 0; i < 6; i++)
            {
                DRUMS.push(this.game.add.audio('drum' + i,1,false));
            }
        }

        // TEXTS

        this.score = 0;
        this.scoreText = this.game.add.bitmapText(0, 8, 'atari','0',120);
        this.scoreText.tint = 0x888888;
        // this.scoreText.align = 'right';
        this.scoreText.scale.x = 0.75;
        this.scoreText.scale.y = 0.25;


        this.updateScore(0);

        this.paddles = 5;
        this.paddlesText = this.game.add.bitmapText(0, 8, 'atari', '' + this.paddles, 120);
        this.paddlesText.tint = 0x888888;
        this.paddlesText.scale.x = 0.75;
        this.paddlesText.scale.y = 0.25;

        this.updatePaddles(this.paddles);

        this.levelText = this.game.add.bitmapText(0, 8, 'atari','1',120);
        this.levelText.tint = 0x888888;
        this.levelText.scale.x = 0.75;
        this.levelText.scale.y = 0.25;

        this.updateLevel(this.level);

        changeLevelString = "";
        if (this.game.device.desktop)
        {
            changeLevelString = "PRESS SPACEBAR\nTO CHANGE LEVEL";
        }
        else
        {
            changeLevelString = "TAP CENTER OF SCREEN\nTO CHANGE LEVEL";           
        }

        this.changeLevelText = this.game.add.bitmapText(40, 8, 'atari',changeLevelString,14);
        this.changeLevelText.tint = 0x888888;


        controlsString = "";
        if (this.game.device.desktop)
        {
            controlsString = "LEFT AND RIGHT TO MOVE PADDLE";
            this.controlsText = this.game.add.bitmapText(40, 8, 'atari',controlsString,32);
            this.controlsText2 = this.game.add.bitmapText(this.controlsText.x,this.controlsText.y + this.controlsText.height + 4, 'atari', "SPACEBAR TO CHANGE LEVEL",32);

        }
        else
        {
            controlsString = "TOUCH LEFT AND RIGHT OF SCREEN TO MOVE PADDLE";  
            this.controlsText = this.game.add.bitmapText(40, 8, 'atari',controlsString,22);
            this.controlsText2 = this.game.add.bitmapText(this.controlsText.x,this.controlsText.y + this.controlsText.height + 4, 'atari', "TOUCH CENTER OF SCREEN TO CHANGE LEVEL",22);

        }

        this.controlsText.tint = 0x888888;
        this.controlsText2.tint = 0x888888;

        this.controlsText.x = this.game.canvas.width/2 - this.controlsText.width/2 - 6;
        this.controlsText.y = 88;

        this.controlsText2.x = this.controlsText.x;
        this.controlsText2.y = this.controlsText.y + this.controlsText.height + 4;

        this.controlsText2.visible = SHOW_LEVEL_HINT;

        this.controlsUsed = 0;

        if (SEEN_CONTROLS) this.controlsText.visible = false;

        this.soundQueue = [];

        this.initializeSequencer();


        this.game.time.events.add(Phaser.Timer.SECOND * SEQUENCER_SCALE, this.playSoundQueue, this);
    },


    initializeSequencer: function ()
    {
        this.sequencer = [];
        this.sequencer = new Array(SEQUENCER_LENGTH);
        for (i = 0; i < this.sequencer.length; i++) 
        {
            this.sequencer[i] = new Array(6);
        }
        this.sequencerIndex = 0;
        this.justSequencedBrick = undefined;
    },


    playSoundQueue: function ()
    {
        while (this.soundQueue.length > 0)
        {
            soundIndex = this.soundQueue.pop();
            if (soundIndex >= 0)
            {
                if (CURRENT_INSTRUMENT == "DRUMS") DRUMS[soundIndex].play();
                else if (CURRENT_INSTRUMENT == "TONES") TONES[soundIndex].play();
            }
            else
            {
                if (CURRENT_INSTRUMENT == "DRUMS") TONES[-(soundIndex + 1)].play();
                else if (CURRENT_INSTRUMENT == "TONES") DRUMS[-(soundIndex + 1)].play();
            }
        }

        if (this.level == 5 || this.level == 10)
        {
            for (i = 0; i < 6; i++)
            {
                if (this.sequencer[this.sequencerIndex][i] != undefined &&
                    this.sequencer[this.sequencerIndex][i] != this.justSequencedBrick)
                {
                // if (this.level <= NUM_LEVELS/2)
                // {
                //     this.tones[i].play(); 
                // }
                // else
                // {
                //     this.drums[i].play();           
                // }

                if (CURRENT_INSTRUMENT == "DRUMS") 
                {
                    DRUMS[this.sequencer[this.sequencerIndex][i].row].play();
                }
                else if (CURRENT_INSTRUMENT == "TONES") 
                {
                    TONES[this.sequencer[this.sequencerIndex][i].row].play();
                }

                // this.sequencer[this.sequencerIndex][i].sound.play();
                this.sequencer[this.sequencerIndex][i].showNote();
                this.justSequencedBrick = undefined;
            }
        }
    }

    this.sequencerIndex = (this.sequencerIndex + 1) % this.sequencer.length;

    this.game.time.events.add(Phaser.Timer.SECOND * SEQUENCER_SCALE, this.playSoundQueue, this);
},


updateScore: function (score) 
{
    this.score += score;
    this.scoreText.text = "" + this.score;
    this.scoreText.updateText();
    this.scoreText.x = this.game.canvas.width - 280 - this.scoreText.width;
},


updatePaddles: function (paddles) 
{
    this.paddlesText.text = "" + paddles;
    this.paddlesText.updateText();
    this.paddlesText.x = this.game.canvas.width - 160 - this.paddlesText.width;
},


updateLevel: function (level) 
{
    this.levelText.text = "" + this.level;
    this.levelText.updateText();
    this.levelText.x = this.game.canvas.width - 40 - this.levelText.width;
},


addBrickRow: function (row,brickImage) 
{
    BRICKS.push([]);

    brickX = this.leftWall.x + this.leftWall.width;
    brickY = this.topWall.y + this.topWall.height + 80 + row * 15;

    col = 0;
    while(brickX < this.rightWall.x)
    {
        if (this.level <= NUM_LEVELS/2)
        {
            brick = new Brick(this,brickX,brickY,row,col,true);
        }
        else
        {
            brick = new Brick(this,brickX,brickY,row,col,false);
        }
        brickX += brick.width;
        col++;
        this.game.physics.enable(brick, Phaser.Physics.ARCADE);
        brick.body.immovable = true;

        this.bricks.add(brick);
        BRICKS[row].push(brick);
    }
},


update: function () 
{

    if (this.leftJustPressed())
    {
            // this.kick.play();
        }
        if (this.rightJustPressed())
        {
            // this.snare.play();
        }

        if (this.leftPressed())
        {
            this.controlsUsed++;
            this.paddle.body.velocity.x = -PADDLE_SPEED;
        }
        else if (this.rightPressed())         
        {
            this.controlsUsed++;
            this.paddle.body.velocity.x = PADDLE_SPEED;
        }
        else
        {
            this.paddle.body.velocity.x = 0;
        }

        if (this.changeLevelPressed())
        {
            SHOW_LEVEL_HINT = false;
            this.controlsText2.visible = false;
            LEVEL++;
            if (LEVEL > NUM_LEVELS) LEVEL = 1;
            this.resetGame();
        }

        this.physics.arcade.overlap(this.paddle,this.walls,this.handleWallColliders,this.processWallColliders,this);
        this.physics.arcade.collide(this.ball,this.paddle,this.handleBallColliders,this.processBallColliders,this);
        // this.physics.arcade.collide(this.ball,this.bricks,this.handleBrickColliders,this.processBrickColliders,this);
        this.physics.arcade.overlap(this.ball,this.bricks,this.handleBrickColliders,this.processBrickColliders,this);
        this.physics.arcade.collide(this.ball,this.walls,this.handleBallWallColliders,this.processBallWallColliders,this);

        if (this.ball.body.velocity.y != 0 && this.ball.y > this.game.canvas.height)
        {
            // Ball is out.
            this.paddles--;
            this.updatePaddles(this.paddles);
            if (this.paddles > 0)
            {
                this.ball.body.velocity.x = 0;
                this.ball.body.velocity.y = 0;
                this.ball.body.x = this.paddle.x + this.paddle.width/2 - this.ball.width/2;
                this.ball.body.y = this.paddle.y - 160;

                this.game.time.events.add(Phaser.Timer.SECOND * 1, this.restartBall, this);
            }
            else
            {
                this.ball.body.velocity.x = this.ball.body.velocity.y = 0;
            }

            this.initializeSequencer();
        }

        if (this.controlsUsed > CONTROLS_SEEN_THRESHOLD)
        {
            this.controlsText.visible = false;
            SEEN_CONTROLS = true;
        }
    },


    restartBall: function ()
    {
        this.ball.body.velocity.x = 20 - Math.random() * 40;
        this.ball.body.velocity.y = BALL_SPEED;
    },


    leftPressed: function ()
    {
        if (this.game.device.desktop && this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            return true;
        }
        else if (this.game.input.activePointer.isDown && this.game.input.activePointer.x < window.innerWidth/3)
        {
            return true;
        }
        else
        {
            return false;
        }
    },


    rightPressed: function ()
    {
        return ((this.game.device.desktop && this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) ||
            (this.game.input.activePointer.isDown &&
                this.game.input.activePointer.x > 2*this.game.canvas.width/3));
    },


    leftJustPressed: function ()
    {
        return ((this.game.device.desktop && this.game.input.keyboard.downDuration(Phaser.Keyboard.LEFT,10)) ||
            (this.game.input.activePointer.justPressed(30) &&
             this.game.input.activePointer.x < this.game.canvas.width/3));
    },


    rightJustPressed: function ()
    {
        return ((this.game.device.desktop && this.game.input.keyboard.downDuration(Phaser.Keyboard.RIGHT,10)) ||
            (this.game.input.activePointer.justPressed(30) &&
                this.game.input.activePointer.x > 2*this.game.canvas.width/3));
    },


    changeLevelPressed: function ()
    {
        return ((this.game.device.desktop && this.game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR,10)) ||
            (this.game.input.activePointer.justPressed(30) && 
                this.game.input.activePointer.x > this.game.canvas.width/3 &&
                this.game.input.activePointer.x < 2*this.game.canvas.width/3 &&
                this.game.input.activePointer.y > this.game.canvas.height/3 &&
                this.game.input.activePointer.y < 2*this.game.canvas.height/3));
    },


    handleWallColliders: function (paddle,wall)
    {
        paddle.body.velocity.x = 0;

        if (wall == this.leftWall) paddle.body.x = wall.body.x + wall.width;
        else if (wall == this.rightWall) paddle.body.x = wall.body.x - paddle.width;
    },


    processWallColliders: function (paddle,wall)
    {
    },


    handleBallColliders: function (ball,paddle)
    {
    },


    processBallColliders: function (ball,paddle)
    {
        paddleMid = this.paddle.x + this.paddle.width/2;
        ballMid = this.ball.x + this.ball.width/2;
        diff = 0;

        if (ballMid < paddleMid)
        {
            //  Ball is on the left of the bat
            diff = paddleMid - ballMid;
            this.ball.body.velocity.x = ( -10 * diff);
        }
        else if (ballMid > paddleMid)
        {
            //  Ball on the right of the bat
            diff = ballMid - paddleMid;
            this.ball.body.velocity.x = (10 * diff);
        }
        else
        {
            //  Ball is perfectly in the middle
            //  A little random X to stop it bouncing up!
            this.ball.body.velocity.x = 2 + Math.floor(Math.random() * 8);
        }

        if (this.level <= NUM_LEVELS/2)
        {
            // this.kick.play();
            // this.soundQueue.push(this.kick);
            this.soundQueue.push(-1);
        }
        else
        {
            index = Math.floor(Math.random() * TONES.length);
            // this.tones[index].play();
            this.soundQueue.push(-1 - index);
            // this.soundQueue.push(this.tones[index]);
        }

        this.ball.collides = true;
    },


    handleBrickColliders: function (ball,brick)
    {
        if (!this.ball.collides) return;

        this.updateScore(brick.score);

        // brick.sound.volume = 1;
        // this.soundQueue.push(brick.sound);
        this.soundQueue.push(brick.row);

        switch (this.level)
        {
            case 1:

            break;

            case 2:

            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.upStrum, this, brick.row, brick.col);
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.downStrum, this, brick.row, brick.col);
            break;

            case 3:

            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.leftStrum, this, brick.row, brick.col);
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.rightStrum, this, brick.row, brick.col);
            break;

            case 4:

            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.upStrum, this, brick.row, brick.col);
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.downStrum, this, brick.row, brick.col);
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.leftStrum, this, brick.row, brick.col);
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.rightStrum, this, brick.row, brick.col);
            break;

            case 5:

            // this.sequencer[this.sequencerIndex][brick.row] = true;
            this.sequencer[this.sequencerIndex][brick.row] = brick;
            this.justSequencedBrick = brick;

            break;

            case 6:

            break;


            case 7:

            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.upStrum, this, brick.row, brick.col);
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.downStrum, this, brick.row, brick.col);
            break;

            case 8:

            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.leftStrum, this, brick.row, brick.col);
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.rightStrum, this, brick.row, brick.col);
            break;

            case 9:

            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.upStrum, this, brick.row, brick.col);
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.downStrum, this, brick.row, brick.col);
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.leftStrum, this, brick.row, brick.col);
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.rightStrum, this, brick.row, brick.col);
            break;

            case 10:
            // this.sequencer[this.sequencerIndex][brick.row] = true;
            this.sequencer[this.sequencerIndex][brick.row] = brick;
            this.justSequencedBrick = brick;
            break;
        }

        this.ball.body.velocity.y *= -1;
        this.ball.collides = false;

        // brick.kill();
        brick.disable();
    },


    upStrum: function (callingRow, callingCol)
    {
        if (BRICKS[callingRow][callingCol] != null) 
        {
            BRICKS[callingRow][callingCol].tint = 0xffffff;
        }


        if (callingRow > 0)
        {
            if (!BRICKS[callingRow-1][callingCol].alive) return;

            // BRICKS[callingRow-1][callingCol].sound.play();
            // BRICKS[callingRow-1][callingCol].sound.volume = 1;
            // this.soundQueue.push(BRICKS[callingRow-1][callingCol].sound);
            this.soundQueue.push(BRICKS[callingRow-1][callingCol].row);
            BRICKS[callingRow-1][callingCol].tint = 0x555555;
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.upStrum, this, callingRow - 1, callingCol);        
        }
    },

    downStrum: function (callingRow, callingCol)
    {
        if (BRICKS[callingRow][callingCol] != null) 
        {
            BRICKS[callingRow][callingCol].tint = 0xffffff;
        }

        if (callingRow < BRICKS.length - 1)
        {
            if (!BRICKS[callingRow+1][callingCol].alive) return;

            // BRICKS[callingRow+1][callingCol].sound.play();
            // BRICKS[callingRow+1][callingCol].sound.volume = 1;
            // this.soundQueue.push(BRICKS[callingRow+1][callingCol].sound);
            this.soundQueue.push(BRICKS[callingRow+1][callingCol].row);
            BRICKS[callingRow+1][callingCol].tint = 0x555555;
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.downStrum, this, callingRow + 1, callingCol);        
        }
    },

    leftStrum: function (callingRow, callingCol)
    {
        if (BRICKS[callingRow][callingCol] != null) 
        {
            BRICKS[callingRow][callingCol].tint = 0xffffff;
        }

        if (callingCol > 0)
        {
            if (!BRICKS[callingRow][callingCol-1].alive) return;

            // BRICKS[callingRow][callingCol-1].sound.play();
            // BRICKS[callingRow][callingCol-1].sound.volume = 0.5;
            // this.soundQueue.push(BRICKS[callingRow][callingCol-1].sound);
            this.soundQueue.push(BRICKS[callingRow][callingCol-1].row);
            BRICKS[callingRow][callingCol-1].tint = 0x555555;
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.leftStrum, this, callingRow, callingCol-1);        
        }
    },

    rightStrum: function (callingRow, callingCol)
    {
        if (BRICKS[callingRow][callingCol] != null) 
        {
            BRICKS[callingRow][callingCol].tint = 0xffffff;
        }

        if (callingCol < BRICKS[callingRow].length - 1)
        {
            if (!BRICKS[callingRow][callingCol+1].alive) return;

            // BRICKS[callingRow][callingCol+1].sound.play();
            // BRICKS[callingRow][callingCol+1].sound.volume = 0.5;
            // this.soundQueue.push(BRICKS[callingRow][callingCol+1].sound);
            this.soundQueue.push(BRICKS[callingRow][callingCol+1].row);
            BRICKS[callingRow][callingCol+1].tint = 0x555555;
            this.game.time.events.add(Phaser.Timer.SECOND * TIME_SCALE, this.rightStrum, this, callingRow, callingCol+1);        
        }
    },



    processBrickColliders: function (ball,brick)
    {
    },


    handleBallWallColliders: function (ball,wall)
    {
        if (wall == this.topWall) this.ball.collides = true;
    },


    processBallWallColliders: function (ball,wall)
    {
        if (this.level <= 5)
        {
            // this.snare.play();
            // this.soundQueue.push(this.snare);
            this.soundQueue.push(-2);
        }
        else
        {
            index = Math.floor(Math.random() * TONES.length);
            // this.tones[index].play();
            // this.soundQueue.push(this.tones[index]);
            this.soundQueue.push(-index);
        }    
    },


    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    },


    resetGame: function () {


        this.game.state.start('Game');

    },


    shutdown: function () {

        console.log("Shutdown!");

        this.bg.destroy();
        this.paddle.destroy();
        this.ball.destroy();
        this.walls.destroy();
        this.bricks.destroy();
        this.scoreText.destroy();
        this.paddlesText.destroy();
        this.levelText.destroy();
        this.changeLevelText.destroy();
        this.controlsText.destroy();
        this.controlsText2.destroy();

    }

};
