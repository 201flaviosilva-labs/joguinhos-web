const speeds = {
	facil: 200,
	normal: 100,
	dificil: 50
};

document.getElementById("Reset").addEventListener("click", reload);

document.getElementById("Facil").addEventListener("click", () => {
	localStorage.CanvasSnakeSpeed = speeds.facil;
	reload();
});

document.getElementById("Normal").addEventListener("click", () => {
	localStorage.CanvasSnakeSpeed = speeds.normal;
	reload();
});

document.getElementById("Dificil").addEventListener("click", () => {
	localStorage.CanvasSnakeSpeed = speeds.dificil;
	reload();
});

function reload() {
	location.reload();
}
