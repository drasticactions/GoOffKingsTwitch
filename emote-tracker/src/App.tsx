import React, { Component } from 'react';
import './App.css';
import { Tokens } from './tokens';
import Twitch from 'twitch-js';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { find } from 'lodash';

class EmoteCount {
  id: number;
  @observable count: number;
}

@observer
class App extends Component<any, any> {
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
    const { api, chat, chatConstants } = new Twitch({ token: this.tokens.TWITCH_TOKEN, username: this.tokens.TWITCH_USERNAME })
    console.log(chatConstants);
    chat.on(chatConstants.EVENTS.PRIVATE_MESSAGE, (msg) => this.logEvent(msg));
    await chat.connect();
    // Change this to the chat room.
    await chat.join("gooffkings");
  }

  logEvent(msg) {
    if (msg.tags == null || msg.tags.emotes == null)
      return;
    for (let emote of msg.tags.emotes) {
      let emoteTag = find(this.emoteCounts, { id: emote.id })
      if (emoteTag == null) {
        this.emoteCounts.push({
          id: emote.id,
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

  render() {
    if (!this.setup)
      return this.renderMissingTokens();
    return (
      <div className="App">
        {this.emoteCounts.map(u => <p>{`${u.id} - ${u.count}`}</p>)}
      </div>
    );
  }
}

export default App;
