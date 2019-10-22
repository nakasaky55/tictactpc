import React, { useState } from "react";
import { Container, Navbar, Row, Col, Button } from "react-bootstrap";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [board, setBoard] = useState(
    new Array(9).fill({ value: null, color: null })
  );

  const setMove = (arr, index) => {
    const newHistoryMove = historyMove.filter((item, idx) => idx <= index);
    setBoard(arr);
    setHistoryMove(newHistoryMove);
  };

  const [historyMove, setHistoryMove] = useState(new Array().fill(null));
  const [gameHistory, setGameHistory] = useState(new Array().fill(null));
  console.log(gameHistory);
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          React Bootstrap
        </Navbar.Brand>
      </Navbar>
      <Container fluid="true">
        <Row>
          <Col lg={8}>
            <Board
              board={board}
              setBoard={setBoard}
              setHistoryMove={setHistoryMove}
              historyMove={historyMove}
              gameHistory={gameHistory}
              setGameHistory={setGameHistory}
            />
          </Col>
          <Col lg={4}>
            <Row>
              <h1>History move</h1>
              <ol>
                {historyMove.map((item, idx) => {
                  return (
                    <div>
                      <li>
                        <Button
                          onClick={() => setMove(item, idx)}
                          variant="outline-dark"
                        >
                          Move {idx + 1}
                        </Button>
                      </li>
                    </div>
                  );
                })}
              </ol>
            </Row>
            <Row>
              <h1>Game History</h1>
              <ul>
                {gameHistory.map(item => {
                  return <li>{item} is winner</li>;
                })}
              </ul>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

function Board(props) {
  const [result, setResult] = useState(null);
  const [isOver, setIsOver] = useState(false);

  // 0 1 2
  // 3 4 5
  // 6 7 8

  const Reset = () => {
    setIsOver(false);
    props.setBoard(new Array(9).fill({ value: null, color: null }));
    setResult(null);
    props.setHistoryMove(new Array());
  };

  function winCondition(arr) {
    const condition = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2]
    ];

    for (let i = 0; i < condition.length; i++) {
      let [a, b, c] = condition[i];
      if (
        arr[a].value &&
        arr[a].value === arr[b].value &&
        arr[a].value === arr[c].value
      ) {
        arr[a].color = "black" + arr[a].value;
        arr[b].color = "black" + arr[b].value;
        arr[c].color = "black" + arr[c].value;
        let newGamehistory = props.gameHistory;
        newGamehistory.push(arr[a].value);
        console.log(newGamehistory);
        props.setGameHistory(newGamehistory);
        setResult(`${arr[a].value} is the winner`);
        setIsOver(true);
        return true;
      }
    }
    return false;
  }

  const handleClick = index => {
    let dataBoard = props.board.slice();

    if (isOver) {
      return;
    }
    const check = dataBoard.filter(item => !item.value).length;

    if (!dataBoard[index].value)
      dataBoard[index] = { value: check % 2 ? "X" : "O", color: null };
    // //if a square has X or O inside, prevent user from changing its value
    else return;
    if (check == 1) setResult("draw");
    props.setBoard(dataBoard);
    let tempArray = props.historyMove;
    tempArray.push(dataBoard);
    props.setHistoryMove(tempArray);
    if (winCondition(dataBoard)) setIsOver(true);
  };

  return (
    <div className="board">
      {props.board.map((item, idx) => {
        return (
          <Square key={idx} item={item} index={idx} handleClick={handleClick} />
        );
      })}
      <div>
        <div>Result {result && result}</div>
        <div>
          <Button variant="outline-info" onClick={() => Reset()}>
            Reset game
          </Button>
        </div>
      </div>
    </div>
  );
}

function Square(props) {
  return (
    <div
      className={`square ${props.item.value && props.item.value} ${props.item
        .color && props.item.color}`}
      onClick={() => props.handleClick(props.index)}
    >
      {/* {props.item.value} */}
    </div>
  );
}

export default App;
