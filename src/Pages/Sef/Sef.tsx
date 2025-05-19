import React, { Component } from 'react';
import Styles from './Sef.module.css'
import ISef from '../../interfaces/sef.interface';
import TGameNamesForPoints from '../../interfaces/gameNamesForPoints';

// images
import One from './../../images/sef/one.svg';
import Two from './../../images/sef/two.svg';
import Three from './../../images/sef/three.svg';
import Four from './../../images/sef/four.svg';
import Five from './../../images/sef/five.svg';
import Six from './../../images/sef/six.svg';
import { Dialogs } from 'bv-react-async-dialogs';

interface SefProps {
  data: ISef,
  savePoints: (points: number, game: TGameNamesForPoints) => void
}

interface SefState {
  step: number,
  userCodes: number[][],
  signals: ('red' | 'yellow' | 'gray')[][];
  tiles: TileProps[],
  pile: number[],
  timeLeft: number,
}

class Sef extends Component<SefProps, SefState> {
  constructor(props: SefProps) {
    super(props)
    
    let pile: number[] = new Array<number>(6).fill(0);
    const code = props.data.code;
    for(const i in code) {
      pile[code[i]-1]++;
    }
    
    this.timerTick = this.timerTick.bind(this);
    this.generateTable = this.generateTable.bind(this);
    this.chooseSymbol = this.chooseSymbol.bind(this);
    this.clearTile = this.clearTile.bind(this);
    this.submit = this.submit.bind(this);
    this.gameWon = this.gameWon.bind(this);
    this.gameLost = this.gameLost.bind(this);

    this.state = {
      step: 0,
      userCodes: new Array<Array<number>>(6).fill(new Array<number>(4).fill(0)),
      signals: [],
      tiles: [],
      pile,
      timeLeft: 90
    }
    window.sessionStorage.setItem("timer-id", JSON.stringify(setInterval(this.timerTick, 1000)));
  }
  timerTick() {
    let timeLeft = this.state.timeLeft;
    if(timeLeft === 0) this.gameLost();
    else {
      --timeLeft;
      this.setState({timeLeft})
    }
  }
  generateTable() {
    let step = this.state.step;
    let userCodes = [...this.state.userCodes];
    let rs: React.ReactNode[] = [];

    rs = userCodes.map((row, index) => {
      let r = row.map((elem, i) => {
        return <Tile 
          key={`${index}-${i}`}
          digit={elem}
          row={index}
          col={i}
          clearTile={this.clearTile}
          disabled={index !== step}
        />
      });
      r.push(<Indicator key={`submit-btn-${index}`} index={index} onclick={this.submit} signals={this.state.signals[index]} disabled={index !== step} />);

      return r
    })

    return rs;
  }
  chooseSymbol(chosen: number) {
    let step = this.state.step;
    let currentUserCode = [...this.state.userCodes[step]];
    let userCodes = [...this.state.userCodes];

    for (const i in currentUserCode) {
      if(currentUserCode[i] === 0) {
        currentUserCode[i] = chosen;
        break;
      }
    }

    userCodes[step] = currentUserCode;

    this.setState({userCodes})
  }
  clearTile(row: number, col: number) {
    let userCodes = [...this.state.userCodes];
    userCodes[row][col] = 0;
    this.setState({
      userCodes
    })
  }
  submit() {
    const signals = [...this.state.signals];
    let step = this.state.step;
    let currentUserCode = [...this.state.userCodes[step]];
    let code = this.props.data.code;
    let pile = [...this.state.pile];
    let currentSignals: ('red' | 'yellow' | 'gray')[] = [];

    if(currentUserCode.filter(elem => elem === 0).length > 0) return;

    if(currentUserCode.join('') === code.join('')) {
      this.gameWon();
      return;
    }
    
    for(const i in code) {
      if(currentUserCode[i] === code[i] && pile[currentUserCode[i] - 1] > 0){
        currentSignals.push('red');
        pile[currentUserCode[i] - 1]--;
      }
    }

    for(const i in code) {
      if(currentUserCode[i] !== code[i] && pile[currentUserCode[i] - 1] > 0){
        currentSignals.push('yellow');
        pile[currentUserCode[i] - 1]--;
        console.log(code[i], pile[currentUserCode[i] -1]);
      }
    }

    while(currentSignals.length !== 4) {
      currentSignals.push('gray');
    }

    signals.push(currentSignals);
    step++;
    this.setState({
      step,
      signals
    }, () => {
      if(this.state.step >= 6) {
        this.gameLost();
      }
    })
  }
  async gameWon() {
    clearInterval(JSON.parse(window.sessionStorage.getItem('timer-id')!))
    let bonus = (5 - this.state.step) * 5;
    let points = 15 + bonus;

    await Dialogs.alert({
      title: 'Pobjeda',
      message: `Osvojeni poeni: ${points}`,
      className: 'asyncDialog'
    });
    this.props.savePoints(points, 'sef');
  }
  async gameLost() {
    clearInterval(JSON.parse(window.sessionStorage.getItem('timer-id')!))
    let title = 'Poraz';
    let message = `Tačna kombinacija:<br><br><div class=${Styles.dialogCodeContainer}>`;
    let code = this.props.data.code;

    code.forEach(elem => {
      let img = '';
      switch(elem) {
        case 1: img = One; break;
        case 2: img = Two; break;
        case 3: img = Three; break;
        case 4: img = Four; break;
        case 5: img = Five; break;
        case 6: img = Six; break;
        default: break;
      }
      message += `<img src=${img} />`
    });

    message += '</div><br>'

    await Dialogs.alert({
      title,
      message,
      className: 'asyncDialog'
    })
    this.props.savePoints(0, 'sef');
  } 
  render() {
    return (
      <div className={Styles.root}>
        <div className={Styles.timeCounter}>{this.state.timeLeft}</div>
        <div className={Styles.container}>
          {this.generateTable()}
          <div className={Styles.symbolContainer}>
            <button className={Styles.symbol} onClick={() => {this.chooseSymbol(1)}}><img src={One} /></button>
            <button className={Styles.symbol} onClick={() => {this.chooseSymbol(2)}}><img src={Two} /></button>
            <button className={Styles.symbol} onClick={() => {this.chooseSymbol(3)}}><img src={Three} /></button>
            <button className={Styles.symbol} onClick={() => {this.chooseSymbol(4)}}><img src={Four} /></button>
            <button className={Styles.symbol} onClick={() => {this.chooseSymbol(5)}}><img src={Five} /></button>
            <button className={Styles.symbol} onClick={() => {this.chooseSymbol(6)}}><img src={Six} /></button>
          </div>
        </div>
      </div>
    );
  }
}

