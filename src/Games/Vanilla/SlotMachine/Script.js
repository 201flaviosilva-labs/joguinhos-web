import Assets from "../../../Assets.js";;

const l00 = document.getElementById("l00");
const l01 = document.getElementById("l01");
const l02 = document.getElementById("l02");

const l10 = document.getElementById("l10");
const l11 = document.getElementById("l11");
const l12 = document.getElementById("l12");

const l20 = document.getElementById("l20");
const l21 = document.getElementById("l21");
const l22 = document.getElementById("l22");

const Buttao = document.getElementById("Buttao");

const WinDiv = document.getElementById("WinDiv");

let autoPlay = false;
document.getElementById("AutoPlay").addEventListener("click", () => {
	autoPlay = !autoPlay;
	document.getElementById("autoPlayStatus").innerHTML = autoPlay;
});

const randomNumber = (min = 0, max = 250) => Math.floor(Math.random() * (max - min + 1) + min);
const symblos = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

let gameOn = true;

const data = {
	index: [],
	spin: [],
	maxSpin: [],
	actualSpin: [],
}

const BoardDom = [
	[l00, l01, l02],
	[l10, l11, l12],
	[l20, l21, l22]
];
const Board = [[], [], []];
let x = 0;
for (let i = 0; i < 3; i++) {
	for (let j = 0; j < 3; j++) {
		Board[i][j] = symblos[x];
		data.index[i] = x;
		x++;
	}
}
updateDom();

Buttao.addEventListener("click", () => {
	GerarJogo();
});

function GerarJogo() {
	Buttao.disabled = true;
	WinDiv.style.visibility = "hidden";
	gameOn = false;
	for (let i = 0; i < Board.length; i++) {
		data.maxSpin[i] = randomNumber(10, 40);
		data.actualSpin[i] = 0;
		startSpin(i);
	}
}

function startSpin(coluna) {
	data.spin[coluna] = setInterval(() => {
		data.actualSpin[coluna]++;
		data.index[coluna]++;

		if (data.index[coluna] > symblos.length - 1) data.index[coluna] = 0;

		Board[coluna][0] = Board[coluna][1];
		Board[coluna][1] = Board[coluna][2];
		Board[coluna][2] = symblos[data.index[coluna]];

		updateDom()

		if (data.maxSpin[coluna] <= data.actualSpin[coluna]) stopSpin(coluna, Board[coluna][1]);
	}, randomNumber(100));
};

function updateDom() {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const img = tradutorImage(Board[i][j]);
			BoardDom[i][j].src = img;
		}
	}
}

function tradutorImage(letra) {
	switch (letra) {
		case "A":
			return Assets.Sprites.Quadrados.Amarelo;
			break;
		case "B":
			return Assets.Sprites.Quadrados.Azul;
			break;
		case "C":
			return Assets.Sprites.Quadrados.AzulClaro;
			break;
		case "D":
			return Assets.Sprites.Quadrados.Branco;
			break;
		case "E":
			return Assets.Sprites.Quadrados.Cinzento;
			break;
		case "F":
			return Assets.Sprites.Quadrados.Preto;
			break;
		case "G":
			return Assets.Sprites.Quadrados.Rosa;
			break;
		case "H":
			return Assets.Sprites.Quadrados.Verde;
			break;
		case "I":
			return Assets.Sprites.Quadrados.Vermelho;
			break;
		default:
			return Assets.Sprites.Bola.Vermelha;
			break;
	}
}

function stopSpin(coluna, state) {
	clearInterval(data.spin[coluna]);
	data.spin[coluna] = null;

	const allStop = data.spin.filter(a => a !== null);

	if (!allStop.length) {
		gameOn = true;
		Buttao.disabled = false;

		let win = true;
		const siboloWin = Board[0][1];
		for (let i = 0; i < Board.length; i++) {
			if (siboloWin != Board[i][1]) win = false;
			if ((Board.length - 1 <= i) && win == true) WinDiv.style.visibility = "visible";
		}

		if (autoPlay) setTimeout(GerarJogo, 1000);
	}
}
