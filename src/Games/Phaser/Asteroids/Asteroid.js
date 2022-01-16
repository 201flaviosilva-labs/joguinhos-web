export default class Asteroid extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "Asteroid1");
		this.speed = Phaser.Math.GetSpeed(400, 1);
	}

	criar() {
		this.setActive(true);
		this.setVisible(true);

		this.setVelocity(randomNumber(-150, 150), randomNumber(-150, 150));

		const originX = randomNumber(0, 800);
		const originY = randomNumber(0, 800);
		this.setPosition(originX, originY);
	}
}

function randomNumber(min, max) { return Phaser.Math.RND.between(min, max) }


// antigo código
class Antigo {
	createAsteroid(vida = 3, x, y) {
		const configAst = {
			vel: 150,
			tam: 64,
			x: x,
			y: y,
			vida: vida,
			img: ["Asteroid1", "Asteroid2", "Asteroid3"]
		};

		if (configAst.vida == 0) return;
		if (configAst.vida == 3) configAst.tam = 64;
		if (configAst.vida == 2) configAst.tam = 32;
		if (configAst.vida == 1) configAst.tam = 16;

		if (x == undefined) configAst.x = randomNumber(0, mundo.w);
		if (y == undefined) configAst.y = randomNumber(0, mundo.h);

		let asteroid = this.physics.add.sprite(configAst.x, configAst.w, configAst.img[vida - 1]);
		asteroid.setVelocity(randomNumber(-configAst.vel, configAst.vel), randomNumber(-configAst.vel, configAst.vel));
		asteroid.displayWidth = configAst.tam;
		asteroid.displayHeight = configAst.tam;
		// asteroid.setBounce(1);
		asteroid.vida = configAst.vida;
		this.physics.add.collider(this.player, asteroid, () => this.morte(asteroid));
		this.asteroids.push(asteroid);
	}

	morte(asteroid) {
		this.player.setPosition(mundo.w / 2, mundo.h / 2);
		this.createAsteroid(asteroid.vida - 1, asteroid.x, asteroid.y);
		this.createAsteroid(asteroid.vida - 1);
		asteroid.destroy();
	}
}
