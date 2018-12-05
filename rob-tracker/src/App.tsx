import React, { Component } from 'react';
import './App.css';
import { Tokens } from './tokens';
import Twitch from 'twitch-js';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { find } from 'lodash';
import posed from 'react-pose';

class EmoteCount {
  id: number;
  text: string;
  @observable count: number;
}

const Circle = posed.div({
  attention: {
    scale: 1.3,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 0
    }
  }
})

@observer
class App extends Component<any, any> {
  cooldownTimer;
  tokens: Tokens = new Tokens();
  client: any;
  setup: boolean = false;
  @observable emoteCounts: EmoteCount[] = [];

  constructor(props) {
    super(props);
    this.setup = this.tokens.TWITCH_TOKEN != "" && this.tokens.TWITCH_USERNAME != "";
    if (this.setup) {
      //this.setupClient();
    }
  }

  async setupClient() {
    this.cooldownTimer = setInterval(() => this.coolDown(), 500);
    const { api, chat, chatConstants } = new Twitch({ token: this.tokens.TWITCH_TOKEN, username: this.tokens.TWITCH_USERNAME })
    console.log(chatConstants);
    chat.on(chatConstants.EVENTS.PRIVATE_MESSAGE, (msg) => this.logEvent(msg));
    await chat.connect();
    // Change this to the chat room.
    await chat.join("gooffkings");
  }

  coolDown() {
    // Add cooldown
  }

  logEvent(msg) {
    console.log(msg);
    if (msg.tags == null || msg.tags.emotes == null)
      return;
    for (let emote of msg.tags.emotes) {
      let emoteTag = find(this.emoteCounts, { id: emote.id })
      if (emoteTag == null) {
        let emoteString = msg.message.substring(emote.start, emote.end);
        this.emoteCounts.push({
          id: emote.id,
          text: emoteString,
          count: 1
        });
      }
      else {
        emoteTag.count = emoteTag.count + 1;
      }
    }
  }

  renderMissingTokens() {
    return (
      <div className="App">
        <h2>You must add your Twitch tokens to tokens.ts!</h2>
      </div>
    );
  }

  renderRob() {
    return <Circle initialPose="none" pose="attention" className="rob"></Circle>
  }

  render() {
    if (!this.setup)
      return this.renderMissingTokens();
    // let avatars = this.emoteCounts
    //   .slice()
    //   .sort((x, y) => y.count - x.count)
    //   .map(u =>
    //     <div style={{height: "28px"}}>
    //       <img className="avatar" src={`https://static-cdn.jtvnw.net/emoticons/v1/${u.id}/1.0`} />
    //       <div className="amount">{`- ${u.count}`}</div>
    //     </div>)
    return (
      <div className="App">
        {this.renderRob()}
      </div>
    );
  }
}

export default App;
