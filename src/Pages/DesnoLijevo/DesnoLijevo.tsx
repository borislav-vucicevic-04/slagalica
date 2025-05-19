import React, { Component } from 'react';
import Styles from './DesnoLijevo.module.css'
import IDesnoLijevo from '../../interfaces/desnoLijevo.interface';
import TGameNamesForPoints from '../../interfaces/gameNamesForPoints';
import { Dialogs } from 'bv-react-async-dialogs';

interface DesnoLijevoProps {
  data: IDesnoLijevo,
  savePoints: (points: number, game: TGameNamesForPoints) => void
}

interface DesnoLijevoState {
  timeLeft: number,
  tiles: TileProps[],
  step: number,
  points: number
}

class DesnoLijevo extends Component<DesnoLijevoProps, DesnoLijevoState> {
  constructor(props: DesnoLijevoProps) {
    super(props);

    this.select = this.select.bind(this);
    this.pushNexPair = this.pushNexPair.bind(this);
    this.endGame = this.endGame.bind(this);
    this.timerTick = this.timerTick.bind(this);
  
    this.state = {
      timeLeft: 50,
      step: 0,
      tiles: [],
      points: 0
    }
    window.sessionStorage.setItem("timer-id", JSON.stringify(setInterval(this.timerTick, 1000)));
  }
  timerTick() {
    let timeLeft = this.state.timeLeft;
    if(timeLeft === 0) this.endGame();
    else {
      --timeLeft;
      this.setState({timeLeft})
    }
  }
  select(text: string, index: number) {
    let tiles = this.state.tiles;
    let step = this.state.step + 1;
    let points = this.state.points;

    if(this.props.data.correct.includes(text)) {
      points += 2;
      tiles[index].className = Styles.correct;
    }
    else {
      tiles[index].className = Styles.wrong;
    }
    this.setState({
      tiles,
      step,
      points
    }, () => {
      if(this.state.step < this.props.data.pairs.length) this.pushNexPair();
      else this.endGame();
    })
  }
  pushNexPair() {
    let tiles = this.state.tiles;
    let step = this.state.step;
    
    this.props.data.pairs[step].forEach((item, index) => {
      tiles.push({
        text: item,
        index: index,
        callback: this.select
      })
    });
    this.setState({
      tiles
    })
  }
  async endGame() {
    clearInterval(JSON.parse(window.sessionStorage.getItem('timer-id')!))
    let points = this.state.points < 14 ? this.state.points : 15;
    let message = `Osvojeni poeni: ${points}<br>`;
    await Dialogs.alert({
      title: "Kraj igre",
      message,
      className: "asyncDialog",
    });
    this.props.savePoints(points, 'desno - lijevo');
  }
  static async showClippedText(text: string) {
    await Dialogs.alert({
      title: "Tekst spajalice",
      message: text,
      className: 'asyncDialog'
    })
  }
  componentDidMount(): void {
    this.pushNexPair();
  }
  render() {
    return (
      <div className={Styles.root}>
        <div className={Styles.timeCounter}>{this.state.timeLeft}</div>
        <div className={Styles.description}
          onContextMenu={(e) => {
            e.preventDefault();
            DesnoLijevo.showClippedText(this.props.data.description);
          }}
        >{this.props.data.description}</div>
        {this.state.tiles.map((item, index) => {
          return <Tile text={item.text} key={index} index={index} className={item.className} callback={item.callback}/> 
        })}
      </div>
    );
  }
}

interface TileProps {
  text: string,
  className?: string,
  callback?: (text: string, index: number) => void,
  index: number
}

const Tile = (props: TileProps) => {
  let className = props.className || '';
  return <button className={`${Styles.tile} ${className}`}
    onClick={() => {
      if(!props.callback) return;
      props.callback(props.text, props.index)
    }}
    onContextMenu={(e) => {
      e.preventDefault();
      DesnoLijevo.showClippedText(props.text);
    }}
  >{props.text}</button>
}

export default DesnoLijevo;
