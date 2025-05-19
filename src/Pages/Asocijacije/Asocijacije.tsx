import React, { Component } from 'react';
import Styles from './Asocijacije.module.css'
import IAsocijacije from '../../interfaces/asocijacije.interface';
import TGameNamesForPoints from '../../interfaces/gameNamesForPoints';
import { Dialogs } from 'bv-react-async-dialogs';

interface AsocijacijeProps {
  data: IAsocijacije,
  savePoints: (points: number, game: TGameNamesForPoints) => void
}

interface AsocijacijeState {
  wordTiles: TileProps[],
  columnAnswerTiles: TileProps[],
  finalAnswerTile: TileProps,
  points: number,
  timeLeft: number,
  giveUpDisabled: boolean
}

class Asocijacije extends Component<AsocijacijeProps, AsocijacijeState> {
  constructor(props: AsocijacijeProps) {
    super(props)
    this.tileCallback = this.tileCallback.bind(this)
    this.openTile = this.openTile.bind(this);
    this.checkColumnAnswer = this.checkColumnAnswer.bind(this);
    this.checkFinalAnswer = this.checkFinalAnswer.bind(this);
    this.gameWin = this.gameWin.bind(this);
    this.gameDefeat =  this.gameDefeat.bind(this);
    this.timerTick = this.timerTick.bind(this);
    
    this.state = {
      wordTiles: [],
      columnAnswerTiles: [],
      finalAnswerTile: {column: 'f', word: '', callback: () => {}, opened: false},
      points: 0,
      timeLeft: 180,
      giveUpDisabled: false
    }
    window.sessionStorage.setItem("timer-id", JSON.stringify(setInterval(this.timerTick, 1000)));
  }
  timerTick() {
    let timeLeft = this.state.timeLeft;
    if(timeLeft === 0) this.gameDefeat()
    else {
      --timeLeft;
      this.setState({timeLeft})
    }
  }
  static async showClippedText(message: string, column: string, index?: number) {
    await Dialogs.alert({
      title: `Text u polju ${column.toUpperCase()}${index !== undefined ? index+1 : ''}`,
      message,
      className: 'asyncDialog'
    })
  }
  tileCallback(word: string, column: 'a' | 'b' | 'c' | 'd' | 'f', index?: number) {
    if(column === 'f') {
      this.checkFinalAnswer(word)
      return;
    }
    if(index === undefined) {
      this.checkColumnAnswer(word, column)
      return;
    }
    this.openTile(word, column, index)
  }
  openTile(word: string, column: 'a' | 'b' | 'c' | 'd' | 'f', index: number){
    let displacement = 0;

    switch(column){
      case 'a': displacement = 0; break;
      case 'b': displacement = 1; break;
      case 'c': displacement = 2; break;
      case 'd': displacement = 3; break;
      default: break;
    }

    let realIndex = index * 4 + displacement;
    let wordTiles = this.state.wordTiles;
    wordTiles[realIndex].opened = true;
    wordTiles[realIndex].className = Styles.openTile;

    this.setState({wordTiles})
  }
  async checkColumnAnswer(word: string, column: 'a' | 'b' | 'c' | 'd' | 'f') {
    let userWord = (await Dialogs.prompt({
      type: 'string',
      title: `Rješenje kolone ${column.toUpperCase()}:`,
      message: '',
      className: 'asyncDialog noCancelDialog'
    }) as string).toLowerCase();

    if(userWord !== word) return;
    
    let bonus = this.state.wordTiles.filter(t => t.column === column && t.opened === false).length;
    let points = this.state.points + bonus + 5;
    let wordTiles = this.state.wordTiles.map((t) => {
      if(t.column === column){
        t.opened = true;
        t.className = Styles.greenTile
      }
      return t;
    });
    let columnAnswerTiles = this.state.columnAnswerTiles.map(t =>{
      if(t.column === column) {
        t.opened = true;
        t.className = Styles.greenTile
      }
      return t
    });
    this.setState({
      points,
      wordTiles,
      columnAnswerTiles
    })
  }
  async checkFinalAnswer(word: string) {
    let userWord = (await Dialogs.prompt({
      type: 'string',
      title: `Konačno rješenje:`,
      message: '',
      className: 'asyncDialog noCancelDialog'
    }) as string).toLowerCase();

    if(userWord !== word) return;
    let bonus = this.state.wordTiles.filter(t => t.opened === false).length;
    bonus += this.state.columnAnswerTiles.filter(t => t.opened === false).length * 6;
    let points = this.state.points + bonus + 12;
    let wordTiles = this.state.wordTiles.map((t) => {
      t.opened = true;
      t.className = Styles.greenTile
      return t;
    });
    let columnAnswerTiles = this.state.columnAnswerTiles.map(t =>{
      t.opened = true;
      t.className = Styles.greenTile
      return t
    });
    let finalAnswerTile = {...this.state.finalAnswerTile}
    finalAnswerTile.opened = true;
    finalAnswerTile.className += ' ' +  Styles.greenTile;
    this.setState({
      points,
      wordTiles,
      columnAnswerTiles,
      finalAnswerTile
    }, this.gameWin)
  }
  gameWin() {
    let wordTiles = this.state.wordTiles.map(t => {
      if(!t.opened) {
        t.opened = true;
        t.className += ' ' + Styles.greenTile;
      }
      return t;
    });
    let columnAnswerTiles = this.state.columnAnswerTiles.map(t => {
      if(!t.opened) {
        t.opened = true;
        t.className += ' ' + Styles.greenTile;
      }
      return t;
    });
    let finalAnswerTile = {...this.state.finalAnswerTile};
    finalAnswerTile.opened = true;
    finalAnswerTile.className  += ' ' + Styles.greenTile;

    this.setState({
      wordTiles,
      columnAnswerTiles,
      finalAnswerTile,
      timeLeft: 5,
      giveUpDisabled: true
    }, () =>{setTimeout(async () => {
      clearInterval(JSON.parse(window.sessionStorage.getItem('timer-id')!));
      let points = this.state.points;
      await Dialogs.alert({
        title: 'Pobjeda',
        message: `Svaka čast, pobijedili ste!<br>Osvojeni poeni: ${points}`,
        className: 'asyncDialog'
      });
      this.props.savePoints(points, 'asocijacije');
    }, 5000)});
  }
  gameDefeat() {
    let points = this.state.points
    let message = `Na žalost, izgubili ste!<br>Osvojeni poeni: ${points}<br>`;
    message += `Konačno rješenje: ${this.state.finalAnswerTile.word}<br>`;
    let wordTiles = this.state.wordTiles.map(t => {
      if(!t.opened) {
        t.opened = true;
      }
      if(!t.className?.includes(Styles.greenTile)) {
        t.className += ' ' + Styles.redTile;
      }
      return t;
    });
    let columnAnswerTiles = this.state.columnAnswerTiles.map(t => {
      if(!t.opened) {
        t.opened = true;
        message += `Rješenje kolone ${t.column.toUpperCase()}: ${t.word}<br>`
      }
      if(!t.className?.includes(Styles.greenTile)) {
        t.className += ' ' + Styles.redTile;
      }
      return t;
    });
    let finalAnswerTile = {...this.state.finalAnswerTile};
    finalAnswerTile.opened = true;
    finalAnswerTile.className  += ' ' + Styles.redTile;

    this.setState({
      wordTiles,
      columnAnswerTiles,
      finalAnswerTile,
      timeLeft: 5,
      giveUpDisabled: true
    }, () =>{setTimeout(async () => {
      clearInterval(JSON.parse(window.sessionStorage.getItem('timer-id')!));
      let points = this.state.points;
      await Dialogs.alert({
        title: 'Poraz',
        message,
        className: 'asyncDialog'
      });
      this.props.savePoints(points, 'asocijacije');
    }, 5000)});
  }
  componentDidMount(): void {
    let wordTiles = this.state.wordTiles;
    let columnAnswerTiles = this.state.columnAnswerTiles;
    let finalAnswerTile = this.state.finalAnswerTile;
    for(let i = 0, numberOfWords = 4; i < numberOfWords; i++) {
      wordTiles.push({
        column: 'a',
        index: i,
        word: this.props.data.a.words[i],
        callback: this.tileCallback,
        opened: false
      });
      wordTiles.push({
        column: 'b',
        index: i,
        word: this.props.data.b.words[i],
        callback: this.tileCallback,
        opened: false
      });
      wordTiles.push({
        column: 'c',
        index: i,
        word: this.props.data.c.words[i],
        callback: this.tileCallback,
        opened: false
      });
      wordTiles.push({
        column: 'd',
        index: i,
        word: this.props.data.d.words[i],
        callback: this.tileCallback,
        opened: false,
      });
    }
    columnAnswerTiles.push({
      column: 'a',
      word: this.props.data.a.answer,
      callback: this.tileCallback,
      opened: false
    });
    columnAnswerTiles.push({
      column: 'b',
      word: this.props.data.b.answer,
      callback: this.tileCallback,
      opened: false,
    });
    columnAnswerTiles.push({
      column: 'c',
      word: this.props.data.c.answer,
      callback: this.tileCallback,
      opened: false
    });
    columnAnswerTiles.push({
      column: 'd',
      word: this.props.data.d.answer,
      callback: this.tileCallback,
      opened: false
    });
    finalAnswerTile = {
      column: 'f',
      word: this.props.data.finalAnswer,
      callback: this.tileCallback,
      className: Styles.finalAnswerTile,
      opened: false
    }
    this.setState({
      wordTiles,
      columnAnswerTiles,
      finalAnswerTile
    })
  }
  render() {
    return (
      <div className={Styles.root}>
        <button className={Styles.giveUpBtn} onClick={this.gameDefeat} disabled={this.state.giveUpDisabled}>{'odustani'}</button>
        <div className={Styles.timeCounter}>{this.state.timeLeft}</div>
        {this.state.wordTiles.map(t => {
          return <Tile 
            key={`${t.column}${t.index !== undefined ? t.index + 1 : ''}`}
            column={t.column}
            index={t.index}
            word={t.word}
            callback={t.callback}
            className={t.className}
            opened={t.opened}
          />
        })}
        {this.state.columnAnswerTiles.map(t => {
          return <Tile 
            key={`${t.column}${t.index !== undefined ? t.index + 1 : ''}`}
            column={t.column}
            index={t.index}
            word={t.word}
            callback={t.callback}
            opened={t.opened}
            className={t.className}
          />
        })}
        <Tile 
          column={this.state.finalAnswerTile.column}
          index={this.state.finalAnswerTile.index}
          word={this.state.finalAnswerTile.word}
          callback={this.state.finalAnswerTile.callback}
          className={this.state.finalAnswerTile.className}
          opened={this.state.finalAnswerTile.opened}
        />
      </div>
    );
  }
}

interface TileProps {
  column: 'a' | 'b' | 'c' | 'd' | 'f',
  index?: number,
  word: string,
  callback: (word: string, column: 'a' | 'b' | 'c' | 'd' | 'f', index?: number) => void,
  className?: string,
  opened: boolean
}
const Tile = (props: TileProps) => {
  let className = props.className;
  let buttonText = props.opened ? props.word : `${props.column !== 'f' ? props.column : 'konačan odgovor'}${props.index !== undefined ? props.index + 1 : ''}`
  return <button
    className={`${Styles.tile} ${className}`}
    onClick={() => {
      if(props.opened) return
      props.callback(props.word, props.column, props.index)
    }}
    onContextMenu={(e) => {
      e.preventDefault();
      if(!props.opened) return;
      Asocijacije.showClippedText(props.word, props.column, props.index);
    }}
  >{buttonText}</button>
}
export default Asocijacije;
