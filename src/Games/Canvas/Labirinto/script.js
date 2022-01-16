const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const tilleSize = 20;
const maxX = parseInt(canvasWidth / tilleSize) - 1;
const maxY = parseInt(canvasHeight / tilleSize) - 1;

let map = [];
let dificulade = 0.9;
let tempo = 0;

let velocidade = tilleSize;

let jogadorX = 0;
let jogadorY = 0;

let podeMexer = true;

let jogoPossivel = false;

window.onload = () => defenirDificuldade(localStorage.canvasLabirintoDificuldade);
function defenirDificuldade(valor) {
	if (!podeMexer || valor != localStorage.canvasLabirintoDificuldade) location.reload();
	if (valor == "Dificil") {
		dificulade = 0.65;
		localStorage.canvasLabirintoDificuldade = "Dificil";
	}
	else if (valor == "Medio") {
		dificulade = 0.75;
		localStorage.canvasLabirintoDificuldade = "Medio";
	}
	else {
		dificulade = 0.9;
		localStorage.canvasLabirintoDificuldade = "";
	}

	for (let x = 0; x <= maxX; x++) {
		map[x] = [];
		for (let y = 0; y <= maxY; y++) {
			map[x][y] = Math.random() > dificulade ? 0 : 1;
		}
	}
	map[0][0] = 1;
	map[maxX][maxY] = 2;
	floodFill(0, 0);

	for (let x = 0; x <= maxX; x++) {
		for (let y = 0; y <= maxY; y++) {
			if (map[x][y] == 3) map[x][y] = 1;
		}
	}

	if (!jogoPossivel) location.reload();

	podeMexer = true;
	jogadorX = 0;
	jogadorY = 0;
	tempo = 0;
	desenhar();
}

function floodFill(x, y) {
	if (x < 0 || x > maxX ||
		y < 0 || y > maxY ||
		map[x][y] == 3 ||
		map[x][y] == 0) return;

	if (map[x][y] == 2) {
		jogoPossivel = true;
		return;
	}
	map[x][y] = 3;

	floodFill(x + 1, y);
	floodFill(x - 1, y);
	floodFill(x, y + 1);
	floodFill(x, y - 1);
}




// --------------------------------------------------------
document.addEventListener("keydown", (e) => { if (podeMexer) moverJogador(e) });
function moverJogador(e) {
	const keyCode = e.keyCode;
	if (keyCode === 37 && jogadorX >= tilleSize) jogadorX -= velocidade;
	if (keyCode === 39 && jogadorX <= canvasWidth - tilleSize - velocidade) jogadorX += velocidade;
	if (keyCode === 38 && jogadorY >= tilleSize) jogadorY -= velocidade;
	if (keyCode === 40 && jogadorY <= canvasHeight - tilleSize - velocidade) jogadorY += velocidade;

	for (let x = 0; x < map.length; x++) {
		for (let y = 0; y < map[x].length; y++) {
			if (x * tilleSize == jogadorX && y * tilleSize == jogadorY && map[x][y] == 0) {
				jogadorX = 0;
				jogadorY = 0;
			}
			if (x * tilleSize == jogadorX && y * tilleSize == jogadorY && map[x][y] == 2) {
				alert("Vitória");
				podeMexer = false;
				clearTimeout(intevalo);
			}
		}
	}
	desenhar();
}

function desenhar() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	for (let x = 0; x < map.length; x++) { // Horozontais
		for (let y = 0; y < map[x].length; y++) { // Verticais
			ctx.strokeStyle = "rgb(255, 255, 255, 0.5)";
			ctx.strokeRect(x * tilleSize, y * tilleSize, tilleSize, tilleSize);
			ctx.fillStyle = "black";
			if (map[x][y] == 0) ctx.fillStyle = "red"; // Parede
			if (map[x][y] == 1) ctx.fillStyle = "blue"; // Campo
			if (map[x][y] == 2) ctx.fillStyle = "green"; // Comida
			if (map[x][y] == 3) ctx.fillStyle = "pink"; // AI Caminho
			if (x * tilleSize == jogadorX && y * tilleSize == jogadorY) ctx.fillStyle = "yellow"; // Jogador
			ctx.fillRect(x * tilleSize, y * tilleSize, tilleSize, tilleSize);
		}
	}
}

let intevalo = setInterval(() => {
	tempo++;
	document.getElementById("Tempo").innerHTML = tempo;
}, 1);
