import { randomNumber } from "../../../Scripts/util.js";

import Assets from "../../../Assets.js";;

const FPSsDiv = document.getElementById("FPSs");

const textStyle = { fontSize: 15, fill: "#fff", fontFamily: "'Press Start 2P'" };

const screenWorld = {
	width: 1200,
	height: 600,
	middleWidth: 0,
	middleHeight: 0,
};

screenWorld.middleWidth = screenWorld.width / 2;
screenWorld.middleHeight = screenWorld.height / 2;

if (!localStorage.phaserChromeDino) { localStorage.phaserChromeDino = 0; }

let platformSpeed = 150;

let score = 0;

class Platform extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "Vermelho");
	}

	generate() {
		this.x = screenWorld.width;
		this.y = screenWorld.height;
		this.body.immovable = true;

		this.setOrigin(0.5, 1);
		this.setScale(1 + (platformSpeed - 150) * 0.01, 2);
		platformSpeed += 10;
		this.setVelocityX(-platformSpeed);
	}

	update() {
		if (this.x < 0) {
			this.destroy();
			score++;
			if (score > localStorage.phaserChromeDino) localStorage.phaserChromeDino = score;
		}
	}
}

class MainScene extends Phaser.Scene {
	constructor() {
		super({ key: "MainScene" });
	}

	init() {
		this.isPause = false;
		score = 0;

		this.playerJumpSpeed = 200;
	}

	preload() {
		this.load.image("Run", Assets.Sprites.Bola.Verde);
		this.load.image("Dead", Assets.Sprites.Bola.Vermelha);
		this.load.image("Jump", Assets.Sprites.Bola.Amarelo);

		this.load.image("Vermelho", Assets.Sprites.Quadrados.Vermelho);
	}

	create() {
		const { width, height, middleWidth, middleHeight } = screenWorld;
		this.input.keyboard.removeAllKeys(true);

		this.arrow = this.input.keyboard.createCursorKeys();

		this.player = this.physics.add.sprite(100, middleHeight, "Run");
		this.player.body.gravity.y = this.playerJumpSpeed;
		this.player.setCollideWorldBounds(true);;
		this.player.setCircle(16);

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

		if (!this.player.body.onFloor()) return;

		const endY = this.player.y - this.playerJumpSpeed;
		this.player.setTexture("Jump");
		this.tweens.add({
			targets: this.player,
			ease: "Cubic",
			duration: 500,
			y: { from: this.player.y, to: endY },
			onStart: () => this.player.setVelocityY(-20),
			onComplete: () => this.player.setTexture("Run"),
		});
	}

	createRandomPlatform() {
		if (this.isPause) return;

		const platform = this.platformGroup.get();
		if (platform) platform.generate();
	}

	stopGame() {
		const { width, height, middleWidth, middleHeight } = screenWorld;

		this.isPause = true;
		this.physics.pause();
		this.timerPlatform.paused = true;
		this.player.setTexture("Dead");

		const lose = this.add.text(middleWidth, middleHeight, "Perdeste", { ...textStyle, fontSize: 30 }).setOrigin(0.5);
		const resetText = this.add.text(middleWidth, middleHeight + lose.height, "Clica para recomeçar", { ...textStyle, fontSize: 10 }).setOrigin(0.5, 1);
	}

	update() {
		if (this.isPause) return;

		FPSsDiv.innerHTML = Number(game.loop.actualFps).toFixed(1);

		if (this.arrow.up.isDown) this.playerJump();
		if (this.arrow.down.isDown) this.player.setVelocityY(300);

		if (this.arrow.left.isDown) this.player.setVelocityX(-100);
		else if (this.arrow.right.isDown) this.player.setVelocityX(100);
		else this.player.setVelocityX(0);

		this.scoreLabel.setText(score + "/" + localStorage.phaserChromeDino);
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
			// debug: true
		}
	},
	scene: [MainScene],
};

const game = new Phaser.Game(config);
