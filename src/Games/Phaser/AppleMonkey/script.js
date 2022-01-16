import { randomNumber } from "../../../Scripts/util.js";

import Assets from "../../../Assets.js";;

const FPSsDiv = document.getElementById("FPSs");

const textStyle = { fontSize: 30, fill: "#fff", fontFamily: "'Press Start 2P'" };

const screenWorld = {
	width: 800,
	height: 1600,
	middleWidth: 0,
	middleHeight: 0,
};
screenWorld.middleWidth = screenWorld.width / 2;
screenWorld.middleHeight = screenWorld.height / 2;

if (!localStorage.phaserAppleMonkeyBestScore) localStorage.phaserAppleMonkeyBestScore = 0;

class MainScene extends Phaser.Scene {
	constructor() {
		super({ key: "MainScene", });
	}

	init() {
		this.playerSpeed = 250;

		this.isGameOver = false;
		this.score = 0;
	}

	preload() {
		this.load.image("Apple", Assets.Sprites.Maca.MacaPNG);
		this.load.image("Monkey", Assets.Sprites.Macaco.Macaco);
		this.load.image("Arrow", Assets.Sprites.Setas.SetaEsquerda);
		this.load.image("Wall", Assets.Sprites.Quadrados.Cinzento);
	}

	create() {
		const { width, height, middleWidth, middleHeight } = screenWorld;
		const middleHeightMiddle = middleHeight + middleHeight / 2;

		const text = this.score + "/" + localStorage.phaserAppleMonkeyBestScore;
		this.labelScore = this.add.text(middleWidth, middleHeight - middleHeight / 3, text, textStyle).setOrigin(0.5);

		this.apple = this.physics.add.sprite(middleWidth, middleHeight, "Apple").setScale(0.75);
		this.monkey = this.physics.add.sprite(middleWidth - 100, middleHeight - 250, "Monkey")
			.setScale(0.75)
			.setCollideWorldBounds(true);

		const wall = this.physics.add.sprite(0, middleHeightMiddle, "Wall").setScale(25, 13).setOrigin(0).setDepth(0).setImmovable(true);

		this.setControls();
		this.randomApple();

		this.physics.add.collider(this.monkey, wall);

		this.physics.add.overlap(this.monkey, this.apple, (monkey, apple) => {
			this.score++;
			this.playerSpeed += 50;
			this.randomApple();
			this.labelScore.setText(this.score + "/" + localStorage.phaserAppleMonkeyBestScore);
			if (localStorage.phaserAppleMonkeyBestScore < this.score) localStorage.phaserAppleMonkeyBestScore = this.score;
		});

	}

	setControls() {
		const { width, height, middleWidth, middleHeight } = screenWorld;
		const middleHeightMiddle = middleHeight + middleHeight / 2;

		// const graphics = this.add.graphics();
		// graphics.fillStyle(0xFFFFFF, 0.25);
		// graphics.fillRect(0, middleHeightMiddle, width, middleHeightMiddle);


		// Arrow Sprites
		const scale = 0.33;
		const alpha = 0.95;
		const horizontalArrowsX = middleHeightMiddle + middleHeightMiddle / 6;
		this.add.sprite(0, horizontalArrowsX, "Arrow") // Arrow Left
			.setScale(scale)
			.setAlpha(alpha)
			.setOrigin(0, 0.5)
			.setInteractive({ useHandCursor: true, })
			.on("pointerup", () => this.monkey.setVelocity(-this.playerSpeed, 0));

		this.add.sprite(middleWidth, middleHeightMiddle, "Arrow") // Arrow Top
			.setScale(scale)
			.setAlpha(alpha)
			.setOrigin(0, 0.5)
			.setAngle(90)
			.setInteractive({ useHandCursor: true, })
			.on("pointerup", () => this.monkey.setVelocity(0, -this.playerSpeed));

		this.add.sprite(width, horizontalArrowsX, "Arrow") // Arrow Right
			.setScale(scale)
			.setAlpha(alpha)
			.setOrigin(1, 0.5)
			.setFlipX(true)
			.setInteractive({ useHandCursor: true, })
			.on("pointerup", () => this.monkey.setVelocity(this.playerSpeed, 0));

		this.add.sprite(middleWidth, height, "Arrow") // Arrow Bottom
			.setScale(scale)
			.setAlpha(alpha)
			.setOrigin(0, 0.5)
			.setAngle(-90)
			.setInteractive({ useHandCursor: true, })
			.on("pointerup", () => this.monkey.setVelocity(0, this.playerSpeed));


		// Keyboard
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	randomApple() {
		const { width, height, middleWidth, middleHeight } = screenWorld;
		const middleHeightMiddle = middleHeight + middleHeight / 2;

		this.apple.setPosition(
			randomNumber(this.apple.width, width - this.apple.width),
			randomNumber(this.apple.height, middleHeightMiddle - this.apple.height));
	}

	update() {
		if (this.isGameOver) return;
		FPSsDiv.innerHTML = Number(game.loop.actualFps).toFixed(1);

		if (this.cursors.left.isDown) this.monkey.setVelocity(-this.playerSpeed, 0);
		else if (this.cursors.right.isDown) this.monkey.setVelocity(this.playerSpeed, 0);
		else if (this.cursors.up.isDown) this.monkey.setVelocity(0, -this.playerSpeed);
		else if (this.cursors.down.isDown) this.monkey.setVelocity(0, this.playerSpeed);
	}
}

const config = {
	type: Phaser.AUTO,
	width: screenWorld.width,
	height: screenWorld.height,
	backgroundColor: "#808080",
	scale: {
		mode: Phaser.Scale.FIT,
	},
	physics: {
		default: "arcade",
		arcade: {
			// debug: true,
		}
	},
	scene: [MainScene],
};

const game = new Phaser.Game(config);
