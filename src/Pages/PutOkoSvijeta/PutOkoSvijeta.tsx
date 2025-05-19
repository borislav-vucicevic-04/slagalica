import React, { Component } from 'react';
import Styles from './PutOkoSvijeta.module.css'
import IPutOkoSvijeta from '../../interfaces/putOkoSvijeta.interface';
import TGameNamesForPoints from '../../interfaces/gameNamesForPoints';
import { Dialogs } from 'bv-react-async-dialogs';

interface PutOkoSvijetaProps {
  data: IPutOkoSvijeta[],
  savePoints: (points: number, game: TGameNamesForPoints) => void
}

interface PutOkoSvijetaState {
  current: number,
  timeLeft: number,
  points: number,
}

class PutOkoSvijeta extends Component<PutOkoSvijetaProps, PutOkoSvijetaState> {
  constructor(props: PutOkoSvijetaProps) {
    super(props)

    this.timerTick = this.timerTick.bind(this);
    this.giveAnswer = this.giveAnswer.bind(this);
    this.skip = this.skip.bind(this);
    this.next = this.next.bind(this);
    this.end = this.end.bind(this);
  
    this.state = {
      current: 0,
      timeLeft: 150,
      points: 0
    }
    window.sessionStorage.setItem("timer-id", JSON.stringify(setInterval(this.timerTick, 1000)));
  }
  timerTick() {
    let timeLeft = this.state.timeLeft;
    if(timeLeft === 0) this.end();
    else {
      --timeLeft;
      this.setState({timeLeft})
    }
  }
  async giveAnswer() {
    let current = this.state.current;
    let correct = this.props.data[current].country;
    let options = this.props.data[current].options;
    let points = this.state.points;
    let chosen = await Dialogs.select({
      title: 'Ovo je zastava koje države?',
      message: '',
      choiceList: options,
      multiselect: false,
      className: `asyncDialog ${Styles.dialogBox}`
    }) as string;
    if(correct === chosen) {
      points += 4
      await Dialogs.alert({
        title: 'Pogodili ste!',
        message: `Osvojili ste 4 poena.`,
        className: `asyncDialog`
      })
    }
    else {
      points -= 2;
      await Dialogs.alert({
        title: 'Pogriješili ste!',
        message: `Tačan odgovor je <strong>${correct}</strong><br>Igubili ste 2 poena.`,
        className: `asyncDialog`
      })
    }
    this.setState({
      points
    }, this.next)
  }
  async skip() {
    let current = this.state.current;
    let correct = this.props.data[current].country;
    await Dialogs.alert({
      title: 'Preskočili ste ovu državu!',
      message: `Tačan odgovor je <strong>${correct}</strong>`,
      className: `asyncDialog`
    });
    this.next();
  }
  next() {
    let current = this.state.current + 1;
    if(current < this.props.data.length) this.setState({current});
    else this.end();
  }
  async end() {
    clearInterval(JSON.parse(window.sessionStorage.getItem('timer-id')!))
    let points = this.state.points;
    await Dialogs.alert({
      title: 'Kraj igre',
      message: `Osvojeni poeni: ${points}`,
      className: 'asyncDialog'
    })
    this.props.savePoints(points, 'put oko svijeta')
  }
  render() {
    return (
      <div className={Styles.root}>
        <div className={Styles.timeCounter}>{this.state.timeLeft}</div>
        <div className={Styles.flag} style={{backgroundImage: `url(${this.props.data[this.state.current].flag})`}}>
        </div>
        <button className={Styles.button} onClick={this.giveAnswer}>{`odgovori`}</button>
        <button className={Styles.button} onClick={this.skip}>{`preskoči`}</button>
      </div>
    );
  }
}

export default PutOkoSvijeta;
