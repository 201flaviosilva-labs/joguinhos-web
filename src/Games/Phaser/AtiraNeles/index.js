import Assets from "../../../Assets.js";;
import { randomNumber } from "../../../Scripts/util.js";

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

let points = 0;

class Shoot extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "Fire");
	}

	generate(x, y) {
		// this.setPosition(x, y);
		this.setVelocityY(-screenWorld.height);
	}

	update() {
		if (this.y < 0) this.destroy();
	}
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "Enemy");
	}

	generate() {
		const x = randomNumber(30, screenWorld.width - 30);
		this.setPosition(x, -30);
		this.setVelocityY(100);
	}

	update() {
		if (this.y > screenWorld.height + 30) {
			this.destroy();
			points--;
		}
	}
}

// Main Scene
class MainScene extends Phaser.Scene {
	constructor() {
		super({ key: "MainScene" });
	}

	init() {
		// Pontuação
		localStorage.PhaserAtiraNelesMaiorPontuacao = localStorage.PhaserAtiraNelesMaiorPontuacao || 0;
		// this.pontos = 0;

		this.shootingTime = 250;
		this.enemiesTime = 2000;
		this.numEnemiesLines = 0;

		points = 0;

		this.pause = false;
	}

	preload() {
		this.load.image("Player", Assets.Sprites.Triangulos.Green);
		this.load.image("Enemy", Assets.Sprites.Quadrados.Vermelho);
		this.load.image("Fire", Assets.Sprites.Disparo.Fire);
	}

	create() {
		const { width, height, middleWidth, middleHeight } = screenWorld;

		// Player
		this.player = this.physics.add.sprite(middleWidth, middleHeight, "Player").setCollideWorldBounds(true);
		this.input.on('pointermove', pointer => {
			if (this.pause) return;
			const { x, y } = pointer;
			this.player.setPosition(x, y);
		});

		// Shoots
		this.shootsGroup = this.physics.add.group({
			classType: Shoot,
			runChildUpdate: true,
		});
		this.timerShoot = this.time.addEvent({ delay: this.shootingTime, callback: this.createShoot, callbackScope: this, loop: true });

		// Enemies
		this.enemiesGroup = this.physics.add.group({
			classType: Enemy,
			runChildUpdate: true,
		});
		this.timerEnemies = this.time.addEvent({ delay: this.enemiesTime, callback: this.createEnemies, callbackScope: this, loop: true });

		// Collisions
		this.physics.add.overlap(this.shootsGroup, this.enemiesGroup, this.collisionShootEnemy, null, this);
		this.physics.add.overlap(this.player, this.enemiesGroup, this.stopGame, null, this);

		// Points
		this.labelPontos = this.add.text(middleWidth, height - 30, `${points} / ${localStorage.PhaserAtiraNelesMaiorPontuacao}`, textStyle).setOrigin(0.5);

		// Reset
		this.input.on("pointerup", () => this.scene.restart());
		this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).on("down", () => this.scene.restart());
	}

	createShoot() {
		const { x, y } = this.player;
		const shoot = this.shootsGroup.get(x, y);
		if (shoot) shoot.generate(x, y);
	}

	createEnemies() {
		this.numEnemiesLines++;
		for (let i = 0; i < this.numEnemiesLines; i++) {
			const enemy = this.enemiesGroup.get();
			if (enemy) enemy.generate();
		}
	}

	collisionShootEnemy(s, e) {
		s.destroy();
		e.destroy();

		this.addPoints();
	}

	addPoints() {
		points++;
		// this.updatePoints();
	}

	// removePoints() {
	// 	points--;
	// 	this.updatePoints();
	// }

	stopGame() {
		this.physics.pause();
		this.timerShoot.paused = true;
		this.timerEnemies.paused = true;
		this.pause = true;

		const { middleWidth, middleHeight } = screenWorld;
		const lose = this.add.text(middleWidth, middleHeight, "Perdeste", { ...textStyle, fontSize: 30 }).setOrigin(0.5);
		const resetText = this.add.text(middleWidth, middleHeight + lose.height,
			"Clica para recomeçar",
			{ ...textStyle, fontSize: 10 }).setOrigin(0.5, 1);
	}

	update() {
		if (this.pause) return;

		FPSsDiv.innerHTML = Number(this.game.loop.actualFps).toFixed(1);

		this.updatePoints();
	}

	updatePoints() {
		if (points >= localStorage.PhaserAtiraNelesMaiorPontuacao) {
			localStorage.PhaserAtiraNelesMaiorPontuacao = points;
		}

		this.labelPontos.setText(`${points} / ${localStorage.PhaserAtiraNelesMaiorPontuacao}`);
	}
}

const config = {
	type: Phaser.AUTO,
	width: screenWorld.width,
	height: screenWorld.height,
	background: "#000",
	scale: {
		mode: Phaser.Scale.FIT,
	},
	physics: {
		default: "arcade",
		arcade: {
			// debug: true,
		}
	},
	scene: [MainScene]
}

const game = new Phaser.Game(config);
