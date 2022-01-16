import Assets from "../../../Assets.js";;

const FPSsDiv = document.getElementById("FPSs");

const mundo = {
	w: 800,
	h: 500
};

class Pong {
	preload() {
		this.load.image("Bola", Assets.Sprites.Bola.Branca);
		this.load.image("Padlde", Assets.Sprites.Paddle.Vertical);
	}

	create() {
		this.bola = this.physics.add.sprite(mundo.w / 2, mundo.h / 2, "Bola");
		this.bola.setCollideWorldBounds(true);
		this.setBola();
		this.bola.setBounce(1);

		// Jogador Esquerda
		this.jogadorE = this.physics.add.sprite(20, mundo.h / 2, "Padlde");
		this.physics.add.collider(this.bola, this.jogadorE);
		this.jogadorE.setScale(2);
		this.jogadorE.setCollideWorldBounds(true);
		this.jogadorE.setImmovable(true);
		this.KeyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.KeyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

		// Jogador Direita
		this.jogadorD = this.physics.add.sprite(mundo.w - 20, mundo.h / 2, "Padlde");
		this.physics.add.collider(this.bola, this.jogadorD);
		this.jogadorD.setScale(2);
		this.jogadorD.setCollideWorldBounds(true);
		this.jogadorD.setImmovable(true);
		this.cursors = this.input.keyboard.createCursorKeys();

		// Remover as lateriais
		this.physics.world.setBoundsCollision(false, false, true, true);
	}

	update() {
		FPSsDiv.innerHTML = Number(game.loop.actualFps).toFixed(1);

		// Jogador Esquerda
		if (this.KeyW.isDown) this.jogadorE.y -= 2;
		else if (this.KeyS.isDown) this.jogadorE.y += 2;

		// Jogador Direita
		if (this.cursors.up.isDown) this.jogadorD.y -= 2;
		else if (this.cursors.down.isDown) this.jogadorD.y += 2;

		if (this.bola.x > mundo.w || this.bola.x < 0) this.setBola();
	}

	setBola() {
		this.bola.setPosition(mundo.w / 2, mundo.h / 2);
		const bolaXVelo = Math.random() > 0.5 ? 200 : -200;
		const bolaYVelo = Math.random() > 0.5 ? 200 : -200;
		this.bola.setVelocity(bolaXVelo, bolaYVelo);
	}
}

const config = {
	type: Phaser.AUTO,
	width: mundo.w,
	height: mundo.h,
	background: "#000000",
	physics: {
		default: "arcade",
		arcade: {
			debug: false
		}
	},
	scene: [Pong]
};

const game = new Phaser.Game(config);
