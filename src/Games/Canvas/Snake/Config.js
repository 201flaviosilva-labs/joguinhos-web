const config = {
	// width: window.innerWidth - 20,
	// height: window.innerHeight - 20,
	width: 500,
	height: 500,
	stop: false,
	pontos: 0,
	textoDerrota: "Perder Assim, Sinceramente?",
	player: {
		direcoesPossiveis: ["left", "right", "up", "down"],
		cauda: [],
		speed: 150,
		x: 1,
		y: 1
	},
	maca: {
		x: 100,
		y: 100
	},
	mapa: {
		desenho: [],
		totalCell: 0,
		linhas: 100,
		colunas: 100,
		tilleSize: 20,
		legenda: {
			chao: 1,
			parede: 2,
			jogador: 3,
			corpo: 4,
			maca: 5,
		}
	}
};

if (window.innerWidth < 500) {
	const fixWidth = window.innerWidth % config.mapa.tilleSize;
	config.width = window.innerWidth - fixWidth;
}
if (window.innerHeight < 500) {
	const fixedHeight = window.innerHeight % config.mapa.tilleSize;
	config.height = window.innerHeight - fixedHeight;
}

config.mapa.colunas = Math.floor(config.width / config.mapa.tilleSize) - 1;
config.mapa.linhas = Math.floor(config.height / config.mapa.tilleSize) - 1;

config.player.direcao = config.player.direcoesPossiveis[1];

export default config;
