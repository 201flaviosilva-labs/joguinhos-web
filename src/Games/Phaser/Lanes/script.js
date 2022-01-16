import { randomNumber } from "../../../Scripts/util.js";

import Assets from "../../../Assets.js";;

const FPSsDiv = document.getElementById("FPSs");

const textStyle = {
	fontSize: 15,
	fill: "#fff",
	fontFamily: "'Press Start 2P'",
	textAlign: "center",
};

const screenWorld = {
	width: 400,
	height: 500,
	middleWidth: 0,
	middleHeight: 0,
};
screenWorld.middleWidth = screenWorld.width / 2;
screenWorld.middleHeight = screenWorld.height / 2;

// ---- Game
class Platform extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, sprite) {
		super(scene, x, y, sprite);
	}

	generate() {
		this.setScale(2);
		this.setVelocityY(100);
	}

	update() {
		if (this.y > screenWorld.height) { this.destroy(); }
	}
}

class MainScene extends Phaser.Scene {
	constructor() {
		super({ key: "MainScene" });
		document.getElementById("InputAutoPlay").addEventListener("change", () => this.autoPlay = !this.autoPlay);
	}

	init() {
		this.numberLanes = randomNumber(2, 5); // { min: 2, max: 5, }
		this.platformDelay = 2500;

		this.playerLane = Math.round(this.numberLanes / 2);
		this.score = 0;
		this.pause = false;

		this.autoPlay = false;

		document.getElementById("NumberLanes").innerHTML = this.numberLanes;
	}

	preload() {
		this.load.image("Player", Assets.Sprites.Quadrados.Branco);

		this.load.image("Vermelho", Assets.Sprites.Quadrados.Vermelho); // Inimigo
	}

	create() {
		const { width, height, middleWidth, middleHeight } = screenWorld;

		// Player
		this.player = this.physics.add.sprite(this.getLanePosition(this.playerLane), height - 50, "Player").setScale(2);
		// Movement
		this.arrow = this.input.keyboard.createCursorKeys();
		this.arrow.right.addListener("down", () => this.playerAddLane());
		this.arrow.left.addListener("down", () => this.playerRemoveLane());

		this.statusLabel = this.add.text(middleWidth, middleHeight, "0", textStyle).setOrigin(0.5).setAlpha(0.5);

		this.platformGroup = this.physics.add.group({
			classType: Platform,
			runChildUpdate: true,
		});

		// Reset
		const keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
		keyR.on("down", () => this.scene.restart());

		this.timerPlatform = this.time.addEvent({
			delay: this.platformDelay,
			callback: this.createPlatform,
			callbackScope: this,
			loop: true,
		});
		this.physics.add.collider(this.player, this.platformGroup, this.checkCollisions, null, this);
	}

	playerAddLane() {
		if (this.playerLane < this.numberLanes - 1) {
			this.playerLane++;
			this.player.setX(this.getLanePosition(this.playerLane));
		}
	}

	playerRemoveLane() {
		if (this.playerLane > 0) {
			this.playerLane--;
			this.player.setX(this.getLanePosition(this.playerLane));
		}
	}

	getLanePosition(lane) {
		const { width } = screenWorld;
		const position = ((width / this.numberLanes) * lane) + (width / (this.numberLanes * 2));
		return position;
	}

	createPlatform() {
		if (this.platformDelay > 1700) {
			this.platformDelay -= 25;
			this.timerPlatform.delay = this.platformDelay;
		}

		const p = this.platformGroup.get(0, 0, "Vermelho");
		if (p) {
			p.generate();
			p.setX(this.getLanePosition(randomNumber(0, this.numberLanes - 1)));
		}
	}

	checkCollisions() {
		this.pause = true;
		this.statusLabel.setAlpha(1);
		this.timerPlatform.paused = true;
		this.physics.pause();
		this.statusLabel.setText("Acabaste de Perder!");
	}

	update() {
		if (this.pause) return;

		const firstP = this.platformGroup.getFirstAlive();
		if (firstP?.x === this.player.x && this.autoPlay) {
			if (Math.random() > 0.5) this.playerAddLane();
			else this.playerRemoveLane();
		}

		FPSsDiv.innerHTML = game.loop.actualFps.toFixed(1);

		this.score++;
		this.statusLabel.setText(this.score);
	}
}

const config = {
	type: Phaser.AUTO,
	width: screenWorld.width,
	height: screenWorld.height,
	backgroundColor: "#000000",
	physics: {
		default: "arcade",
		arcade: {
			// debug: true,
		}
	},
	scene: [MainScene],
};

const game = new Phaser.Game(config);
