import React, { Component } from 'react';
import Clipboard from "react-clipboard.js";
import './App.css';

const BLOODBOUND = "BloodBound";
const ONENIGHT = "OneNight";
const ONEDAYFAN = "OneDayFan";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      playerNames: "",
      shufflePlayerList: false,
      results: [],
      gameType: BLOODBOUND // "BloodBound" or "OneNight" or "OneDayFan"
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
    let oneDayFanIdentityNameList = ["狼人", "狼人", "狼人", "狼王", "村民", "村民", "村民", "警长",
                                     "预言家", "女巫", "猎人", "白痴"];

    let playerNameList = playerNames.trim().split("\n");

    for (let i = 0; i < playerNameList.length; i++) {
      let playerName = playerNameList[i];
      while (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " "].indexOf(playerName.slice(0, 1)) !== -1) {
        playerName = playerName.slice(1, playerName.length);
      }
      playerNameList[i] = playerName;
    }
    while (playerNameList[playerNameList.length - 1].startsWith("随机") ||
      playerNameList[playerNameList.length - 1].startsWith("人配置")
      ) {
      playerNameList = playerNameList.slice(0, playerNameList.length - 1);
    }

    if (shufflePlayerList) {
      App.shuffleArray(playerNameList);
    }

    let newPlayerNames = "";
    let secrets = [];
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
        let secretText = (i + 1).toString() + playerNameList[i] + " " + finalList[i] + identityName + "下家" + nextColor;
        secrets.push({
          text: secretText,
          copyText: secretText
        });
      }
      newPlayerNames += "随机" + App.randInt(playerNameList.length).toString() + "提刀";
    } else if (gameType === ONENIGHT) {
      let identityNum = playerNameList.length + 3;
      let oneNightIdentities = oneNightIdentityNameList.slice(0, identityNum);
      App.shuffleArray(oneNightIdentities);

      for (let i = 0; i < identityNum; i++) {
        let secretText = "";
        if (i < playerNameList.length) {
          newPlayerNames += (i + 1).toString() + playerNameList[i] + "\n";
          secretText += playerNameList[i] + " ";
        }
        secretText += (i + 1).toString() + oneNightIdentities[i];
        secrets.push({
          text: secretText,
          copyText: i < playerNameList.length ? secretText : null
        });
      }
      newPlayerNames += "随机" + App.randInt(playerNameList.length).toString() + "发言\n";

      newPlayerNames += playerNameList.length.toString() + "人配置：";
      for (let i = 0; i < identityNum; i++) {
        newPlayerNames += oneNightIdentityNameList[i] + " ";
      }
    } else if (gameType === ONEDAYFAN) {
      let oneDayFanIdentities = oneDayFanIdentityNameList.slice();
      App.shuffleArray(oneDayFanIdentities);
      oneDayFanIdentities = oneDayFanIdentities.slice(0, playerNameList.length);

      for (let i = 0; i < playerNameList.length; i++) {
        newPlayerNames += (i + 1).toString() + playerNameList[i] + "\n";
        let sendText = "";
        for (let j = 0; j < playerNameList.length; j++) {
          if (i !== j) {
            sendText += (j + 1).toString() + playerNameList[j] + oneDayFanIdentities[j] + "\n";
          }
        }
        secrets.push({
          text: playerNameList[i] + " " + (i + 1).toString() + oneDayFanIdentities[i],
          copyText: sendText
        })
      }
      newPlayerNames += "随机" + App.randInt(playerNameList.length).toString() + "发言\n";
    }
    this.setState({playerNames: newPlayerNames, results: secrets});
  }

  render() {
    const {playerNames, shufflePlayerList, results, gameType} = this.state;
    console.log(results);

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title space-20">随机身份分发器</h1>
          <h6 className="space-20">
            支持规则：
            <a href="/forum.php?mod=viewthread&tid=5859">鲜血盟约(砍树)</a>&nbsp;
            <a href="/forum.php?mod=viewthread&tid=6614">一夜狼人</a>&nbsp;
            <a href="/forum.php?mod=viewthread&tid=7830">扇子狼人</a>
            &nbsp;源代码：
            <a href="https://github.com/ITX351/BloodBound">GitHub</a>
          </h6>
        </header>
        <div className="container-fluid index-area">
          <div className="row space-10 no-gutters">
            <div className="col-4 text-center">
              <h6 className="space-10">
                演员列表
                <Clipboard component="a" button-href="#" data-clipboard-text={playerNames}>[复制]</Clipboard>
              </h6>
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
              <h6 className="space-10">
                生成结果
                <Clipboard component="a" button-href="#" data-clipboard-text={results.map(result => result.text).join("\n")}>[复制揭秘]</Clipboard>
              </h6>
              <div className="text-left space-10">
                {results.map((result, i) => {
                  return <div key={i}>
                    {result.text}&nbsp;
                    {result.copyText !== null && <Clipboard component="a" button-href="#" data-clipboard-text={result.copyText}>[复制QQ消息]</Clipboard>}
                  </div>;
                })}
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
            <div className="col-4 text-center">
              <input type="radio"
                     className="spacing-inline-5"
                     value={BLOODBOUND}
                     name="game_type_radio"
                     checked={gameType === BLOODBOUND}
                     onChange={value => this.setState({gameType: value.currentTarget.value})}
              />
              鲜血盟约
            </div>
            <div className="col-4 text-center">
              <input type="radio"
                     className="spacing-inline-5"
                     value={ONENIGHT}
                     name="game_type_radio"
                     checked={gameType === ONENIGHT}
                     onChange={value => this.setState({gameType: value.currentTarget.value})}
              />
              一夜狼人
            </div>
            <div className="col-4 text-center">
              <input type="radio"
                     className="spacing-inline-5"
                     value={ONEDAYFAN}
                     name="game_type_radio"
                     checked={gameType === ONEDAYFAN}
                     onChange={value => this.setState({gameType: value.currentTarget.value})}
              />
              扇子狼人
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
