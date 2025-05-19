import React, { Component } from 'react';
import Styles from './Slagalica.module.css'
import ISlagalica from '../../interfaces/slagalica.interface';
import { Dialogs } from 'bv-react-async-dialogs';
import TGameNamesForPoints from '../../interfaces/gameNamesForPoints';

interface SlagalicaProps {
  data: ISlagalica,
  savePoints: (a: number, b: TGameNamesForPoints) => void
}

interface SlagalicaState {
  computerWord: string,
  letters: string[],
  userLetters: string[],
  timeLeft: number
}

class Slagalica extends Component<SlagalicaProps, SlagalicaState> {
  constructor(props: SlagalicaProps) {
    super(props)
    this.chooseLetter = this.chooseLetter.bind(this);
    this.deleteLetter = this.deleteLetter.bind(this);
    this.submitWord = this.submitWord.bind(this);
    this.timerTick = this.timerTick.bind(this);
    this.state = {
      computerWord: props.data.computerWord,
      letters: props.data.letters,
      userLetters: [],
      timeLeft: 90
    }
    window.sessionStorage.setItem("timer-id", JSON.stringify(setInterval(this.timerTick, 1000)));
  }
  timerTick() {
    let timeLeft = this.state.timeLeft;
    if(timeLeft === 0) this.submitWord();
    else {
      --timeLeft;
      this.setState({timeLeft})
    }
  }
  chooseLetter(index: number) {
    let letters = this.state.letters;
    let userLetters = this.state.userLetters;

    userLetters.push(letters.splice(index, 1)[0]);
    this.setState({
      letters,
      userLetters
    })
  }
  deleteLetter(index: number) {
    let letters = this.state.letters;
    let userLetters = this.state.userLetters;

    letters.push(userLetters.splice(index, 1)[0]);
    this.setState({
      letters,
      userLetters
    })
  }
  async submitWord() {
    let words = require('./../../database/searbian-words-db.json') as string[];
    let userWord = this.state.userLetters.join('');
    let computerWord = this.state.computerWord;
    let message = '';
    let points = 0;

    if(words.includes(userWord)) {
      points += userWord.length * 2;
      message = "Vaša riječ je ispravna!";
      if(userWord.length >= computerWord.length) points += 6;
    }
    else {
      points = 0;
      message = "Vaša riječ nije ispravna!";
    }
    message += `
      <ul>
        <li>Vaša riječ: ${userWord.toUpperCase()}
        <li>Naša riječ: ${computerWord.toUpperCase()}
        <li>Osvojeni poeni: ${points}
      </ul>
    `
    clearInterval(JSON.parse(window.sessionStorage.getItem('timer-id')!))
    await Dialogs.alert({
      title: 'Kraj igre',
      message: message,
      className: 'asyncDialog'
    });
    this.props.savePoints(points, 'slagalica')
  }
  render() {
    return (
      <div className={Styles.root}>
        <div className={Styles.timeCounter}>{this.state.timeLeft}</div>
        <div className={`${Styles.container} ${Styles.ponudjenaSlova}`}>{
          this.state.letters.map((item, index) => {
            return <LetterBlock key={index} index={index} letter={item} onClick={this.chooseLetter} />
          })
        }</div>
        <div className={`${Styles.container} ${Styles.vasaRec}`}>{
          this.state.userLetters.map((item, index) => {
            return <LetterBlock key={index} index={index} letter={item} onClick={this.deleteLetter} />
          })
        }</div>
        <button className={Styles.submitButton} onClick={this.submitWord}> potvrdi</button>
      </div>
    );
  }
}

const LetterBlock = (props: {index: number, letter: string, onClick: (index: number) => void}) => {
  return <button className={Styles.letterBlock} onClick={() => {
    props.onClick(props.index)
  }}>{props.letter}</button>
}

export default Slagalica;
