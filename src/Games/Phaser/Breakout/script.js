import Assets from "../../../Assets.js";;
import { randomNumber } from "../../../Scripts/util.js";

const FPSsDiv = document.getElementById("FPSs");
const world = {
	width: 500,
	height: 500,
};
const config = {
	type: Phaser.AUTO,
	width: world.width,
	height: world.height,
	backgroundColor: "#000",
	scale: {
		mode: Phaser.Scale.FIT,
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};
const game = new Phaser.Game(config);

let bricks = null;

function preload() {
	this.paused = false;
	const balls = Object.keys(Assets.Sprites.Bola);
	const randomBall = Assets.Sprites.Bola[balls[[randomNumber(0, balls.length - 1)]]];
	this.load.image("Bola", randomBall);
	this.load.image("Paddle", Assets.Sprites.Paddle.Horizontal);

	bricks = Object.keys(Assets.Sprites.Quadrados);
	this.load.image(bricks[0], Assets.Sprites.Quadrados.Amarelo);
	this.load.image(bricks[1], Assets.Sprites.Quadrados.Azul);
	this.load.image(bricks[2], Assets.Sprites.Quadrados.AzulClaro);
	this.load.image(bricks[3], Assets.Sprites.Quadrados.Branco);
	this.load.image(bricks[4], Assets.Sprites.Quadrados.Cinzento);
	this.load.image(bricks[5], Assets.Sprites.Quadrados.Preto);
	this.load.image(bricks[6], Assets.Sprites.Quadrados.Rosa);
	this.load.image(bricks[7], Assets.Sprites.Quadrados.Verde);
	this.load.image(bricks[8], Assets.Sprites.Quadrados.Vermelho);
}

function create() {
	this.finishGame = false;

	this.ball = this.physics.add.sprite(world.width * 0.5, world.height - 25, "Bola");
	this.ball.setCollideWorldBounds(true);
	this.ball.setVelocity(150, -150);
	this.ball.setBounce(1);

	this.paddle = this.physics.add.image(world.width * 0.5, world.height, "Paddle");
	this.physics.add.collider(this.ball, this.paddle);
	this.paddle.setCollideWorldBounds(true);
	this.paddle.setImmovable(true);

	this.physics.world.setBoundsCollision(true, true, true, false);
	const def = {
		largura: 50,
		altura: 20,
		margin: 5,
		num: {
			linhas: 3,
			colunas: 7
		},
		offset: {
			top: 50,
			left: 60
		},
		padding: 10
	};

	this.bricksGroup = this.physics.add.staticGroup();

	for (let c = 0; c < def.num.colunas; c++) {
		for (let r = 0; r < def.num.linhas; r++) {
			const randomTexture = bricks[randomNumber(0, bricks.length - 1)];
			const x = c * (def.largura + def.padding) + def.offset.left + def.margin * c;
			const y = r * (def.altura + def.padding) + def.offset.top;
			const newBrick = this.physics.add.image(x, y, randomTexture);
			newBrick.setScale(1.75, 0.75);
			newBrick.body.immovable = true;
			this.ball.setBounce(1);
			this.physics.add.collider(this.ball, newBrick, () => newBrick.destroy());
			this.bricksGroup.add(newBrick);
		}
	}

	const style = { fontSize: '16px', fill: '#f00', fontFamily: "'Press Start 2P'" };
	this.txtEnd = this.add.text(world.width / 2, world.height / 2, "Clica Espaço para Recomeçar", style).setOrigin(0.5).setVisible(false);

	this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
	FPSsDiv.innerHTML = Number(game.loop.actualFps).toFixed(1);

	if (this.cursors.space.isDown) this.scene.restart();

	if (this.finishGame) {
		this.txtEnd.setVisible(true);
		return;
	}

	this.paddle.x = this.input.x || world.width * 0.5;

	if (this.ball.y > world.height) {
		this.finishGame = true;
		this.physics.pause(); // Pausa a fisica
	}
}
