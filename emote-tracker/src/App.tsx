import React, { Component } from 'react';
import './App.css';
import { Tokens } from './tokens';
import Twitch from 'twitch-js';

class App extends Component<any, any> {
  tokens: Tokens = new Tokens();
  client: any;
  setup: boolean = false;
  constructor(props) {
    super(props);
    this.setup = this.tokens.TWITCH_TOKEN != "" && this.tokens.TWITCH_USERNAME != "";
    if (this.setup) {
      this.setupClient();
    }
  }

  async setupClient() {
    const { api, chat, chatConstants } = new Twitch({token: this.tokens.TWITCH_TOKEN, username: this.tokens.TWITCH_USERNAME})
    console.log(chatConstants);
    chat.on(chatConstants.EVENTS.PRIVATE_MESSAGE, (msg) => this.logEvent(msg));
    await chat.connect();
    // Change this to the chat room.
    await chat.join("gooffkings");
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
