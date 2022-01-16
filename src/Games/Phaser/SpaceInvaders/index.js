import Assets from "../../../Assets.js";;
import { randomNumber } from "../../../Scripts/util.js";

const FPSsDiv = document.getElementById("FPSs");

const textStyle = { fontSize: 15, fill: "#fff", fontFamily: "'Press Start 2P'" };

const screenWorld = {
	width: 800,
	height: 450,
	middleWidth: 0,
	middleHeight: 0,
};

let isDrop = false;

screenWorld.middleWidth = screenWorld.width / 2;
screenWorld.middleHeight = screenWorld.height / 2;

class Shoot extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "Fire");
	}

	generate(x, y) {
		this.setPosition(x, y);
		this.setVelocityY(-screenWorld.height);
	}

	update() {
		if (this.y < 0) this.destroy();
	}
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "Enemy");
		this.speed = 50;
	}

	generate(x, y) {
		this.setPosition(x, y);
		this.setVelocityX(50);
		this.setCircle(this.width / 2);
	}

	changeDirection() {
		this.speed = -this.speed;
		this.setVelocityX(this.speed);

		this.y += 20;
	}
}

// Main Scene
class MainScene extends Phaser.Scene {
	constructor() {
		super({ key: "MainScene" });
	}

	init() {
		// Pontuação
		this.score = 0;

		this.speedEnemies = 50;

		this.isPause = false;
		this.isGameOver = false;
	}

	preload() {
		this.load.image("Player", Assets.Sprites.Triangulos.Green);
		this.load.image("Enemy", Assets.Sprites.Bola.Vermelha);
		this.load.image("Fire", Assets.Sprites.Disparo.Fire);
	}

	create() {
		this.input.keyboard.removeAllKeys(true);

		const { width, height, middleWidth, middleHeight } = screenWorld;

		// Player
		this.player = this.physics.add.sprite(middleWidth, height - 30, "Player").setCollideWorldBounds(true);
		this.keys = this.input.keyboard.createCursorKeys();

		// Shoots
		this.shootsGroup = this.physics.add.group({
			classType: Shoot,
			runChildUpdate: true,
		});

		// Enemies
		this.enemiesGroup = this.physics.add.group({
			classType: Enemy,
			collideWorldBounds: true,
			runChildUpdate: true,
		});

		// Collisions
		this.physics.add.overlap(this.shootsGroup, this.enemiesGroup, this.collisionShootEnemy, null, this);
		this.physics.add.overlap(this.player, this.enemiesGroup, this.stopGame, null, this);

		// Points / Status
		this.labelPontos = this.add.text(width - 25, 20, this.score, textStyle).setOrigin(0.5).setFontSize(20);
		this.statusLabel = this.add.text(middleWidth, middleHeight, "Pausa", textStyle).setOrigin(0.5).setFontSize(30).setVisible(false);

		// Reset
		this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).on("down", () => this.scene.restart(), this);
		this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).on("down", this.pauseGame, this);

		this.createEnemies();
	}

	createShoot() {
		const { x, y } = this.player;
		const shoot = this.shootsGroup.get(x, y);
		if (shoot) shoot.generate(x, y);
	}

	createEnemies() {
		const linhas = 12;
		const colunas = 3;

		for (let i = 0; i < linhas; i++) {
			for (let j = 0; j < colunas; j++) {
				const enemy = this.enemiesGroup.get();
				if (enemy) enemy.generate((i + 1) * 50, (j + 1) * 50);
			}
		}
	}

	collisionShootEnemy(s, e) {
		s.destroy();
		e.destroy();

		this.addPoints();
	}

	addPoints() {
		this.score++;
		this.labelPontos.setText(this.score);

		if (this.score == 36) {
			console.log("Beep");
			this.stopGame();
			this.statusLabel.setText("Ok Venceste :)").setVisible(true);
		}
	}

	pauseGame() {
		if (!this.isGameOver) return;

		this.isPause = !this.isPause;
		console.log("Pausa");

		if (this.isPause) {
			this.physics.pause();
			this.statusLabel.setVisible(true);
		} else {
			this.statusLabel.setVisible(false);
			this.physics.resume();
		}
	}

	stopGame() {
		this.pauseGame();
		this.isGameOver = true;
		this.statusLabel.setText("Perdeste");

		const { middleWidth, middleHeight } = screenWorld;
		const resetText = this.add.text(middleWidth, middleHeight + this.statusLabel.height, "Clica R para recomeçar", textStyle).setOrigin(0.5, 1).setFontSize(10);
	}

	update() {
		if (this.isPause) return;

		FPSsDiv.innerHTML = Number(this.game.loop.actualFps).toFixed(1);

		this.enemiesGroup.getChildren().forEach(e => {
			if (e.y > screenWorld.height) this.stopGame();
			if (isDrop) return;
			if ((e.x <= 20 || e.x >= screenWorld.width - 20) && !isDrop) {
				isDrop = true;
				this.enemiesGroup.getChildren().forEach(enemy => enemy.changeDirection());
				setTimeout(() => isDrop = false, 1000);
			}
		});

		if (this.keys.space.isDown) this.createShoot();

		if (this.keys.left.isDown) this.player.setVelocityX(-100);
		else if (this.keys.right.isDown) this.player.setVelocityX(100);
		else this.player.setVelocityX(0);
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
