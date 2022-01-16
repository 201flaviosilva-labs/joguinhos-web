import { randomNumber } from "../../../Scripts/util.js";

import config from "./Config.js";

class Game {
	constructor() {
		this.canvas = document.getElementById("Canvas");
		this.canvas.width = config.width;
		this.canvas.height = config.height;

		this.ctx = this.canvas.getContext("2d");

		document.addEventListener("keydown", (e) => this.mudarDirecao(e));
		this.directionMobile();
		this.jogadorTimer = null;
		this.corAnterior = config.mapa.legenda.chao;

		if (!localStorage.canvasSnakeMaiorPontuacao) {
			localStorage.canvasSnakeMaiorPontuacao = 0;
		}
		this.actualPontos = 0;

		if (localStorage.CanvasSnakeSpeed) config.player.speed = localStorage.CanvasSnakeSpeed;

		this.changedDiredction = false;

		this.criarMapa();
	}

	directionMobile() {
		// Mover Jogador no Canvas em modo Mobile
		let startCoordinates = { X: 0, Y: 0 };
		document.addEventListener("touchstart", (e) => {
			startCoordinates.X = e.changedTouches[0].clientX;
			startCoordinates.Y = e.changedTouches[0].clientY;
		}, false);

		document.addEventListener("touchmove", (e) => {
			const endCoordinates = {
				X: e.changedTouches[0].clientX,
				Y: e.changedTouches[0].clientY
			}
			const xDifference = Math.abs(startCoordinates.X - endCoordinates.X);
			const yDifference = Math.abs(startCoordinates.Y - endCoordinates.Y);

			const event = { keyCode: 0 };
			if (xDifference > 50) {
				if (startCoordinates.X > endCoordinates.X) event.keyCode = 37;
				else event.keyCode = 39;
			} else if (yDifference > 50) {
				if (startCoordinates.Y > endCoordinates.Y) event.keyCode = 38;
				else event.keyCode = 40;
			}
			this.mudarDirecao(event);
		}, false);
	}

	criarMapa() {
		for (let x = 0; x <= config.mapa.colunas; x++) {
			config.mapa.desenho[x] = [];
			for (let y = 0; y <= config.mapa.linhas; y++) {
				if (x === 0 || x === config.mapa.colunas || y === 0 || y === config.mapa.linhas)
					config.mapa.desenho[x][y] = config.mapa.legenda.parede;
				else {
					config.mapa.desenho[x][y] = config.mapa.legenda.chao;
					config.mapa.totalCell++;
				}
			}
		}

		this.randomMaca();
		this.jogadorLoop();
		this.desenhar();
	}

	desenhar() {
		if (config.stop) return;

		this.ctx.clearRect(0, 0, config.width, config.height);

		this.desenharMapa();
		this.texto();

		requestAnimationFrame(this.desenhar.bind(this));
	}

	texto() {
		this.ctx.font = "20px monospace";
		this.ctx.fillStyle = "blue";
		this.ctx.textAlign = "center";
		this.ctx.fillText(`${this.actualPontos} / ${localStorage.canvasSnakeMaiorPontuacao}`, config.width / 2, 17);
	}

	desenharMapa() {
		this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
		let color = "green";

		const tilleSize = config.mapa.tilleSize;
		const legenda = config.mapa.legenda;

		for (let x = 0; x <= config.mapa.colunas; x++) {
			for (let y = 0; y <= config.mapa.linhas; y++) {

				switch (config.mapa.desenho[x][y]) {
					case legenda.chao:
						color = "black";
						break;

					case legenda.parede:
						color = "grey";
						break;

					case legenda.jogador:
						color = "blue";
						break;

					case legenda.corpo:
						color = "royalblue";
						break;

					case legenda.maca:
						color = "red";
						break;
					default:
						break;
				}

				this.ctx.fillStyle = color;
				this.ctx.fillRect(x * tilleSize, y * tilleSize, tilleSize, tilleSize);
				this.ctx.strokeRect(x * tilleSize, y * tilleSize, tilleSize, tilleSize);
			}
		}
	}