interface TileProps {
  digit: number,
  row: number,
  col: number,
  disabled: boolean
  clearTile: (row: number, col: number) => void
}

const Tile = (props: TileProps) => {
  let image = '';

  switch(props.digit) {
    case 1: image = One; break;
    case 2: image = Two; break;
    case 3: image = Three; break;
    case 4: image = Four; break;
    case 5: image = Five; break;
    case 6: image = Six; break;
    default: break;
  }

  return <button  className={`${Styles.tile}`} onClick={() => {
    props.clearTile(props.row, props.col)
  }} disabled={props.disabled}>
    <img src={image} style={{display: image !== '' ? 'block' : 'none'}} />
  </button>
}

interface IndicatorProps {
  index: number,
  disabled: boolean,
  signals?: ('red' | 'yellow' | 'gray')[],
  onclick: () => void,
}

const Indicator = (props: IndicatorProps) => {
  return  <div className={Styles.indicator}>
    {
      props.signals === undefined ?
        <button className={Styles.submit} onClick={props.onclick} disabled={props.disabled} />
      :
        props.signals.map((s, i) => {
          let cn = '';
          switch(s) {
            case 'red': cn = Styles.red; break;
            case 'yellow': cn = Styles.yellow; break;
            case 'gray': cn = Styles.gray; break;
            default: break;
          }
          return <div key={`signal-${props.index}-${i}-${s}`} className={`${Styles.signal} ${cn}`} />
        })
    }
  </div>
}

export default Sef;