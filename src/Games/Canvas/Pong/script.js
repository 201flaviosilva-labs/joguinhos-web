const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");;
const fps = 30;
let pausa; // setInterval

// Ball
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let speedBallX = 10;
let speedBallY = 5;

// Paddle
const playerLargura = 20;
const playerAltura = 100;
let PlayersSpeed = 4.5;

// Jogador
let playerY = canvas.height / 2;
let playerPontos = 0;

// Computador
let computadorY = canvas.height / 2 - playerAltura / 2;
let computadorPontos = 0;

desenhar();
canvas.addEventListener("click", () => pausa = setInterval(moveBall, 1000 / fps));
drawTexto("Clica Para Começar", canvas.width / 2 - 180, canvas.height / 2);

// Desenhar os objetos
function desenhar() {
	drawRect(0, 0, canvas.width, canvas.height, "black"); // Fundo

	drawRect(10, playerY - 50, playerLargura, playerAltura, "white"); // Jogador
	drawRect(canvas.width - 30, computadorY, playerLargura, playerAltura, "white"); // Computador

	drawCilcle(ballX, ballY, 10, "red"); // Ball

	drawTexto(playerPontos, 100, 100) // Pontos Jogador
	drawTexto(computadorPontos, canvas.width - 150, 100) // Pontos Computador

	drawLine(canvas.width / 2 - 15, canvas.height / 2, canvas.width / 2 + 15, canvas.height / 2); // Linha Horizontal
	drawLine(canvas.width / 2, canvas.height / 2 - 15, canvas.width / 2, canvas.height / 2 + 15); // Linha Vertical
}

function drawCilcle(posX, posY, radio, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(posX, posY, radio, 0, Math.PI * 2, true);
	ctx.fill();
}

function drawRect(posX, posY, width, height, color) {
	ctx.fillStyle = color;
	ctx.fillRect(posX, posY, width, height);
}

function drawTexto(texto, posX, posY) {
	ctx.fillStyle = "White";
	ctx.font = "30px monospace";
	ctx.fillText(texto, posX, posY);
}

function drawLine(posX, posY, toX, toY) {
	ctx.beginPath();
	ctx.moveTo(posX, posY);
	ctx.lineTo(toX, toY);
	ctx.strokeStyle = "#fff"
	ctx.stroke();
}

// Mover a bola
function moveBall() {
	ballX += speedBallX;
	ballY += speedBallY;

	// Zona Computador
	if (ballX > canvas.width - 10) {
		playerPontos++;
		resetBall();
	};
	if ((ballY > computadorY)
		&& (ballY < computadorY + playerAltura)
		&& ballX > canvas.width - 51) speedBallX = -speedBallX;


	// Zona Jogador
	if (ballX < 0) {
		computadorPontos++;
		resetBall();
	};
	if ((ballY > playerY - playerAltura / 2)
		&& (ballY < playerY + playerAltura / 2)
		&& (ballX - 20 < playerLargura + 11)) speedBallX = -speedBallX;


	if ((ballY > canvas.height - 10) || (ballY < 0)) speedBallY = -speedBallY;

	desenhar();
	moverComputador();
}

function resetBall() {
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	Math.random() >= 0.5 ? speedBallY = - 5 : speedBallY = 5;
	Math.random() >= 0.5 ? speedBallX = - 10 : speedBallX = 10;
	clearInterval(pausa);
}

// Mover o Jogador
canvas.addEventListener("mousemove", (evt) => {
	const pos = getMousePos(evt);
	playerY = pos.y;
});

function getMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

// Mover o Computador
function moverComputador() {
	const computadorYCentral = computadorY + playerAltura / 2;
	if (computadorYCentral < ballY) computadorY += PlayersSpeed;
	if (computadorYCentral > ballY) computadorY -= PlayersSpeed;
}
