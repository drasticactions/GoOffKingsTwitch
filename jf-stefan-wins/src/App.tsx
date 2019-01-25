import React, { Component } from 'react';
import './App.css';
import { Tokens } from './tokens';
import Twitch from 'twitch-js';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import posed, { PoseGroup } from 'react-pose';
import { easing } from 'popmotion'


const Rob = posed.div({
  preEnter: {
    opacity: 0
  },
  enter: {
    x: 15,
    opacity: 1,
    delayChildren: 1200,
    staggerChildren: 80,
    transition: {
      opacity: {
        duration: 600,
        ease: easing.linear
      },
      x: { type: 'spring' }
    }
  },
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
  },
  exit: {
    opacity: 0,
    delay: 800,
    staggerChildren: 50,
    transition: {
      opacity: {
        duration: 600,
        ease: easing.linear
      },
      x: { type: 'spring' }
    }
  }
});

const Stefan = posed.div({
  preEnter: {
    x: -250,
    opacity: 0
  },
  enter: {
    x: 15,
    opacity: 1,
    delayChildren: 1200,
    staggerChildren: 80,
    transition: {
      opacity: {
        duration: 600,
        ease: easing.linear
      },
      x: { type: 'spring' }
    }
  },
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
  },
  exit: {
    opacity: 0,
    delay: 800,
    staggerChildren: 50,
    transition: {
      opacity: {
        duration: 600,
        ease: easing.linear
      },
      x: { type: 'spring' }
    }
  }
});

const JF = posed.div({
  preEnter: {
    right: -250,
    opacity: 0
  },
  enter: {
    right: 15,
    opacity: 1,
    delayChildren: 1200,
    staggerChildren: 80,
    transition: {
      opacity: {
        duration: 600,
        ease: easing.linear
      },
      right: { type: 'spring' }
    }
  },
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
  },
  exit: {
    opacity: 0,
    delay: 800,
    staggerChildren: 50,
    transition: {
      opacity: {
        duration: 600,
        ease: easing.linear
      },
      right: { type: 'spring' }
    }
  }
});

@observer
class App extends Component<any, any> {
  cooldownTimer;
  tokens: Tokens = new Tokens();
  client: any;
  setup: boolean = false;
  @observable jfEmoteCount: number = 0;
  @observable stefanEmoteCount: number = 0;
  @observable robEmoteCount: number = 0;
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
    this.jfEmoteCount = this.jfEmoteCount < 1 ? 0 : this.jfEmoteCount * .9;
    this.stefanEmoteCount = this.stefanEmoteCount < 1 ? 0 : this.stefanEmoteCount * .9;
    this.robEmoteCount = this.robEmoteCount < 1 ? 0 : this.robEmoteCount * .9;
  }

  logEvent(msg) {
    if (msg.tags == null || msg.tags.emotes == null)
      return;
    let jfEmoteCount = 0;
    let stefanEmoteCount = 0;
    let robEmoteCount = 0;
    for (let emote of msg.tags.emotes) {
      let emoteString = msg.message.substring(emote.start, emote.end + 1);
      console.log(emoteString);
      if (emoteString == "stefan13JesseWin")
        jfEmoteCount = jfEmoteCount + 1;
      else if (emoteString == "stefan13StefanWin")
        stefanEmoteCount = stefanEmoteCount + 1;
      else if (emoteString == "stefan13Robwhat")
      robEmoteCount = robEmoteCount + 1;
    }
    this.jfEmoteCount = this.jfEmoteCount + jfEmoteCount;
    this.stefanEmoteCount = this.stefanEmoteCount + stefanEmoteCount;
    this.robEmoteCount = this.robEmoteCount + robEmoteCount;
  }

  renderMissingTokens() {
    return (
      <div className="App">
        <h2>You must add your Twitch tokens to tokens.ts!</h2>
      </div>
    );
  }

  renderRob() {
    let scaleCount = 1 + (this.robEmoteCount * .01);
    if (scaleCount > 2.5)
      scaleCount = 2.5;
    let dynStiff = 200 * scaleCount;
    return <Rob initialPose="none" pose={this.robEmoteCount > 0 ? "GoOff" : "none"} key="rob" poseKey={this.robEmoteCount}
      dynScale={scaleCount <= 1 ? 1 : scaleCount} dynStiff={dynStiff} className="rob" />
  }

  renderStefan() {
    let scaleCount = 1 + (this.stefanEmoteCount * .01);
    if (scaleCount > 2.5)
      scaleCount = 2.5;
    let dynStiff = 200 * scaleCount;
    return <Stefan initialPose="none" pose={this.stefanEmoteCount > 0 ? "GoOff" : "none"} key="stefan" poseKey={this.stefanEmoteCount}
      dynScale={scaleCount <= 1 ? 1 : scaleCount} dynStiff={dynStiff} className="stefan" />
  }

  renderJF() {
    let scaleCount = 1 + (this.jfEmoteCount * .01);
    if (scaleCount > 2.5)
      scaleCount = 2.5;
    let dynStiff = 200 * scaleCount;
    return <JF initialPose="none" pose={this.jfEmoteCount > 0 ? "GoOff" : "none"} key="jf" poseKey={this.jfEmoteCount}
      dynScale={scaleCount <= 1 ? 1 : scaleCount} dynStiff={dynStiff} className="jf" />
  }

  render() {
    if (!this.setup)
      return this.renderMissingTokens();
    return (
      <div className="App">
      <PoseGroup preEnterPose="preEnter">
        {this.stefanEmoteCount > 3 && this.renderStefan()}
        {this.jfEmoteCount > 3 && this.renderJF()}
        {this.robEmoteCount > 3 && this.renderRob()}
      </PoseGroup>
      </div>
    );
  }
}

export default App;
