import React, { useState, useEffect } from "react";
import { Container, Navbar, Row, Col, Button, Table } from "react-bootstrap";
import FacebookLogin from "react-facebook-login";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [board, setBoard] = useState(
    new Array(9).fill({ value: null, color: "X-hover" })
  );

  const setMove = (arr, index) => {
    const newHistoryMove = historyMove.filter((item, idx) => idx <= index);
    setBoard(arr);
    setHistoryMove(newHistoryMove);
  };

  const [historyMove, setHistoryMove] = useState(new Array().fill(null));
  const [gameHistory, setGameHistory] = useState(new Array().fill(null));

  //user's data from fb
  const [userData, setUserData] = useState(null);

  //store data get from API
  const [gameData, setGameData] = useState(null);

  //set data to API
  const postApi = async () => {
    let data = new URLSearchParams();
    data.append("player", userData.name);
    data.append("score", -Infinity);
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data.toString(),
      json: true
    });

    console.log("response", response);
    getAPI();
  };

  //get data from API
  const getAPI = async () => {
    const url = "https://ftw-highscores.herokuapp.com/tictactoe-dev";
    const response = await fetch(url);
    const jsonResult = await response.json();

    setGameData(jsonResult.items);
  };

  const responseFacebook = resp => {
    console.log(resp);
    setUserData({
      name: resp.name,
      email: resp.email,
      picture: resp.picture.data.url
    });
  };

  useEffect(() => {
    getAPI();
  }, []);

  return (
    <>
      {!userData ? (
        <FacebookLogin
          appId="2149915191977471"
          // autoLoad={true}
          fields="name,email,picture"
          // onClick={componentClicked}
          callback={resp => responseFacebook(resp)}
        />
      ) : (
        <>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">
              <img
                alt=""
                src="/logo.svg"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              Welcome {userData.name}{" "}
              <img src={userData.picture} roundedCircle></img>
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
                  gameData={gameData && gameData}
                  postApi={postApi}
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
                              className="custom-btn"
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
      )}
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
    props.setBoard(new Array(9).fill({ value: null, color: "X-hover" }));
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

        props.setGameHistory(newGamehistory);
        props.setBoard(arr);
        setResult(`${arr[a].value} is the winner`);
        setIsOver(true);
        props.postApi();
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
    else return;
    const newDataBoard = dataBoard.map(item => {
      return {
        value: item.value,
        color: item.value === null ? (check % 2 ? "O-hover" : "X-hover") : null
      };
    });
    // //if a square has X or O inside, prevent user from changing its value
    console.log("new", newDataBoard);
    if (check == 1) setResult("draw");
    props.setBoard(newDataBoard);
    let tempArray = props.historyMove;
    tempArray.push(dataBoard);
    props.setHistoryMove(tempArray);
    if (winCondition(dataBoard)) {
      setIsOver(true);
    }
  };

  return (
    <div className="board-container">
      <div className="result">Result {result && result}</div>
      <div className="board">
        {props.board.map((item, idx) => {
          return (
            <Square
              key={idx}
              item={item}
              index={idx}
              handleClick={handleClick}
              onMouseOver={() => console.log("val")}
            />
          );
        })}
      </div>
      <div>
        <Button className="custom-btn reset-btn" onClick={() => Reset()}>
          Reset game
        </Button>
      </div>
      <div>
        <h2 className="highscore">High score</h2>

        <Table bordered className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {props.gameData.map((item, index) => {
              return (
                <tr className="row-hover">
                  <td>{index}</td>
                  <td>{item.player}</td>
                  <td>{item.score ? item.score : "Infinity"}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <div></div>
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
