import { randomNumber } from "../../../Scripts/util.js";

import Assets from "../../../Assets.js";;

const FPSsDiv = document.getElementById("FPSs");

const textStyle = { fontSize: 15, fill: "#fff", fontFamily: "'Press Start 2P'" };

const screenWorld = {
	width: 600,
	height: 400,
	middleWidth: 0,
	middleHeight: 0,
};

screenWorld.middleWidth = screenWorld.width / 2;
screenWorld.middleHeight = screenWorld.height / 2;

if (!localStorage.phaserOPassaro) {
	localStorage.phaserOPassaro = 0;
}

class Platform extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "Vermelho");
	}

	generate(config) {
		const { x, y, width, height } = config;
		this.x = x;
		this.y = y;
		this.displayWidth = width;
		this.displayHeight = height;
		this.body.immovable = true;

		this.setVelocityX(-100);
	}

	update() {
		if (this.x < 0) this.destroy();
	}
}

class MainScene extends Phaser.Scene {
	constructor() {
		super({ key: "MainScene" });
	}

	preload() {
		this.load.image("Player", Assets.Sprites.Quadrados.Branco);
		this.load.image("Vermelho", Assets.Sprites.Quadrados.Vermelho);
	}

	create() {
		const { width, height, middleWidth, middleHeight } = screenWorld;

		this.isPause = false;
		this.score = 0;

		this.arrow = this.input.keyboard.createCursorKeys();

		this.player = this.physics.add.sprite(100, middleHeight, "Player");
		this.player.body.gravity.y = 100;
		this.player.setCollideWorldBounds(true);

		this.scoreLabel = this.add.text(middleWidth, 30, "0", textStyle).setOrigin(0.5, 1);

		this.platformGroup = this.physics.add.group({
			classType: Platform,
			runChildUpdate: true,
		});

		const keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		const keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

		keySpace.on("down", this.playerJump, this);
		this.input.on("pointerup", this.playerJump, this);
		keyR.on("down", () => this.scene.restart());

		this.timerPlatform = this.time.addEvent({ delay: 2500, callback: this.createRandomPlatform, callbackScope: this, loop: true });
		this.physics.add.overlap(this.player, this.platformGroup, this.stopGame, null, this);
	}

	playerJump() {
		if (this.isPause) this.scene.restart();

		const endY = this.player.y - 75;
		this.tweens.add({
			targets: this.player,
			ease: "Cubic",
			duration: 500,
			y: { from: this.player.y, to: endY },
			onStart: () => this.player.setVelocityY(-10),
		});
	}

	createRandomPlatform() {
		if (this.isPause) return;

		const { width, height, middleWidth, middleHeight } = screenWorld;

		if (this.platformGroup.children.entries.length > 3) {
			this.score++;
			if (this.score > localStorage.phaserOPassaro) localStorage.phaserOPassaro = this.score;
		}

		// Up
		const playerSpace = 150;
		const randomY = randomNumber(80, height - playerSpace);
		const configUp = {
			x: width,
			y: randomY,
			width: 40,
			height: randomY,
		};
		const platformUp = this.platformGroup.get();
		if (platformUp) {
			platformUp.setOrigin(0.5, 1);
			platformUp.generate(configUp);
		}

		// Down
		const configDown = {
			x: width,
			y: randomY + playerSpace,
			width: 40,
			height: height - (randomY + playerSpace),
		};
		const platformDown = this.platformGroup.get();
		if (platformDown) {
			platformDown.setOrigin(0.5, 0);
			platformDown.generate(configDown);
		}
	}

	stopGame() {
		const { width, height, middleWidth, middleHeight } = screenWorld;

		this.isPause = true;
		this.physics.pause();
		this.timerPlatform.paused = true;

		const lose = this.add.text(middleWidth, middleHeight, "Perdeste", { ...textStyle, fontSize: 30 }).setOrigin(0.5);
		const resetText = this.add.text(middleWidth, middleHeight + lose.height, "Clica para recomeçar", { ...textStyle, fontSize: 10 }).setOrigin(0.5, 1);
	}

	update() {
		if (this.isPause) return;

		FPSsDiv.innerHTML = Number(game.loop.actualFps).toFixed(1);

		this.scoreLabel.setText(this.score + "/" + localStorage.phaserOPassaro);
	}
}

const config = {
	type: Phaser.AUTO,
	width: screenWorld.width,
	height: screenWorld.height,
	backgroundColor: "#000000",
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
