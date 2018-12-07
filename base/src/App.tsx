import React, { Component } from 'react';
import './App.css';
import { Tokens } from './tokens';
import Twitch from 'twitch-js';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { find } from 'lodash';

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
    // Add cooldown
  }

  logEvent(msg) {
    console.log(msg);
  }

  renderMissingTokens() {
    return (
      <div className="App">
        <h2>You must add your Twitch tokens to tokens.ts!</h2>
      </div>
    );
  }

  render() {
    if (!this.setup)
      return this.renderMissingTokens();
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
