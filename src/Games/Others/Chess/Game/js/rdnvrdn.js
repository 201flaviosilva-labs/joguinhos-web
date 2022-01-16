// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js
// Exemplo -> https://chessboardjs.com/examples#5002

import { makeRandomMove, updateStatus, } from "./utils.js";

const config = {
	position: "start",
};

const board = Chessboard("myBoard", config);

const game = new Chess();
const squareToHighlight = null;
const time = 1000;
let moveColor = "white";

Update();
setTimeout(randomMove, time);

function randomMove() {
	makeRandomMove(game, squareToHighlight, board);
	Update();
	setTimeout(randomMove, time);
}

function Update() {
	moveColor = "white";
	if (game.turn() === "b") moveColor = "black";

	updateStatus(game);
}
