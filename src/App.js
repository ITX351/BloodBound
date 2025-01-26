import React, { Component } from 'react';
import Clipboard from "react-clipboard.js";
import './App.css';

const BLOODBOUND = "BloodBound";
const ONENIGHT = "OneNight";
const ONEDAYFAN = "OneDayFan";
const GUESSWORD = "GuessWord";
const CUSTOM = "Custom"; // 新增自定义游戏模式

const bloodBoundIdentityNameList = ["", "长老", "刺客", "小丑", "炼金术师", "感应者", "守护者", "狂战士", "法师", "交际花"];
const oneNightIdentityNameList = ["狼人", "狼人", "占卜", "捣蛋", "酒鬼", "怪盗", "村民", "失眠", "幽灵", "皮匠", "猎人", "爪牙"];
const oneDayFanIdentityNameList = ["狼人", "狼人", "狼人", "狼王", "村民", "村民", "村民", "警长", "预言家", "女巫", "猎人", "白痴"];

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGameTypeChange = this.handleGameTypeChange.bind(this); // 新增游戏类型切换处理函数
    this.state = {
      playerNames: "",
      shufflePlayerList: false,
      results: [],
      words: [],
      identities: bloodBoundIdentityNameList.join("\n"), // 使用一个状态存储身份列表
      gameType: BLOODBOUND // "BloodBound" or "OneNight" or "OneDayFan" or "GuessWord" or "Custom"
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

  static getRGB(color) {
    if (color === 0) {
      return "rgba(255, 255, 255, 1)";
    }
    if (color === 1) {
      return "rgba(255, 0, 0, 0.5)";
    }
    if (color === 2) {
      return "rgba(0, 0, 255, 0.5)";
    }
    if (color === 3) {
      return "rgba(0, 0, 0, 0.25)";
    }
    if (color === 4) {
      return "rgba(255, 255, 0, 0.5)";
    }
  }

  handleWordColor(i, j) {
    let { words } = this.state;
    words[i][j].now++;
    words[i][j].now%=5;
    this.setState({words: words});
  }

  handleGameTypeChange(e) {
    const gameType = e.currentTarget.value;
    //let identities = this.identities;
    let identities = "";
    if (gameType === BLOODBOUND) {
      identities = bloodBoundIdentityNameList.join("\n");
    } else if (gameType === ONENIGHT) {
      identities = oneNightIdentityNameList.join("\n");
    } else if (gameType === ONEDAYFAN) {
      identities = oneDayFanIdentityNameList.join("\n");
    } else if (gameType === CUSTOM) {
      identities = this.state.identities;
    }
    this.setState({ gameType, identities });
  }

  handleSubmit(e) {
    e.preventDefault();

    const {playerNames, shufflePlayerList, gameType, identities} = this.state;

    let identityNameList = identities.trim().split("\n"); // 获取身份列表

    let playerNameList = playerNames.trim().split("\n");

    for (let i = 0; i < playerNameList.length; i++) {
      let playerName = playerNameList[i];
      while (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " "].indexOf(playerName.slice(0, 1)) !== -1) {
        playerName = playerName.slice(1, playerName.length);
      }
      playerNameList[i] = playerName;
    }
    while (playerNameList[playerNameList.length - 1].startsWith("随机") ||
      playerNameList[playerNameList.length - 1].startsWith("人配置") ||
      playerNameList[playerNameList.length - 1].startsWith("剩余")
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
          identityName = identityNameList[parseInt(thisStr.slice(1, 2), 10)] + " ";
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
      let oneNightIdentities = identityNameList.slice(0, identityNum);
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
        newPlayerNames += identityNameList[i] + " ";
      }
    } else if (gameType === ONEDAYFAN) {
      let oneDayFanIdentities = identityNameList.slice();
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
    } else if (gameType === GUESSWORD) {
      // 0 - 白, 1 - 红, 2 - 蓝, 3 - 黑
      let colors = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3];
      App.shuffleArray(colors);
      let wordList = playerNames.trim().split(/[ \t\r\n]+/);
      let words = [];
      for (let i = 0; i < Math.min(wordList.length, 25); i++) {
        if (i % 5 === 0) words.push([]);
        words[words.length - 1].push({
          text: wordList[i],
          color: colors[i],
          now: 0,
        });
      }
      this.setState({words: words});
      return;
    } else if (gameType === CUSTOM) {
      let identityNum = playerNameList.length;
      let customIdentities = identityNameList.slice();
      App.shuffleArray(customIdentities);
      let assignedIdentities = customIdentities.slice(0, identityNum);
      let remainingIdentities = customIdentities.slice(identityNum);

      for (let i = 0; i < identityNum; i++) {
        let secretText = "";
        if (i < playerNameList.length) {
          newPlayerNames += (i + 1).toString() + playerNameList[i] + "\n";
          secretText += playerNameList[i] + " ";
        }
        secretText += (i + 1).toString() + assignedIdentities[i];
        secrets.push({
          text: secretText,
          copyText: i < playerNameList.length ? secretText : null
        });
      }
      newPlayerNames += "随机" + App.randInt(playerNameList.length).toString() + "发言\n";

      newPlayerNames += playerNameList.length.toString() + "人配置：";
      for (let i = 0; i < identityNum; i++) {
        newPlayerNames += assignedIdentities[i] + " ";
      }
      if (remainingIdentities.length > 0) {
        newPlayerNames += "\n剩余身份：";
        for (let i = 0; i < remainingIdentities.length; i++) {
          newPlayerNames += remainingIdentities[i] + " ";
        }
      }
    }
    this.setState({playerNames: newPlayerNames, results: secrets});
  }

  render() {
    const {playerNames, shufflePlayerList, results, words, gameType, identities} = this.state;
    console.log(results);

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title space-20">随机身份分发器</h1>
          <h6 className="space-20">
            支持规则：
            <a href="/forum.php?mod=viewthread&tid=5859">鲜血盟约</a>&nbsp;
            <a href="/forum.php?mod=viewthread&tid=6614">一夜狼人</a>&nbsp;
            <a href="/forum.php?mod=viewthread&tid=7830">扇子狼人</a>&nbsp;
            <a href="#">猜词</a>&nbsp;
            <a href="#">自定义</a>
            <br/>项目源代码：
            <a href="https://github.com/ITX351/BloodBound">{`GitHub © ITX351 & lydrainbowcat`}</a>
          </h6>
        </header>
        <div className="container-fluid index-area">
          <div className="row space-10 no-gutters">
            <div className="col-2 text-center">
              <h6 className="space-10">身份列表</h6>
              <textarea
                value={identities}
                rows="13"
                style={{width : "85%"}}
                onChange={event => this.setState({identities: event.target.value})}
              />
            </div>
            <div className="col-4 text-center">
              <h6 className="space-10">
                {gameType !== GUESSWORD ? "演员列表" : "词板"}
                <Clipboard component="a" button-href="#" data-clipboard-text={playerNames}>[复制]</Clipboard>
              </h6>
              <div>
                <textarea
                  value={playerNames}
                  rows="13"
                  style={{width : "85%"}}
                  onChange={event => this.setState({playerNames: event.target.value})}
                />
              </div>
            </div>
            <div className="col-6 text-center">
              <h6 className="space-10">
                生成结果
                {gameType !== GUESSWORD &&
                <Clipboard component="a" button-href="#" data-clipboard-text={results.map(result => result.text).join("\n")}>[复制揭秘]</Clipboard>}
              </h6>
              <div className="text-left space-10">
                {gameType !== GUESSWORD && results.map((result, i) => {
                  return <div key={i}>
                    {result.text}&nbsp;
                    {result.copyText !== null && <Clipboard component="a" button-href="#" data-clipboard-text={result.copyText}>[复制QQ消息]</Clipboard>}
                  </div>;
                })}
                {gameType === GUESSWORD && <div>
                  <table className="word-board">
                    {words.map((row, i) => <tr key={i}>
                      {row.map((word, j) => <td key={i*5+j} style={{backgroundColor: App.getRGB(word.color)}}>
                        {word.text}
                      </td>)}
                    </tr>)}
                  </table>
                  {words.length > 0 && <div className="space-20"></div>}
                  {words.length > 0 && <h6 className="text-center">动态词板（点击改变颜色）</h6>}
                  <table className="word-board">
                    {words.map((row, i) => <tr key={i}>
                      {row.map((word, j) => <td key={i*5+j} style={{backgroundColor: App.getRGB(word.now)}} onClick={this.handleWordColor.bind(this, i, j)}>
                        {word.text}
                      </td>)}
                    </tr>)}
                  </table>
                </div>}
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
            <div className="col-2 text-center">
              <input type="radio"
                     className="spacing-inline-5"
                     value={BLOODBOUND}
                     name="game_type_radio"
                     checked={gameType === BLOODBOUND}
                     onChange={this.handleGameTypeChange}
              />
              鲜血盟约(砍树)
            </div>
            <div className="col-2 text-center">
              <input type="radio"
                     className="spacing-inline-5"
                     value={ONENIGHT}
                     name="game_type_radio"
                     checked={gameType === ONENIGHT}
                     onChange={this.handleGameTypeChange}
              />
              一夜狼人
            </div>
            <div className="col-2 text-center">
              <input type="radio"
                     className="spacing-inline-5"
                     value={ONEDAYFAN}
                     name="game_type_radio"
                     checked={gameType === ONEDAYFAN}
                     onChange={this.handleGameTypeChange}
              />
              扇子狼人
            </div>
            <div className="col-2 text-center">
              <input type="radio"
                     className="spacing-inline-5"
                     value={GUESSWORD}
                     name="game_type_radio"
                     checked={gameType === GUESSWORD}
                     onChange={this.handleGameTypeChange}
              />
              猜词
            </div>
            <div className="col-2 text-center">
              <input type="radio"
                     className="spacing-inline-5"
                     value={CUSTOM}
                     name="game_type_radio"
                     checked={gameType === CUSTOM}
                     onChange={this.handleGameTypeChange}
              />
              自定义
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
