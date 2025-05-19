import React, { Component } from 'react';
import Styles from './Zid.module.css'
import IZid from '../../interfaces/zid.interface';
import TGameNamesForPoints from '../../interfaces/gameNamesForPoints';
import { Dialogs, OptionTypes } from 'bv-react-async-dialogs';

interface ZidProps {
  data: IZid,
  savePoints: (points: number, game: TGameNamesForPoints) => void
}

interface ZidState {
  positivePoints: number,
  negativePoints: number,
  bonusPoints: number,
  timeLeft: number,
  bricks: BrickProps[]
}

class Zid extends Component<ZidProps, ZidState> {
  constructor(props: ZidProps) {
    super(props)
    
    this.openBrick = this.openBrick.bind(this);
    this.personName = this.personName.bind(this);
    this.gameWin = this.gameWin.bind(this);
    this.gameLost = this.gameLost.bind(this);
    this.timerTick = this.timerTick.bind(this);
    this.state = {
      positivePoints: 0,
      negativePoints: 0,
      bonusPoints: 48,
      timeLeft: 180,
      bricks: [],
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
  async openBrick(index: number, question: string, answers: string[], correctAnswer: string): Promise<void> {
    let userAnswer = await Dialogs.select({
      title: question,
      message: '',
      choiceList: answers,
      multiselect: false,
      className: `asyncDialog ${Styles.dialogBox}`
    }) as string;
    let bricks = this.state.bricks;
    let positivePoints = this.state.positivePoints;
    let negativePoints = this.state.negativePoints;
    let bonusPoints = this.state.bonusPoints;
    let title: string = '';
    let message: string = '';
    let className: string = 'asyncDialog';
    if(userAnswer === correctAnswer) {
      positivePoints += 3;
      bonusPoints -= 4;
      bricks[index].index = undefined;
      bricks[index].className = Styles.broken;
      title = 'Tačan odgovor';
      message = 'Čestitam odgovorili ste tačno na pitanje.<br/>Cigla se ruši!';
    }
    else {
      negativePoints += 1;
      bonusPoints -= 4;
      bricks[index].index = undefined;
      bricks[index].className = Styles.blocked;
      title = 'Netačan odgovor';
      message = `Odgovorili ste netačno na pitanje.<br/>Tačan odgovor: ${correctAnswer}<br/>Cigla se blokira!`;
    }
    await Dialogs.alert({
      title,
      message,
      className
    })
    this.setState({
      positivePoints,
      negativePoints,
      bonusPoints,
      bricks
    })
  }
  async personName() {
    let settings: OptionTypes.IPromptStringOptions = {
      type: 'string',
      title: "Odgovor:",
      message: '',
      className: `asyncDialog ${Styles.dialogBox}`
    } 
    let personName = (await Dialogs.prompt(settings))!.toLowerCase();
    if(personName === this.props.data.famousPerson) this.gameWin();
  }
  async gameWin() {
    clearInterval(JSON.parse(window.sessionStorage.getItem('timer-id')!))
    let positivePoints = this.state.positivePoints;
    let negativePoints = this.state.negativePoints;
    let bonusPoints = this.state.bonusPoints;
    let totalPoints = positivePoints - negativePoints + bonusPoints;
    let message = `Svaka čast! Pogodili ste ko se krije iza zida. <br> Osvojeni poeni: ${totalPoints}`;
    await Dialogs.alert({
      title: 'Pobjeda',
      message,
      className: 'asyncDialog'
    })
    this.props.savePoints(totalPoints, 'zid');
  }
  async gameLost() {
    clearInterval(JSON.parse(window.sessionStorage.getItem('timer-id')!))
    let positivePoints = this.state.positivePoints;
    let negativePoints = this.state.negativePoints;
    let totalPoints = positivePoints - negativePoints;
    let message = `Nažalost, ali niste uspjeli.<br>Ko se krio iza zida?<br>${this.props.data.famousPerson}<br> Osvojeni poeni: ${totalPoints}`;
    await Dialogs.alert({
      title: 'Poraz',
      message,
      className: 'asyncDialog'
    })
    this.props.savePoints(totalPoints, 'zid');
  }
  componentDidMount(): void {
    let bricks: BrickProps[] = this.props.data.bricks.map((item, index) => {
      return {
        index,
        question: item.question,
        answers: item.answers,
        correctAnswer: item.correctAnswer,
        openBrick: this.openBrick
      }
    })

    this.setState({bricks})
  }
  render() {
    return (
      <div className={Styles.root}>
        <div className={Styles.timeCounter}>{this.state.timeLeft}</div>
        <div className={Styles.wall} style={{backgroundImage: `url(${this.props.data.imagePath})`}}>
          {this.state.bricks.map(item => {
            return <Brick
              key={item.question}
              index={item.index}
              question={item.question}
              answers={item.answers}
              correctAnswer={item.correctAnswer}
              className={item.className}
              openBrick={item.openBrick}
            ></Brick>
          })}
        </div>
        <button className={Styles.button} onClick={this.personName}>odgovor</button>
        <button className={Styles.button} onClick={() => {
          this.setState({
            timeLeft: 1
          })
        }}>odustani</button>
      </div>
    );
  }
}
interface BrickProps {
  question: string,
  answers: string[],
  correctAnswer: string
  openBrick: (index: number, question: string, answers: string[], correctAnswer: string) => Promise<void>,
  index?: number,
  className?: string
}

const Brick = (props: BrickProps) => {
  let className = `${Styles.brick} ${props.className || ''}`;
  return <button className={className}
    onClick={() => {
      if(props.index === undefined) return;
      props.openBrick(props.index, props.question, props.answers, props.correctAnswer)
    }}
  >{props.index !== undefined ? props.index + 1 : ''}</button>
}
export default Zid;
