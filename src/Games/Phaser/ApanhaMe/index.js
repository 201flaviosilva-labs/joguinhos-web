import Assets from "../../../Assets.js";
import { randomNumber } from "../../../Scripts/util.js";

const FPSsDiv = document.getElementById("FPSs");

const world = {
	width: 800,
	height: 800
}

class Play extends Phaser.Scene {
	constructor() {
		super({ key: "MainScene" });
		// Player
		this.foodSpeed = 50;
		this.playerSpeed = 100;

		this.timeLastFoodCatch = 20000;
		this.foodCatch = false;

		this.lastPositions = { x: 0, y: 0 };
		this.snakeBody = [];
		this.direction = "";

		this.lastTime = 100;

		// Pontuação
		localStorage.PhaserApanhaMeMaiorPontuacao = localStorage.PhaserApanhaMeMaiorPontuacao || 0;
		this.pontos = 0;
	}

	preload() {
		this.load.image("Head", Assets.Sprites.Quadrados.AzulClaro);
		this.load.image("Block", Assets.Sprites.Quadrados.Vermelho);
		this.load.image("Food", Assets.Sprites.Quadrados.Verde);
	}

	create() {
		this.player = this.physics.add.sprite(world.width / 2, world.height / 2, "Head");
		this.player.setCollideWorldBounds(true);

		this.createFood();

		this.physicsBlocks = this.physics.add.staticGroup();

		this.labelPontos = this.add.text(100, 20, `${this.pontos} / ${localStorage.PhaserApanhaMeMaiorPontuacao}`);

		this.physics.add.overlap(this.player, this.food, this.eatFood, null, this);
		this.physics.add.collider(this.food, this.physicsBlocks);
		this.physics.add.collider(this.player, this.physicsBlocks, this.death, null, this);

		this.setCursors();
	}

	createFood() {
		this.foodCatch = true;
		this.food = this.physics.add.sprite(world.width / 2, world.height / 2, "Food");
		this.repositionFood();
		this.food.setScale(0.75);
		this.food.setCollideWorldBounds(true);
		this.food.setBounce(1);
	}

	repositionFood() {
		const speedBase = this.foodSpeed;
		const speedX = randomNumber(-speedBase, speedBase);
		const speedY = randomNumber(-speedBase, speedBase);
		this.food.setVelocity(speedX, speedY);

		this.food.setPosition(randomNumber(0, world.width), randomNumber(0, world.height));
	}

	eatFood(p, f) {
		this.foodCatch = true;
		this.foodSpeed += 5;
		this.playerSpeed += 5;
		this.repositionFood();
		const playerX = this.player.x;
		const playerY = this.player.y;

		this.updatePontos();


		setTimeout(() => {
			const newBlock = this.physicsBlocks.create(playerX, playerY, "Block").setScale(0.1).refreshBody();
			newBlock.bId = this.pontos;

			const time = 2000;
			this.tweens.add({
				targets: newBlock,
				duration: time,
				repeat: randomNumber(-1, 2),
				scale: { from: 0.1, to: 1 },
				delay: 200,
				yoyo: true,
				onUpdate: () => newBlock.refreshBody(),
				onComplete: () => {
					this.tweens.add({
						targets: newBlock,
						duration: time,
						scale: { from: 0.1, to: 1 },
						onUpdate: () => newBlock.refreshBody(),
					});
				}
			});
		}, 250);
	}

	updatePontos() {
		this.pontos++;
		if (this.pontos >= localStorage.PhaserApanhaMeMaiorPontuacao) {
			localStorage.PhaserApanhaMeMaiorPontuacao = this.pontos;
		}
	}

	death(p, b) {
		if (this.pontos !== b.bId) this.physics.pause();
	}

	setCursors() {
		this.cursors = this.input.keyboard.createCursorKeys();
		this.KeyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.KeyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.KeyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.KeyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	}

	update(time) {
		this.labelPontos.setText(`${this.pontos} / ${localStorage.PhaserApanhaMeMaiorPontuacao}`);
		this.labelPontos.x = (world.width - this.labelPontos.width) / 2;

		FPSsDiv.innerHTML = Number(this.game.loop.actualFps).toFixed(1);

		if (this.cursors.up.isDown || this.KeyW.isDown) this.direction = "u";
		else if (this.cursors.right.isDown || this.KeyD.isDown) this.direction = "r";
		else if (this.cursors.down.isDown || this.KeyS.isDown) this.direction = "d";
		else if (this.cursors.left.isDown || this.KeyA.isDown) this.direction = "l";

		if (this.direction === "u") this.player.setVelocity(0, -this.playerSpeed);
		else if (this.direction === "r") this.player.setVelocity(this.playerSpeed, 0);
		else if (this.direction === "d") this.player.setVelocity(0, this.playerSpeed);
		else if (this.direction === "l") this.player.setVelocity(-this.playerSpeed, 0);

		if (this.timeLastFoodCatch < time || this.foodCatch) {
			this.repositionFood();
			this.timeLastFoodCatch = time + 20000;
			this.foodCatch = false;
		}
	}
}

const config = {
	type: Phaser.AUTO,
	width: world.width,
	height: world.height,
	background: "#bfcc00",
	physics: {
		default: "arcade",
		arcade: {
			// debug: true,
		}
	},
	scene: [Play]
}

const game = new Phaser.Game(config);
