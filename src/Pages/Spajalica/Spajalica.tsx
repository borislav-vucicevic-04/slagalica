import React, { Component } from 'react';
import Styles from './Spajalica.module.css'
import ISpajalica from '../../interfaces/spajalica.interface';
import { Dialogs } from 'bv-react-async-dialogs';
import TGameNamesForPoints from '../../interfaces/gameNamesForPoints';

interface SpajalicaProps {
  data: ISpajalica,
  savePoints: (points: number, game: TGameNamesForPoints) => void
}

interface SpajalicaState {
  leftTiles: Array<TileProps>,
  rightTiles: Array<TileProps>,
  step: number,
  timeLeft: number,
  pairs: string[],
  points: number,
}

class Spajalica extends Component<SpajalicaProps, SpajalicaState> {
  constructor(props: SpajalicaProps) {
    super(props)
    this.generateTiles = this.generateTiles.bind(this);
    this.select = this.select.bind(this);
    this.timerTick = this.timerTick.bind(this);
    this.endGame = this.endGame.bind(this);
    this.state = {
      leftTiles: [],
      rightTiles: [],
      step: 0,
      timeLeft: 90,
      pairs: props.data.pairs,
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
  generateTiles(): React.ReactNode {
    let tiles: React.ReactNode[] = [];

    for(let i = 0; i < this.state.leftTiles.length; i++) {
      let lt = this.state.leftTiles[i];
      let rt = this.state.rightTiles[i];
      tiles.push(<Tile key={`l-${i}`} text={lt.text} index={lt.index} className={lt.className} />);
      tiles.push(<Tile key={`r-${i}`} text={rt.text} index={rt.index} className={rt.className} callback={rt.callback}/>);
    }
    return tiles;
  }
  select(index: number): void {
    let step = this.state.step;
    let leftTiles = this.state.leftTiles;
    let rightTiles = this.state.rightTiles;
    let pairs = this.state.pairs;
    let points = this.state.points
    let l = leftTiles[step].text;
    let r = rightTiles[index].text;

    for(let i = 0; i < leftTiles.length; i++) {
      if(leftTiles[i].className === Styles.marker){
        leftTiles[i].className = undefined;
        break;
      }
    }

    if(pairs.includes(`${l}-${r}`)){
      points += 4;
      leftTiles[step].className = Styles.leftCorrect;
      rightTiles[index].className = Styles.rightCorrect;
      rightTiles[index].callback = undefined;
      pairs = pairs.filter(item => item !== `${l}-${r}`);
    }
    else {
      leftTiles[step].className = Styles.wrong;
    }
    step++;
    if(step < leftTiles.length) leftTiles[step].className = Styles.marker;
    this.setState({
      leftTiles,
      rightTiles,
      pairs,
      points,
      step
    }, () => {
      if(this.state.step >= this.state.leftTiles.length) this.endGame();
    })
  }
  async endGame() {
    clearInterval(JSON.parse(window.sessionStorage.getItem('timer-id')!))
    let pairs = this.state.pairs;
    let points = this.state.points;
    points += pairs.length === 0 ? 2 : 0;
    let message = `Osvojeni poeni: ${points}<br>`;
    message += 'Nepogođene spajalice:<ul>'
    pairs.forEach(item => message += `<li>${item}`);
    message += '</ul>'
    await Dialogs.alert({
      title: "Kraj igre",
      message,
      className: "asyncDialog",
    });
    this.props.savePoints(points, 'spajalica');
  }
  static async showClippedText(text: string) {
    await Dialogs.alert({
      title: "Tekst spajalice",
      message: text,
      className: 'asyncDialog'
    })
  }
  componentDidMount(): void {
    let leftTiles: Array<TileProps> = [];
    let rightTiles: Array<TileProps> = [];
    for(let i = 0; i < this.props.data.left.length; i++) {
      leftTiles.push({
        text: this.props.data.left[i],
        index: i
      });
      rightTiles.push({
        text: this.props.data.right[i],
        index: i,
        callback: this.select
      });
    }
    leftTiles[this.state.step].className = Styles.marker;
    this.setState({
      leftTiles,
      rightTiles
    })
  }
  render() {
    return (
      <div className={Styles.root}>
        <div className={Styles.timeCounter}>{this.state.timeLeft}</div>
        <div className={Styles.description}
          onContextMenu={(e) => {
            e.preventDefault();
            Spajalica.showClippedText(this.props.data.description)
          }}
        >{this.props.data.description}</div>
        {this.generateTiles()}
      </div>
    );
  }
}

interface TileProps {
  text: string,
  index: number,
  className?: string,
  callback?: (index: number) => void
}

const Tile = (props: TileProps) => {
  let className = props.className || '';
  return <button className={`${Styles.tile} ${className}`}
    onClick={() => {
      if(!props.callback) return;
      props.callback(props.index)
    }}
    onContextMenu={(e) => {
      e.preventDefault();
      Spajalica.showClippedText(props.text)
    }}
  >{props.text}</button>
}
export default Spajalica;
