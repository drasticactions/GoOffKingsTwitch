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

const Rob = posed.div({
  GoOff: {
    scale: ({i}) => i,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 0
    },
    props: { i: 1 }
  }
})

@observer
class App extends Component<any, any> {
  cooldownTimer;
  tokens: Tokens = new Tokens();
  client: any;
  setup: boolean = false;
  @observable emoteCounts: number = 1.16;

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
    // if (this.emoteCounts > 0)
    //   this.emoteCounts = this.emoteCounts - 1;
  }

  logEvent(msg) {
    console.log(msg);
    if (msg.tags == null || msg.tags.emotes == null)
      return;
    // TODO: Check for Rob specific emotes;
    this.emoteCounts = this.emoteCounts + msg.tags.emotes.length;
    console.log(this.emoteCounts);
  }

  renderMissingTokens() {
    return (
      <div className="App">
        <h2>You must add your Twitch tokens to tokens.ts!</h2>
      </div>
    );
  }

  renderRob() {
    let scaleCount = 1 + (this.emoteCounts * .01);
    console.log(scaleCount);
    return <Rob initialPose="none" pose="GoOff" i={scaleCount <= 1 ? 1 : this.emoteCounts} className="rob" />
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
