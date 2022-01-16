import Assets from "../../../Assets.js";;

class mainScene {
	preload() {
		this.load.image("Master", Assets.Sprites.Monstro.Master);
		this.load.image("Coin", Assets.Sprites.Coin.Coin);
		this.load.image("Enemy", Assets.Sprites.Quadrados.Rosa);
	}

	create() {
		this.score = 0;
		this.arrow = this.input.keyboard.createCursorKeys();

		let style = { font: '20px Arial', fill: "#fff" };
		this.scoreText = this.add.text(20, 20, "Score: " + this.score, style);

		this.player = this.physics.add.sprite(75, 75, "Master");

		this.createEnemies();

		this.coin = this.physics.add.sprite(300, 300, "Coin");
		this.coin.setCollideWorldBounds(true);
	}

	createEnemies() {
		this.enemyHorizontal = this.physics.add.sprite(300, 300, "Enemy");
		this.enemyHorizontal.setVelocityX(100);

		this.enemyVertical = this.physics.add.sprite(300, 300, "Enemy");
		this.enemyVertical.setVelocityY(100);

		this.enemyDiagonal = this.physics.add.sprite(300, 300, "Enemy");
		this.enemyDiagonal.setVelocity(-100, -100);

		this.physics.add.overlap(this.player, this.enemyHorizontal, this.losePoints, null, this);
		this.physics.add.overlap(this.player, this.enemyVertical, this.losePoints, null, this);
		this.physics.add.overlap(this.player, this.enemyDiagonal, this.losePoints, null, this);
	}

	update() {
		if (this.arrow.right.isDown) this.player.x += 3;
		else if (this.arrow.left.isDown) this.player.x -= 3;
		else if (this.arrow.down.isDown) this.player.y += 3;
		else if (this.arrow.up.isDown) this.player.y -= 3;

		if (this.physics.overlap(this.player, this.coin)) this.getCoin();


		// Enemys
		if (this.enemyHorizontal.x >= 600) this.enemyHorizontal.setVelocityX(-100);
		if (this.enemyHorizontal.x <= 0) this.enemyHorizontal.setVelocityX(100);

		if (this.enemyVertical.y >= 600) this.enemyVertical.setVelocityY(-100);
		if (this.enemyVertical.y <= 0) this.enemyVertical.setVelocityY(100);

		// Random
		if (this.enemyDiagonal.x >= 600) this.enemyDiagonal.setVelocityX(-100);
		if (this.enemyDiagonal.x <= 0) this.enemyDiagonal.setVelocityX(100);
		if (this.enemyDiagonal.y >= 600) this.enemyDiagonal.setVelocityY(-100);
		if (this.enemyDiagonal.y <= 0) this.enemyDiagonal.setVelocityY(100);
	}

	getCoin() {
		this.coin.x = Phaser.Math.Between(this.coin.width, 600 - this.coin.width);
		this.coin.y = Phaser.Math.Between(this.coin.height, 600 - this.coin.height);

		this.coin.setRandomPosition();

		this.coin.x = Phaser.Math.Between(this.coin.width, 600 - this.coin.width);
		this.coin.y = Phaser.Math.Between(this.coin.height, 600 - this.coin.height);

		this.score++;
		this.scoreText.setText("Score: " + this.score);

		this.tweens.add({
			targets: this.player,
			duration: 500,
			scale: 1.2,
			yoyo: true,
		});
	}

	losePoints() {
		this.score = 0;
		this.scoreText.setText("Score: " + this.score);

		this.tweens.add({
			targets: this.player,
			duration: 500,
			scale: { start: 1, to: 0.5 },
			alpha: { start: 1, to: 0.5 },
			alpha: { start: 1, to: 0.5 },
			yoyo: true,
			onComplete: () => {
				this.player.setScale(1);
				this.player.setAlpha(1);
			}
		});
	}
}

new Phaser.Game({
	type: Phaser.AUTO,
	width: 600,
	height: 600,
	backgroundColor: "#3498db",
	scene: mainScene,
	physics: {
		default: "arcade",
		arcade: {
			debug: false
		}
	}
});
