import React, { CSSProperties, Component } from 'react';
import Styles from './Premetaljka.module.css'
import IPremetaljka from '../../interfaces/premetaljka.interface';
import TGameNamesForPoints from '../../interfaces/gameNamesForPoints';
import { Dialogs } from 'bv-react-async-dialogs'

interface PremetaljkaProps {
  data: IPremetaljka,
  savePoints: (points: number, game: TGameNamesForPoints) => void
}

interface PremetaljkaState {
  letterBlocks: Array<Array<LetterBlockProps>>
  points: number,
  timeLeft: number,
  chosenLetters: LetterBlockProps[]
}

class Premetaljka extends Component<PremetaljkaProps, PremetaljkaState> {
  constructor(props: PremetaljkaProps) {
    super(props);
    this.timerTick = this.timerTick.bind(this);
    this.chooseLetter = this.chooseLetter.bind(this);
    this.swapLetters = this.swapLetters.bind(this);
    this.checkWords = this.checkWords.bind(this);
    this.endGame = this.endGame.bind(this);
    this.state = {
      letterBlocks: [],
      points: 0,
      timeLeft: 180,
      chosenLetters: []
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
  chooseLetter(letter: LetterBlockProps) {
    let letterBlocks = [...this.state.letterBlocks];
    let chosenLetters = [...this.state.chosenLetters];

    chosenLetters.push(letter);
    letterBlocks[letter.row][letter.col].className = Styles.marker;

    this.setState({
      chosenLetters,
      letterBlocks
    }, () => {
      if(this.state.chosenLetters.length === 2) this.swapLetters()
    })
  }
  swapLetters() {
    let letterBlocks = [...this.state.letterBlocks];
    let chosenLetters = [...this.state.chosenLetters]
    let [first, second] = [...chosenLetters];
    
    letterBlocks[first.row][first.col].letter = second.letter;
    letterBlocks[second.row][second.col].letter = first.letter;
    
    chosenLetters = [];
    letterBlocks = letterBlocks.map((row: LetterBlockProps[]) => {
      return row.map(lb => {
        let isRotating: boolean = (lb.row === first.row && lb.col === first.col) || (lb.row === second.row && lb.col === second.col);
        let rs: LetterBlockProps = {
          row: lb.row,
          col: lb.col,
          letter: lb.letter,
          rotateX: isRotating ? lb.rotateX + 360 : lb.rotateX,
          onClick: lb.onClick,
          className: lb.className === Styles.greenLetterBlock ? lb.className : undefined
        };
        return rs;
      })
    })

    this.setState({
      letterBlocks,
      chosenLetters
    }, this.checkWords)
  }
  checkWords() {
    let points = this.state.points;
    let firstWord = this.state.letterBlocks[0].map(lb => lb.letter).join('');
    let secondWord = this.state.letterBlocks[1].map(lb => lb.letter).join('');
    let thirdWord = this.state.letterBlocks[2].map(lb => lb.letter).join('');
    let letterBlocks = [...this.state.letterBlocks];

    if(firstWord === this.props.data.firstWord && !letterBlocks[0][0].className) {
      points += firstWord.length;
      letterBlocks[0] = letterBlocks[0].map(lb => {
        let rs = {...lb};
        rs.className = Styles.greenLetterBlock;
        rs.rotateX += 360;
        return rs;
      })
    }
    if(secondWord === this.props.data.secondWord && !letterBlocks[1][0].className) {
      points += secondWord.length;
      letterBlocks[1] = letterBlocks[1].map(lb => {
        let rs = {...lb};
        rs.className = Styles.greenLetterBlock;
        rs.rotateX += 360;
        return rs;
      })
    }
    if(thirdWord === this.props.data.thirdWord && !letterBlocks[2][0].className) {
      points += thirdWord.length;
      letterBlocks[2] = letterBlocks[2].map(lb => {
        let rs = {...lb};
        rs.className = Styles.greenLetterBlock;
        rs.rotateX += 360;
        return rs;
      })
    };
    this.setState({
      letterBlocks,
      points
    }, () => {
      if(firstWord === this.props.data.firstWord && secondWord === this.props.data.secondWord && thirdWord === this.props.data.thirdWord){
        this.endGame()
      }
    })
  }
  async endGame() {
    let letterBlocks = [...this.state.letterBlocks];
    let points = this.state.points === 25 ? 35 : this.state.points;
    let firstWord = this.state.letterBlocks[0].map(lb => lb.letter).join('');
    let secondWord = this.state.letterBlocks[1].map(lb => lb.letter).join('');
    let thirdWord = this.state.letterBlocks[2].map(lb => lb.letter).join('');

    if(firstWord !== this.props.data.firstWord) {
      letterBlocks[0] = this.props.data.firstWord.split('').map((l, i) => {
        let rs: LetterBlockProps = {
          row: 0,
          col: i,
          letter: l,
          onClick: this.chooseLetter,
          rotateX: letterBlocks[0][i].rotateX + 360,
          className: Styles.redLetterBlock
        };
        return rs;
      })
    }
    if(secondWord !== this.props.data.secondWord) {
      letterBlocks[1] = this.props.data.secondWord.split('').map((l, i) => {
        let rs: LetterBlockProps = {
          row: 1,
          col: i,
          letter: l,
          onClick: this.chooseLetter,
          rotateX: letterBlocks[1][i].rotateX + 360,
          className: Styles.redLetterBlock
        };
        return rs;
      })
    }
    if(thirdWord !== this.props.data.thirdWord) {
      letterBlocks[2] = this.props.data.thirdWord.split('').map((l, i) => {
        let rs: LetterBlockProps = {
          row: 2,
          col: i,
          letter: l,
          onClick: this.chooseLetter,
          rotateX: letterBlocks[2][i].rotateX + 360,
          className: Styles.redLetterBlock
        };
        return rs;
      })
    };
    this.setState({
      points,
      letterBlocks,
      timeLeft: 5
    }, () => {
      setTimeout( async () => {
        clearInterval(JSON.parse(window.sessionStorage.getItem('timer-id')!))
        await Dialogs.alert({
          title: 'Kraj igre',
          message: `Osvojeni poeni: ${this.state.points} `,
          className: 'asyncDialog'
        });
        this.props.savePoints(this.state.points, 'premetaljka')
      }, 5000);
    })
  }
  componentDidMount(): void {
    console.log(this.props.data);
    
    let leters = [...this.props.data.letters]
    let letterBlocks = [...this.state.letterBlocks]

    letterBlocks.push(leters.splice(0, this.props.data.firstWord.length).map((l, i) => {
      let lb: LetterBlockProps = {
        row: 0,
        col: i,
        letter: l,
        rotateX: 0,
        onClick: this.chooseLetter,
      };
      return lb;
    }));
    letterBlocks.push(leters.splice(0, this.props.data.secondWord.length).map((l, i) => {
      let lb: LetterBlockProps = {
        row: 1,
        col: i,
        letter: l,
        rotateX: 0,
        onClick: this.chooseLetter,
      };
      return lb;
    }));
    letterBlocks.push(leters.splice(0, this.props.data.thirdWord.length).map((l, i) => {
      let lb: LetterBlockProps = {
        row: 2,
        col: i,
        letter: l,
        rotateX: 0,
        onClick: this.chooseLetter,
      };
      return lb;
    }));
    this.setState({
      letterBlocks
    })
  }
  render() {
    return (
      <div className={Styles.root}>
        <div className={Styles.timeCounter}>{this.state.timeLeft}</div>
        {this.state.letterBlocks.map((row, index) => {
          return <div key={`row-${index}`} className={Styles.container}>{
            row.map(l =>{
              return <LetterBlock 
                key={`${l.row}-${l.col}`}
                row={l.row}
                col={l.col}
                letter={l.letter}
                rotateX={l.rotateX}
                onClick={l.onClick}
                className={l.className}
              />
            })
          }</div>
        })}
      </div>
    );
  }
}

interface LetterBlockProps {
  row: number,
  col: number,
  letter: string,
  rotateX: number,
  onClick: (letter: LetterBlockProps) => void,
  className? : string,
}

const LetterBlock = (props: LetterBlockProps) => {
  let className = `${Styles.letterBlock} ${props.className}`;
  const style: CSSProperties = {
    transform: `rotateX(${props.rotateX}deg)`
  }
  return <button 
    className={className}
    style={style}
    onClick={() => {
      if(props.className !== undefined) return;
      props.onClick(props)
  }}>{props.letter}</button>
}
export default Premetaljka;
