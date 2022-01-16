import { randomNumber } from "../../../Scripts/util.js";

import Assets from "../../../Assets.js";;

const FPSsDiv = document.getElementById("FPSs");

const textStyle = { fontSize: 15, fill: "#fff", fontFamily: "'Press Start 2P'" };

const screenWorld = {
	width: 400,
	height: 800,
	middleWidth: 0,
	middleHeight: 0,
};

screenWorld.middleWidth = screenWorld.width / 2;
screenWorld.middleHeight = screenWorld.height / 2;

if (!localStorage.phaserInfinityDown) {
	localStorage.phaserInfinityDown = 0;
}

class Platform extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "Verde");
	}

	generate(config) {
		const { x, y, width, height, texture, type, isWall } = config;
		this.x = x;
		this.y = y;
		this.displayWidth = width;
		this.displayHeight = height;
		this.setTexture(texture);
		this.type = type;
		this.isWall = isWall;
		this.body.immovable = true;

		if (!isWall) this.setVelocityY(-100);
	}

	update() {
		if (this.y < 0) this.destroy();
	}
}

class MainScene extends Phaser.Scene {
	constructor() {
		super({ key: "MainScene" });
	}

	init() {
		this.playerSpeed = 3;

		this.pause = false;
		this.isGameOver = false;
		this.score = 0;
		this.platformGroupList = [];
	}

	preload() {
		this.load.image("Player", Assets.Sprites.Quadrados.Branco);

		this.load.image("Verde", Assets.Sprites.Quadrados.Verde); // Plataforma Normal
		this.load.image("Vermelho", Assets.Sprites.Quadrados.Vermelho); // Inimigo

		this.load.image("Amarelo", Assets.Sprites.Quadrados.Amarelo);

		this.load.image("Azul", Assets.Sprites.Quadrados.Azul);
		this.load.image("Rosa", Assets.Sprites.Quadrados.Rosa);
	}

	create() {
		const { width, height, middleWidth, middleHeight } = screenWorld;

		// Player
		this.player = this.physics.add.sprite(middleWidth, 100, "Player");
		this.player.body.gravity.y = 100;
		this.player.setCollideWorldBounds(true);

		this.scoreLabel = this.add.text(middleWidth, 30, "0", textStyle).setOrigin(0.5, 1);

		this.platformGroup = this.physics.add.group({
			classType: Platform,
			runChildUpdate: true,
		});

		// Movement
		this.arrow = this.input.keyboard.createCursorKeys();

		this.input.on("pointermove", (pointer) => {
			if (this.pause) return;
			if (this.player.x < pointer.x) this.player.x += this.playerSpeed;
			else this.player.x -= this.playerSpeed;
		});

		// Reset
		// this.input.on("pointerup", () => this.scene.restart());
		const keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
		keyR.on("down", () => this.scene.restart());

		this.input.on("pointerup", () => {
			if (!this.isGameOver) return;
			this.scene.restart();
		}, this);

		this.createWalls();

		this.timerPlatform = this.time.addEvent({ delay: 1000, callback: this.createRandomPlatform, callbackScope: this, loop: true });
		this.physics.add.collider(this.player, this.platformGroup, this.checkCollisions, null, this);
	}

	createWalls() {
		const { width, height, middleWidth, middleHeight } = screenWorld;
		const wallBase = {
			x: middleWidth,
			y: 0,
			width: width,
			height: 20,
			texture: "Vermelho",
			type: "Vermelho",
			isWall: true,
		};

		const top = this.platformGroup.get();
		if (top) {
			top.generate(wallBase);
		};

		const bottom = this.platformGroup.get();
		if (bottom) {
			wallBase.y = height;
			bottom.generate(wallBase);
		}

		const initial = this.platformGroup.get();
		if (initial) {
			const config = {
				x: middleWidth,
				y: middleHeight,
				width: 40,
				height: 10,
				texture: "Verde",
				type: "Verde",
				isWall: false,
			};
			initial.generate(config);
		}
	}

	checkCollisions(player, platform) {
		if (platform.type === "Vermelho") {
			this.isGameOver = true;
			this.physics.pause();
			this.timerPlatform.paused = true;
			this.pause = true;

			const { width, height, middleWidth, middleHeight } = screenWorld;
			const lose = this.add.text(middleWidth, middleHeight, "Perdeste", { fontSize: 30, fill: "#fff", fontFamily: "'Press Start 2P'" }).setOrigin(0.5);

			const resetText = this.add.text(middleWidth, middleHeight + lose.height, "Clica para recomeçar", { fontSize: 10, fill: "#fff", fontFamily: "'Press Start 2P'" }).setOrigin(0.5, 1);
		}
		player.setVelocityY(0);
	}

	createRandomPlatform() {
		const enemy = randomNumber(0, 1) ? "Vermelho" : "Verde";
		const platConfig = {
			x: randomNumber(0, screenWorld.width),
			y: this.cameras.main.y + screenWorld.height,
			width: randomNumber(20, 64),
			height: 10,
			texture: enemy,
			type: enemy,
			isWall: false,
		};

		const platform = this.platformGroup.get();
		if (platform) {
			platform.generate(platConfig);
			this.platformGroupList.push(platform);
		};
	}

	update() {
		if (this.pause) return;

		FPSsDiv.innerHTML = Number(game.loop.actualFps).toFixed(1);

		if (this.arrow.right.isDown) this.player.x += 1;
		else if (this.arrow.left.isDown) this.player.x -= 1;

		this.score++;
		if (this.score > localStorage.phaserInfinityDown) {
			localStorage.phaserInfinityDown = this.score;
		}
		this.scoreLabel.setText(this.score + "/" + localStorage.phaserInfinityDown);
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
