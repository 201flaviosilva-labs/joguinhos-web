import Assets from "../../../Assets.js";;

import { randomNumber } from "../../../Scripts/util.js";

const FPSsDiv = document.getElementById("FPSs");

const mundo = {
	width: window.innerWidth,
	height: window.innerHeight,
};

class Play extends Phaser.Scene {
	constructor() {
		super({ key: "MainScene" });
	}

	init() {
		// Player
		this.player = null;
		this.spped = 100;
		this.lastPositions = { x: 0, y: 0 };
		this.snakeBody = [];
		this.direction = "r";

		this.lastTime = 0;

		this.food = null;

		this.lose = false;
	}

	preload() {
		const path = "../../../Assets/Sprite/Bolas/";
		this.load.image("Head", Assets.Sprites.Bola.Azul);
		this.load.image("Corpo", Assets.Sprites.Bola.Verde);
		this.load.image("Maca", Assets.Sprites.Bola.Vermelha);
	}

	create() {
		this.player = this.physics.add.sprite(400, 400, "Head");
		this.player.setCollideWorldBounds(true);

		this.food = this.physics.add.sprite(400, 400, "Maca");
		this.food.setPosition(randomNumber(0, 800), randomNumber(0, 800));
		this.food.scale = 0.5;
		this.food.setCollideWorldBounds(true);

		this.physics.add.overlap(this.player, this.food, this.eatFood, null, this);
		this.physics.add.overlap(this.player, this.snakeBody, this.colisionBody, null, this);
		this.physics.add.overlap(this.food, this.snakeBody, this.foodBody, null, this);
		this.setCursors();
	}

	eatFood(p, f) {
		this.food.setPosition(randomNumber(0, 800), randomNumber(0, 800));
		// this.spped += 10;
		if (this.snakeBody.length) {
			const lastBlock = this.snakeBody[this.snakeBody.length - 1];
			this.snakeBody.push(this.physics.add.sprite(lastBlock.x, lastBlock.y, "Corpo"));
		} else {
			this.snakeBody.push(this.physics.add.sprite(this.lastPositions.x, this.lastPositions.y, "Corpo"));
		}
	}

	colisionBody(p, b) {
		if (b.x === this.snakeBody[0].x && b.y === this.snakeBody[0].y) return;
		else {
			this.lose = true;
			this.add.text(config.width / 2 - 200, config.height / 2 - 10, "Sinceramente Perder Assim? -_-", { fill: "#f00" });
			this.physics.pause();
		}
	}

	foodBody() {
		this.food.setPosition(randomNumber(0, 800), randomNumber(0, 800));
	}

	setCursors() {
		this.cursors = this.input.keyboard.createCursorKeys();
		this.KeyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.KeyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.KeyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.KeyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	}

	update(time) {

		if (this.lose) return;

		FPSsDiv.innerHTML = Number(this.game.loop.actualFps).toFixed(1);

		if ((this.cursors.up.isDown || this.KeyW.isDown) && this.direction !== "d") this.direction = "u";
		else if ((this.cursors.right.isDown || this.KeyD.isDown) && this.direction !== "l") this.direction = "r";
		else if ((this.cursors.down.isDown || this.KeyS.isDown) && this.direction !== "u") this.direction = "d";
		else if ((this.cursors.left.isDown || this.KeyA.isDown) && this.direction !== "r") this.direction = "l";

		if (this.direction === "u") this.player.setVelocity(0, -this.spped);
		else if (this.direction === "r") this.player.setVelocity(this.spped, 0);
		else if (this.direction === "d") this.player.setVelocity(0, this.spped);
		else if (this.direction === "l") this.player.setVelocity(-this.spped, 0);


		if (this.lastTime < time && this.snakeBody.length) {
			this.snakeBody[this.snakeBody.length - 1].destroy();
			this.snakeBody.pop();
			this.snakeBody.unshift(this.physics.add.sprite(this.lastPositions.x, this.lastPositions.y, "Corpo"));
		}

		if (this.lastTime < time) {
			this.lastPositions = { x: this.player.x, y: this.player.y };
			this.lastTime = time + 320;
		}

	}
};

const config = {
	type: Phaser.AUTO,
	width: mundo.width,
	height: mundo.height,
	background: "#bfcc00",
	physics: {
		default: "arcade",
		arcade: {
			debug: false,
		}
	},
	scene: [Play]
};

const game = new Phaser.Game(config);
