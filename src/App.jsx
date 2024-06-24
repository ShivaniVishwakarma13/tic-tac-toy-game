import React, { useState } from 'react';

// eslint-disable-next-line react/prop-types
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Popup({ message, onClose, onRestart }) {
  return (
    <div className="popup">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
        <button onClick={onRestart}>Restart Game</button>
      </div>
    </div>
  );
}

export default function Board() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const currentSquares = history[currentMove].squares;
  const winner = calculateWinner(currentSquares);
  const isDraw = currentSquares.every(square => square !== null);

  function handleClick(i) {
    if (currentSquares[i] || winner) return;

    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    const nextHistory = history.slice(0, currentMove + 1).concat([{ squares: nextSquares }]);

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);

    const calculatedWinner = calculateWinner(nextSquares);
    if (calculatedWinner) {
      setPopupMessage(`Winner: ${calculatedWinner}`);
      setShowPopup(true);
    } else if (nextHistory.length === 10) {
      setPopupMessage("It's a draw!");
      setShowPopup(true);
    }
  }

  function jumpTo(move) {
    setCurrentMove(move);
    setXIsNext(move % 2 === 0);
  }

  function handleRestartGame() {
    setHistory([{ squares: Array(9).fill(null) }]);
    setCurrentMove(0);
    setXIsNext(true);
    setShowPopup(false);
    setPopupMessage("");
  }

  function handleClosePopup() {
    setShowPopup(false);
  }

  const moves = history.map((step, move) => {
    const description = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <>
      <div className='ticTittle'>Tic-Tac-Toe Multiplayer</div>
      <div className="board">
        {currentSquares.map((value, i) => (
          <Square key={i} value={value} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
      <div className="status">{status}</div>
      <ol>{moves}</ol>
      {showPopup && (
        <Popup message={popupMessage} onClose={handleClosePopup} onRestart={handleRestartGame} />
      )}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
