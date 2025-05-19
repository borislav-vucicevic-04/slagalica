import React, { Component } from 'react';
import Styles from './MojBroj.module.css'
import IMojBroj from '../../interfaces/mojBroj.interface';
import TGameNamesForPoints from '../../interfaces/gameNamesForPoints';
import BckSpcIcon from './../../images/mojBroj/backspace.svg'
import {Dialogs} from 'bv-react-async-dialogs'

interface MojBrojProps {
  data: IMojBroj,
  savePoints: (points: number, game: TGameNamesForPoints) => void
}

interface MojBrojState {
  numbers: BtnProps[],
  expressionParts: Array<number | string>,
  timeLeft: number,
}

class MojBroj extends Component<MojBrojProps, MojBrojState> {
  constructor(props: MojBrojProps) {
    super(props)
    this.timerTick = this.timerTick.bind(this);
    this.chooseNumber = this.chooseNumber.bind(this);
    this.chooseOperation = this.chooseOperation.bind(this);
    this.backspace = this.backspace.bind(this);
    this.generateExpression = this.generateExpression.bind(this);
    this.generateResult = this.generateResult.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      numbers: [],
      expressionParts: [],
      timeLeft: 90
    }
    window.sessionStorage.setItem("timer-id", JSON.stringify(setInterval(this.timerTick, 1000)));
  }
  timerTick() {
    let timeLeft = this.state.timeLeft;
    if(timeLeft === 0) this.submit();
    else {
      --timeLeft;
      this.setState({timeLeft})
    }
  }
  chooseNumber(index: string | number) {
    index = Number(index);
    let chosen = {...this.state.numbers[index]};
    let numbers = [...this.state.numbers];
    let expressionParts = [...this.state.expressionParts];

    if(typeof expressionParts[expressionParts.length-1] === 'number') return;

    expressionParts.push(chosen.index);
    chosen.disabled = true;
    numbers.splice(index, 1, chosen);

    this.setState({
      expressionParts,
      numbers,
    })
  }
  chooseOperation(content: string | number) {
    let expressionParts = [...this.state.expressionParts];
    content = content.toString();
    if(content === '+' || content === '-' || content === '*' || content === '/') {
      let lastPart = expressionParts[expressionParts.length-1]
      if(typeof lastPart === 'string' && lastPart !== '(' && lastPart !== ')') return;
    }
    expressionParts.push(content.toString());
    this.setState({
      expressionParts
    })
  }
  backspace() {
    let expressionParts = [...this.state.expressionParts];
    let numbers = [...this.state.numbers];
    let removed = expressionParts.pop();

    if(typeof removed === 'number') {
      numbers[removed].disabled = false;
    }

    this.setState({
      expressionParts, 
      numbers
    })
  }
  generateExpression() {
    let expressionParts = this.state.expressionParts;
    let numbers = this.state.numbers;
    let expression = expressionParts.map(item => {
      if(typeof item === 'string') return item;
      else return numbers[item].content
    }).join('');
    return expression;
  }
  generateResult() {
    let rs: any = '!?'
    try {
      let expression = this.generateExpression();
      rs = eval(expression)
    } 
    catch (error) {
      rs = '!?'
    }
    finally {
      return rs
    }
  }
  async submit() {
    clearInterval(JSON.parse(window.sessionStorage.getItem('timer-id')!))
    let wantedNumber = this.props.data.wantedNumber;
    let result = this.generateResult() === '!?' ? 0 : Number(this.generateResult());
    let difference = Math.abs(wantedNumber - result);
    let points = 0;

    if(difference === 0) points = 30;
    else if(difference <= 5) points = 20;
    else if(difference <= 10) points = 10;
    else if (difference <= 20) points = 5;
    else points = 0;

    await Dialogs.alert({
      title: 'Kraj igre:',
      message: `Osvojeni poeni: ${points}`,
      className: 'asyncDialog'
    });
    this.props.savePoints(points, 'moj broj')
  }
  componentDidMount(): void {
    let numbers = this.props.data.givenNumbers.map((n, index) => {
      this.generateExpression = this.generateExpression.bind(this);
      let rs: BtnProps = {
        index,
        content: n,
        disabled: false,
        onClick: this.chooseNumber
      }
      return rs;
    })
    this.setState({
      numbers
    })
  }
  render() {
    return (
      <div className={Styles.root}>
        <div className={Styles.timeCounter}>{this.state.timeLeft}</div>
        <div className={Styles.container}>
          <div className={Styles.wantedNumber}>{this.props.data.wantedNumber}</div>
          {this.state.numbers.map(n => {
              return <Btn 
                key={n.index}
                index={n.index}
                content={n.content}
                disabled={n.disabled}
                onClick={n.onClick}
              />
          })}
          <Btn onClick={this.chooseOperation} index={-1} content={'+'} disabled={false} />
          <Btn onClick={this.chooseOperation} index={-1} content={'-'} disabled={false} />
          <Btn onClick={this.chooseOperation} index={-1} content={'*'} disabled={false} />
          <Btn onClick={this.chooseOperation} index={-1} content={'/'} disabled={false} />
          <Btn onClick={this.chooseOperation} index={-1} content={'('} disabled={false} />
          <Btn onClick={this.chooseOperation} index={-1} content={')'} disabled={false} />
          <div className={`${Styles.button} ${Styles.resultContainer}`}>{
            this.generateResult()
          }</div>
          <div className={`${Styles.button} ${Styles.expressionContainer}`}>
            {this.generateExpression()}
          </div>
          <button className={`${Styles.button} ${Styles.backspace}`} onClick={this.backspace}>
            <img src={BckSpcIcon} />
          </button>
          <button className={`${Styles.button} ${Styles.submit}`} onClick={this.submit}>{`potvrdi`}</button>
        </div>
      </div>
    );
  }
}
interface BtnProps {
  index: number,
  content: number | string
  disabled: boolean,
  onClick: (content: number | string) => void
}
const Btn = (props: BtnProps) => {
  return <button 
    className={Styles.button}
    onClick={() => {
    if(props.index === -1) props.onClick(props.content)
    else props.onClick(props.index)
  }} disabled={props.disabled}>{`${props.content}`}</button>
}
export default MojBroj;