	randomMaca() {
		do {
			config.maca.x = randomNumber(1, config.mapa.colunas - 1);
			config.maca.y = randomNumber(1, config.mapa.linhas - 1);

			if (config.mapa.desenho[config.maca.x][config.maca.y] === 1) {
				config.mapa.desenho[config.maca.x][config.maca.y] = config.mapa.legenda.maca;
				break;
			}
		} while (true);
	}

	mudarDirecao(e) {
		const keyCode = e.keyCode;
		if (keyCode === 37 && config.player.direcao !== config.player.direcoesPossiveis[1]) config.player.direcao = config.player.direcoesPossiveis[0];
		if (keyCode === 39 && config.player.direcao !== config.player.direcoesPossiveis[0]) config.player.direcao = config.player.direcoesPossiveis[1];
		if (keyCode === 38 && config.player.direcao !== config.player.direcoesPossiveis[3]) config.player.direcao = config.player.direcoesPossiveis[2];
		if (keyCode === 40 && config.player.direcao !== config.player.direcoesPossiveis[2]) config.player.direcao = config.player.direcoesPossiveis[3];
		this.mover();
		this.timerChangeDirection();
	}

	mover() {
		if (this.changedDiredction) return;

		let jogadorX = config.player.x;
		let jogadorY = config.player.y;

		config.mapa.desenho[jogadorX][jogadorY] = this.corAnterior;

		if (config.player.cauda.length) {
			this.colisaoCropo(jogadorX, jogadorY);
			this.moverCauda(jogadorX, jogadorY);
		}
		this.colisaoMaca(jogadorX, jogadorY);

		if (config.player.direcao === config.player.direcoesPossiveis[0]) jogadorX -= 1;
		if (config.player.direcao === config.player.direcoesPossiveis[1]) jogadorX += 1;
		if (config.player.direcao === config.player.direcoesPossiveis[2]) jogadorY -= 1;
		if (config.player.direcao === config.player.direcoesPossiveis[3]) jogadorY += 1;

		this.colisaoParede(jogadorX, jogadorY);

		this.corAnterior = config.mapa.desenho[jogadorX][jogadorY];

		config.mapa.desenho[jogadorX][jogadorY] = config.mapa.legenda.jogador;
		config.player.x = jogadorX;
		config.player.y = jogadorY;
	}

	colisaoMaca(jogadorX, jogadorY) {
		if (jogadorX === config.maca.x && jogadorY === config.maca.y) {
			this.actualPontos++;
			if (this.actualPontos > localStorage.canvasSnakeMaiorPontuacao) {
				localStorage.canvasSnakeMaiorPontuacao = this.actualPontos;
			}
			this.randomMaca();
			config.player.cauda.unshift({ x: jogadorX, y: jogadorY });
			config.mapa.desenho[jogadorX][jogadorY] = config.mapa.legenda.corpo;
		}
	}

	colisaoCropo(jogadorX, jogadorY) {
		if (config.mapa.desenho[jogadorX][jogadorY] === config.mapa.legenda.corpo) this.pararJogo();
	}

	colisaoParede(jogadorX, jogadorY) {
		if (config.mapa.desenho[jogadorX][jogadorY] === config.mapa.legenda.parede) this.pararJogo();
	}

	moverCauda(jogadorX, jogadorY) {
		const last = config.player.cauda[config.player.cauda.length - 1];
		config.mapa.desenho[last.x][last.y] = config.mapa.legenda.chao;
		config.player.cauda.pop();
		config.player.cauda.unshift({ x: jogadorX, y: jogadorY });
		config.mapa.desenho[jogadorX][jogadorY] = config.mapa.legenda.corpo;
	}

	jogadorLoop() {
		this.jogadorTimer = setInterval(() => this.mover(), config.player.speed);
	}

	timerChangeDirection() {
		this.changedDiredction = true;
		setTimeout(() => this.changedDiredction = false, (config.player.speed / 3) * 2);
	}

	pararJogo() {
		this.ctx.fillStyle = "red";
		this.ctx.fillText(config.textoDerrota, config.width / 2, config.height / 2);
		config.stop = true;
		clearTimeout(this.jogadorTimer);
		this.jogadorTimer = null;
	}
}

const game = new Game();
