var Brick = function (game, x, y, row, col, tone) {

	this.row = row;
	this.col = col;

	this.score = 7 - 3*Math.floor(row / 2);

	// if (tone)
	// {
	// 	this.sound = game.add.audio('' + row,1,false);
	// }
	// else
	// {
	// 	this.sound = game.add.audio('drum' + row,1,false);
	// }

	Phaser.Sprite.call(this, game, x, y, '' + row);
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	game.add.existing(this);
};


Brick.prototype = Object.create(Phaser.Sprite.prototype);



Brick.prototype.constructor = Brick;



Brick.prototype.update = function () {

};


Brick.prototype.destroy = function () {

	// this.sound.destroy();
	Phaser.Sprite.call(this);

};


Brick.prototype.disable = function () {

	this.body.enable = false;
	this.visible = false;

};


Brick.prototype.showNote = function () {

	this.visible = true;
	this.alpha = 0.5;
	this.game.time.events.add(Phaser.Timer.SECOND * 0.25, this.unshowNote, this);

};


Brick.prototype.unshowNote = function () {

	this.visible = false;

};

