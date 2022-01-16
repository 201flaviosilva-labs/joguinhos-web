document.addEventListener("DOMContentLoaded", () => {
	const squares = document.querySelectorAll(".grid div");
	const resultDisplay = document.querySelector("#Score");
	let width = 15;
	let currentShooterIndex = 202;
	let currentInvaderIndex = 0;
	let alienInvadersTakenDown = [];
	let result = 0;
	let direction = 1;
	let invaderId;

	// Invasores
	const alienInvaders = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
		15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
		30, 31, 32, 33, 34, 35, 36, 37, 38, 39];
	alienInvaders.forEach(i => squares[currentInvaderIndex + i].classList.add("invader"));

	// User
	squares[currentShooterIndex].classList.add("shooter");

	// Mover Jogador
	function moveShooter(e) {
		squares[currentShooterIndex].classList.remove("shooter");
		switch (e.keyCode) {
			case 37:
				if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
				break;
			case 39:
				if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
				break;
		}
		squares[currentShooterIndex].classList.add("shooter");
	}
	document.addEventListener("keydown", moveShooter);

	// Mover Invasores
	function moveInvaders() {
		const leftEdge = alienInvaders[0] % width === 0;
		const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

		if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) direction = width;
		else if (direction === width) {
			if (leftEdge) direction = 1;
			else direction = -1;
		}
		for (let i = 0; i < alienInvaders.length; i++) squares[alienInvaders[i]].classList.remove("invader");
		for (let i = 0; i < alienInvaders.length; i++) alienInvaders[i] += direction;
		for (let i = 0; i < alienInvaders.length; i++) {
			if (!alienInvadersTakenDown.includes(i)) squares[alienInvaders[i]].classList.add("invader");
		}

		// Fim do Jogo
		if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
			resultDisplay.textContent = "Jogo Acabou";
			squares[currentShooterIndex].classList.add("boom");
			clearInterval(invaderId);
		}
		for (let i = 0; i < alienInvaders.length; i++) {
			if (alienInvaders[i] > (squares.length - (width - 1))) {
				resultDisplay.textContent = "Jogo Acabou";
				clearInterval(invaderId);
			}
		}


		// Vencer
		if (alienInvadersTakenDown.length === alienInvaders.length) {
			resultDisplay.textContent = "Venceste!! :)";
			clearInterval(invaderId);

		}
	}
	invaderId = setInterval(moveInvaders, 500);

	// Disparo
	function shoot(e) {
		let laserId;
		let currentLaserIndex = currentShooterIndex;

		// Mover Laser
		function moverLaser() {
			squares[currentLaserIndex].classList.remove("laser");
			currentLaserIndex -= width;
			squares[currentLaserIndex].classList.add("laser");

			// Caso bata no invasor
			if (squares[currentLaserIndex].classList.contains("invader")) {
				squares[currentLaserIndex].classList.remove("laser");
				squares[currentLaserIndex].classList.remove("invader");
				squares[currentLaserIndex].classList.add("boom");

				setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 250);
				clearInterval(laserId);

				const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
				alienInvadersTakenDown.push(alienTakenDown);
				result++;
				resultDisplay.textContent = result;
			}

			// caso bata no teto
			if (currentLaserIndex < width) {
				clearInterval(laserId);
				setTimeout(() => squares[currentLaserIndex].classList.remove("laser"), 100);
			}
		}
		// document.addEventListener("keyup", e => { if (e.keyCode === 32) laserId = setInterval(moverLaser, 100); });

		switch (e.keyCode) {
			case 32:
				laserId = setInterval(moverLaser, 100);
				break;
		}
	}
	document.addEventListener("keyup", shoot);
});