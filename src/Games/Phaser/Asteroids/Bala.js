export default class Component extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "Fire");

		this.speed = Phaser.Math.GetSpeed(400, 1);

		this.time = 0;
	}

	fire(x, y, direction) {
		this.setPosition(x, y);
		this.setActive(true);
		this.setVisible(true);

		this.direction = direction;
	}

	update(time, delta) {
		this.time++;
		this.x += Math.cos(this.direction) * this.speed * delta;
		this.y += Math.sin(this.direction) * this.speed * delta;

		if (this.time > 150) this.destroy();
	}
}
