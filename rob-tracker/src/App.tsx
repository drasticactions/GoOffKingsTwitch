import React, { Component } from 'react';
import './App.css';
import { Tokens } from './tokens';
import Twitch from 'twitch-js';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import posed from 'react-pose';

const Rob = posed.div({
  GoOff: {
    scale: ({ dynScale }) => dynScale,
    transition: ({ dynStiff }) => ({
      type: 'spring',
      stiffness: dynStiff,
      damping: 0
    }),
    props: { dynStiff: 200, dynScale: 1 }
  },
  none: {
    scale: 1
  }
})

@observer
class App extends Component<any, any> {
  cooldownTimer;
  tokens: Tokens = new Tokens();
  client: any;
  setup: boolean = false;
  @observable emoteCounts: number = 0;
  constructor(props) {
    super(props);
    this.setup = this.tokens.TWITCH_TOKEN != "" && this.tokens.TWITCH_USERNAME != "";
    if (this.setup) {
      this.setupClient();
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
    this.emoteCounts = this.emoteCounts > 0 ? this.emoteCounts - 1 : 0;
  }

  logEvent(msg) {
    if (msg.tags == null || msg.tags.emotes == null)
      return;
    let emoteCount = 0;
    for (let emote of msg.tags.emotes) {
      let emoteString = msg.message.substring(emote.start, emote.end + 1);
      console.log(emoteString);
      if (emoteString == "stefan13ROB")
        emoteCount = emoteCount + 1;
    }
    this.emoteCounts = this.emoteCounts + emoteCount;
  }

  renderMissingTokens() {
    return (
      <div className="App">
        <h2>You must add your Twitch tokens to tokens.ts!</h2>
      </div>
    );
  }

  renderRob() {
    // We don't want the Rob to "Go Off" too much, so make sure the scale doesn't go that big.
    let scaleCount = 1 + (this.emoteCounts * .01);
    if (scaleCount > 2.5)
      scaleCount = 2.5;
    let dynStiff = 200 * scaleCount;
    return <Rob initialPose="none" pose={this.emoteCounts > 0 ? "GoOff" : "none"} poseKey={this.emoteCounts}
      dynScale={scaleCount <= 1 ? 1 : scaleCount} dynStiff={dynStiff} className="rob" />
  }

  render() {
    if (!this.setup)
      return this.renderMissingTokens();
    return (
      <div className="App">
        {this.renderRob()}
      </div>
    );
  }
}

export default App;
