import React, { Component } from 'react';
import './App.css';

const BLOODBOUND = "BloodBound";
const ONENIGHT = "OneNight";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      playerNames: "",
      shufflePlayerList: false,
      result: "",
      gameType: BLOODBOUND // "BloodBound" or "OneNight"
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

  static randInt(upperBound) {
    return Math.ceil(Math.random() * upperBound);
  }

  handleSubmit(e) {
    e.preventDefault();

    const {playerNames, shufflePlayerList, gameType} = this.state;

    let bloodBoundIdentityNameList = ["", "长老", "刺客", "小丑", "炼金术师", "感应者", "守护者", "狂战士", "法师", "交际花"];
    let oneNightIdentityNameList = ["狼人", "狼人", "占卜", "捣蛋", "酒鬼", "怪盗", "村民", "失眠",
                                    "幽灵", "皮匠", "猎人", "爪牙"];

    let playerNameList = playerNames.trim().split("\n");

    for (let i = 0; i < playerNameList.length; i++) {
      let playerName = playerNameList[i];
      while (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(playerName.slice(0, 1)) !== -1) {
        playerName = playerName.slice(1, playerName.length);
      }
      playerNameList[i] = playerName;
    }
    if (playerNameList[playerNameList.length - 1].startsWith("随机")) {
      playerNameList = playerNameList.slice(0, playerNameList.length - 1);
    }

    if (shufflePlayerList) {
      App.shuffleArray(playerNameList);
    }

    let newPlayerNames = "";
    let secrets = "";
    if (gameType === BLOODBOUND) {
      let red = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let blue = red.slice();
      App.shuffleArray(red);
      App.shuffleArray(blue);

      let aver = Math.floor(playerNameList.length / 2);
      let finalList = [];

      for (let i = 0; i < aver; i++) {
        finalList.push("红" + red[i].toString());
        finalList.push("蓝" + blue[i].toString());
      }
      if (playerNameList.length % 2 === 1) {
        finalList.push("审判者");
      }

      App.shuffleArray(finalList);

      for (let i = 0; i < finalList.length; i++) {
        let thisStr = finalList[i];
        let identityName = "";
        if (thisStr !== "审判者") {
          identityName = bloodBoundIdentityNameList[parseInt(thisStr.slice(1, 2), 10)] + " ";
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

        newPlayerNames += (i + 1).toString() + playerNameList[i] + "\n";
        secrets += (i + 1).toString() + playerNameList[i] + " " + finalList[i] + identityName + "下家" + nextColor + "\n";
      }
      newPlayerNames += "随机" + App.randInt(playerNameList.length).toString() + "提刀";
    } else {
      let identityNum = playerNameList.length + 3;
      let oneNightIdentities = oneNightIdentityNameList.slice(0, identityNum);
      App.shuffleArray(oneNightIdentities);

      for (let i = 0; i < identityNum; i++) {
        if (i < playerNameList.length) {
          newPlayerNames += (i + 1).toString() + playerNameList[i] + "\n";
          secrets += playerNameList[i] + " ";
        }
        secrets += (i + 1).toString() + oneNightIdentities[i] + "\n";
      }
      newPlayerNames += "随机" + App.randInt(playerNameList.length).toString() + "发言\n";

      newPlayerNames += playerNameList.length.toString() + "人配置：";
      for (let i = 0; i < identityNum; i++) {
        newPlayerNames += oneNightIdentityNameList[i] + " ";
      }
    }
    this.setState({playerNames: newPlayerNames, result: secrets});
  }

  render() {
    const {playerNames, shufflePlayerList, result, gameType} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title space-20">鲜血盟约导演器</h1>
          <h5 className="space-20"><a href="/forum.php?mod=viewthread&tid=5859">规则链接</a></h5>
        </header>
        <div className="container-fluid index-area">
          <div className="row space-10 no-gutters">
            <div className="col-4 text-center">
              <h6 className="space-10">演员列表</h6>
              <div>
                <textarea
                  value={playerNames}
                  rows="12"
                  cols="15"
                  style={{resize : "none"}}
                  onChange={event => this.setState({playerNames: event.target.value})}
                />
              </div>
            </div>
            <div className="col-8 text-center">
              <h6 className="space-10">生成结果</h6>
              <div>
                <textarea
                  value={result}
                  rows="12"
                  cols="32"
                  style={{resize : "none"}}
                />
              </div>
            </div>
          </div>
          <div className="row space-10">
            <div className="col text-center">
              <input
                type="checkbox"
                className="inline-space-5"
                checked={shufflePlayerList}
                onChange={value => this.setState({shufflePlayerList: value.currentTarget.checked})}
              />
              坐次位置洗牌
            </div>
          </div>
          <div className="row space-10">
            <div className="col-6 text-center">
              <input type="radio"
                     className="spacing-inline-5"
                     value={BLOODBOUND}
                     name="game_type_radio"
                     checked={gameType === BLOODBOUND}
                     onChange={value => this.setState({gameType: value.currentTarget.value})}
              />
              鲜血盟约
            </div>
            <div className="col-6 text-center">
              <input type="radio"
                     className="spacing-inline-5"
                     value={ONENIGHT}
                     name="game_type_radio"
                     checked={gameType === ONENIGHT}
                     onChange={value => this.setState({gameType: value.currentTarget.value})}
              />
              一夜狼人
            </div>
          </div>
          <div className="row space-10">
            <div className="col text-center">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={this.handleSubmit}>
                生成
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
