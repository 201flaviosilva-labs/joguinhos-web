import Assets from "../../../Assets.js";;
import Bala from "./Bala.js";
import Asteroid from "./Asteroid.js";

const FPSsDiv = document.getElementById("FPSs");

const mundo = {
	w: 800,
	h: 800
};

class MainScene {
	preload() {
		this.load.image("Asteroid1", Assets.Sprites.Bola.Verde);
		this.load.image("Asteroid2", Assets.Sprites.Bola.Azul);
		this.load.image("Asteroid3", Assets.Sprites.Bola.Vermelha);

		this.load.image("Fire", Assets.Sprites.Bola.Branca);

		this.load.image("Nave", Assets.Sprites.Ship.Space._6Dir);
	}

	create() {
		this.setVariables();

		this.player = this.physics.add.sprite(mundo.w / 2, mundo.h / 2, "Nave");
		this.player.displayWidth = 64;
		this.player.displayHeight = 64;
		this.player.setMaxVelocity(500);

		// Bullet
		this.bulletsGroup = this.physics.add.group({
			classType: Bala,
			maxSize: 10, // Maximo de bullets
			runChildUpdate: true
		});

		this.asteroidsGroup = this.physics.add.group({
			classType: Asteroid,
			maxSize: 25, // Maximo de bullets
			runChildUpdate: true
		});

		this.physics.add.overlap(this.player, this.asteroidsGroup, this.colisaoPlayerAsteroid, null, this); // Colision
		this.physics.add.overlap(this.bulletsGroup, this.asteroidsGroup, this.colisaoBalaAsteroid, null, this); // Colision
	}

	setVariables() {
		this.player = null;
		this.bullets = [];
		this.asteroids = [];
		this.ultimoAsteroidCriado = 0;
		this.lastFired = 0;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.jogoPaudo = false;
	}

	colisaoPlayerAsteroid() {
		this.jogoPaudo = true;
		this.physics.pause();
	}

	colisaoBalaAsteroid(b, a) {
		b.destroy();
		a.destroy();
	}

	update(time) {
		FPSsDiv.innerHTML = Number(game.loop.actualFps).toFixed(1);

		if (this.jogoPaudo) return;

		if (this.cursors.up.isDown) this.physics.velocityFromRotation(this.player.rotation, 200, this.player.body.acceleration);
		else this.player.setAcceleration(0);

		if (this.cursors.left.isDown) this.player.setAngularVelocity(-300);
		else if (this.cursors.right.isDown) this.player.setAngularVelocity(300);
		else this.player.setAngularVelocity(0);

		if (this.cursors.space.isDown && this.lastFired < time) {
			const bullet = this.bulletsGroup.get();
			if (bullet) {
				bullet.fire(this.player.x, this.player.y, this.player.rotation);
				this.lastFired = time + 100;
				this.bullets.push(bullet);
			}
		}

		if (this.ultimoAsteroidCriado < time) {
			const aste = this.asteroidsGroup.get();
			if (aste) {
				aste.criar();
				this.ultimoAsteroidCriado = time + 2000;
				this.asteroids.push(aste);
			}
		}

		// Border Colision
		this.checkBordersColision(this.player);
		this.bullets.forEach((bullet, index) => {
			this.checkBordersColision(bullet); // Check se está ativo
			if (bullet.active) this.bullets.slice(index, 1);
		});
		this.asteroids.map(asteroid => {
			this.checkBordersColision(asteroid);
		});
	}

	checkBordersColision(obj) {
		if (obj.x > mundo.w) obj.x = 0;
		if (obj.x < 0) obj.x = mundo.w;

		if (obj.y > mundo.h) obj.y = 0;
		if (obj.y < 0) obj.y = mundo.h;
	}
}

const config = {
	type: Phaser.AUTO,
	width: mundo.w,
	height: mundo.h,
	background: "#fff",
	physics: {
		default: "arcade",
		arcade: {
			debug: false
		}
	},
	scene: [MainScene]
}

const game = new Phaser.Game(config);
