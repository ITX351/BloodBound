import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      playerNames: "",
      shufflePlayerList: false,
      result: ""
    };
  }

  static shuffleArray(arr) {
    let i = arr.length;
    let j = 0;
    while (i) {
      j = Math.floor(Math.random() * i--);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const {playerNames, shufflePlayerList} = this.state;

    let identityNameList = ["", "长老", "刺客", "小丑", "炼金术师", "感应者", "守护者", "狂战士", "法师", "交际花"];

    let red = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let blue = red.slice();
    let playerList = playerNames.split("\n");

    if (shufflePlayerList) {
      App.shuffleArray(playerList);
    }
    App.shuffleArray(red);
    App.shuffleArray(blue);

    let aver = Math.floor(playerList.length / 2);
    let finalList = [];

    for (let i = 0; i < aver; i++) {
      finalList.push("红" + red[i].toString());
      finalList.push("蓝" + blue[i].toString());
    }
    if (playerList.length % 2 === 1) {
      finalList.push("审判者");
    }

    App.shuffleArray(finalList);
    let result = "";
    for (let i = 0; i < finalList.length; i++) {
      let thisStr = finalList[i];
      let identityName = "";
      if (thisStr !== "审判者") {
        identityName = identityNameList[parseInt(thisStr.slice(1, 2))];
      }

      let nextStr = finalList[(i + 1) % finalList.length];
      let nextColor = nextStr.slice(0, 1);
      if (nextStr === "红3") {
        nextColor = "蓝";
      } else if (nextStr === "蓝3") {
        nextColor = "红";
      } else if (nextStr === "审判者") {
        nextColor = Math.random() > 0.5 ? "红" : "蓝";
      }

      result += (i + 1).toString() + " " + playerList[i] + " " + finalList[i] + " " + identityName + " 下家" + nextColor + "\n";
    }
    this.setState({result: result});
  }

  render() {
    const {playerNames, shufflePlayerList, result} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">鲜血盟约导演器</h1>
          <h5>
            <a href="/forum.php?mod=viewthread&tid=5859">规则链接</a>
          </h5>
        </header>
        <div>
          <div>
            演员列表：
            <textarea value={playerNames} onChange={event => this.setState({playerNames: event.target.value})} />
            <input type="checkbox"
                   checked={shufflePlayerList}
                   onChange={value => this.setState({shufflePlayerList: value.currentTarget.checked})}
            />位置洗牌
            <button type="button" onClick={this.handleSubmit}>
              生成
            </button>
          </div>
          <div>
            <textarea value={result}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
