// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js
// Exemplo -> https://chessboardjs.com/examples#5000
import { removeGreySquares, greySquare, removeHighlights, updateStatus } from "./utils.js";

const config = {
	draggable: true,
	position: "start",
	onDragStart: onDragStart,
	onDrop: onDrop,
	onMouseoverSquare: onMouseoverSquare,
	onMouseoutSquare: onMouseoutSquare,
	onMoveEnd: onMoveEnd,
	onSnapEnd: onSnapEnd,
};

const board = Chessboard("myBoard", config);

const $board = $("#myBoard");
const game = new Chess();
const squareToHighlight = null;
let moveColor = "white";

Update();

function onDragStart(source, piece, position, orientation) {
	// Do not pick up pieces if the game is over
	if (game.game_over()) return false;

	// Only pick up pieces for the side to move
	if ((game.turn() === "w" && piece.search(/^b/) !== -1) ||
		(game.turn() === "b" && piece.search(/^w/) !== -1)) {
		return false;
	}
	removeHighlights(moveColor);
}

function onDrop(source, target) {
	// See if the move is legal
	const move = game.move({
		from: source,
		to: target,
		promotion: "q", // NOTE: Always promote to a queen for example simplicity
	});

	// Illegal move
	if (move === null) return "snapback";

	$board.find(".square-" + source).addClass("highlight-" + moveColor);
	$board.find(".square-" + target).addClass("highlight-" + moveColor);
	Update();
}

function onMouseoverSquare(square, piece) {
	// Get list of possible moves for this square
	const moves = game.moves({
		square: square,
		verbose: true,
	});

	// Exit if there are no moves available for this square
	if (moves.length === 0) return;

	// Highlight the square they moused over
	greySquare(square);

	// Highlight the possible squares for this piece
	for (var i = 0; i < moves.length; i++) {
		greySquare(moves[i].to);
	}
}

function onMouseoutSquare(square, piece) {
	removeGreySquares();
}

function onMoveEnd() {
	$board.find(".square-" + squareToHighlight).addClass("highlight-black");
}

// Update the board position after the piece snap
// For castling, en passant, pawn promotion
function onSnapEnd() {
	board.position(game.fen());
}

function Update() {
	moveColor = "white";
	if (game.turn() === "b") moveColor = "black";

	updateStatus(game);
}
