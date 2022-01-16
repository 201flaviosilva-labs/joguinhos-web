const $board = $("#myBoard");
const statusLabel = document.getElementById("status");

const whiteSquareGrey = "#a9a9a9";
const blackSquareGrey = "#696969";
const squareClass = "square-55d63";

export function removeGreySquares() {
	$("#myBoard .square-55d63").css("background", '');
}

export function greySquare(square) {
	const $square = $('#myBoard .square-' + square);

	let background = whiteSquareGrey;
	if ($square.hasClass('black-3c85d')) {
		background = blackSquareGrey;
	}

	$square.css('background', background);
}

export function removeHighlights(color) {
	$board.find("." + squareClass).removeClass("highlight-" + color);
}

export function makeRandomMove(game, squareToHighlight, board) {
	const possibleMoves = game.moves({
		verbose: true,
	});

	// game over
	if (possibleMoves.length === 0) return;

	const randomIdx = Math.floor(Math.random() * possibleMoves.length);
	const move = possibleMoves[randomIdx];
	game.move(move.san);

	// highlight black's move
	removeHighlights("black");
	$board.find(".square-" + move.from).addClass("highlight-black");
	squareToHighlight = move.to;

	// update the board to the new position
	board.position(game.fen());
}

export function updateStatus(game) {
	let status = "";
	let cor = "Brancas";

	if (game.turn() === "b") cor = "Pretas";

	if (game.in_checkmate()) status = "Jogo Acabou," + " CHECKMATE a " + cor; // Checkmate?
	else if (game.in_draw()) status = "Jogo Acabou, empate!";	// Draw?
	else {	// Game still on
		status = cor + " a jogar";
		if (game.in_check()) status += " (CHECK)!";	// Check?
	}

	statusLabel.innerHTML = status;
	console.log({
		"Status": status,
		"FEN": game.fen(),
		"PNG": game.pgn(),
	});
}
