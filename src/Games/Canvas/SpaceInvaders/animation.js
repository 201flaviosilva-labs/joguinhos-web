// Canvas
const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");
const invasorCtx = canvas.getContext("2d");
const jogador = canvas.getContext("2d");
const tiro = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let pontos = 0;

// Jogador
const jogadorWidth = 10;
const jogadorHeight = 10;
let jogadorX = canvasWidth / 2 + jogadorWidth / 2;
let jogadorY = canvasHeight - jogadorHeight;
const jogadorVelocidade = 5;

// Tiro
const tiroWidth = 5;
const tiroHeight = 5;
let tiroX = jogadorX + tiroWidth / 2;
let tiroY = jogadorY;
const tiroVelocidade = 10;
let tiroVisivel = false;

// Invasor
let invasorDiametro = 20;
let invasorX = canvasWidth / 2;
let invasorY = 50;
let invasorXMover = 1;

// Volta a apresentar os objetos do jogo
// Move o tiro se for visivel
let interval = setInterval(() => {
	if (tiroVisivel) {
		tiroY -= tiroVelocidade;
		if (tiroY < 0) {
			tiroVisivel = false;
			tiroY = jogadorY;
		}
	}
	desenhar();
}, 1000 / 60); // 60 frames per second (fps)

// Desenha os objetos do jogo
function desenhar() {
	// Limpar Mapa
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	// Invasor
	invasorLogica();

	// Jogador
	jogador.fillStyle = "blue";
	jogador.fillRect(jogadorX, jogadorY, jogadorWidth, jogadorHeight);

	// Tiro
	if (tiroVisivel) {
		tiro.fillStyle = "#00ff11";
		tiro.fillRect(tiroX, tiroY, tiroWidth, tiroHeight);
	} else tiroX = jogadorX + tiroWidth / 2;
	inavasorColisao();

	// Pontos
	ctx.fillStyle = "rgb(255, 255, 0, 0.5)";
	ctx.textAlign = "center";
	ctx.font = "30px Comic Sans MS";
	ctx.fillText(`Pontos: ${pontos}`, canvasWidth / 2, canvasHeight / 2);
}

// Desenha o invasor
// Mover o invasor
function invasorLogica() {
	invasorCtx.fillStyle = "red";
	invasorCtx.beginPath();
	invasorCtx.arc(invasorX + invasorDiametro / 2, invasorY, invasorDiametro / 2, 0, 2 * Math.PI);
	invasorCtx.fill();
	invasorCtx.closePath();

	invasorX += invasorXMover;
	if (invasorX >= canvasWidth - invasorDiametro) invasorXMover = -invasorXMover;
	if (invasorX < 0) invasorXMover = -invasorXMover;
}

// Mover Jogador
document.addEventListener("keydown", (e) => moverJogador(e));
function moverJogador(e) {
	const keyCode = e.keyCode;
	if ((keyCode === 37
		|| keyCode === 65)
		&& jogadorX >= jogadorWidth) jogadorX -= jogadorVelocidade;
	if ((keyCode === 39
		|| keyCode === 68)
		&& jogadorX <= canvasWidth - jogadorWidth - jogadorVelocidade) jogadorX += jogadorVelocidade;
	if (keyCode === 16 || keyCode === 32 || keyCode === 38 || keyCode === 87) tiroVisivel = true;
	desenhar();
}

// Deteta se o invasor colidio com o tiro
function inavasorColisao() {
	if (tiroX > invasorX && tiroX < invasorX + invasorDiametro &&
		tiroY > invasorY && tiroY < invasorY + invasorDiametro) pontos++;
}
