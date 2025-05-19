import React, { Component } from 'react';
import Styles from './Parovi.module.css'
import IParovi from '../../interfaces/parovi.interface';
import TGameNamesForPoints from '../../interfaces/gameNamesForPoints';
import { Dialogs } from 'bv-react-async-dialogs'

interface ParoviProps {
  data: IParovi,
  savePoints: (points: number, game: TGameNamesForPoints) => void
}

interface ParoviState {
  cards: CardProps[],
  selectedCard?: CardProps,
  timeLeft: number,
  isBoardDiabled: boolean,
  points: number,
}

class Parovi extends Component<ParoviProps, ParoviState> {
  constructor(props: ParoviProps) {
    super(props);
    
    this.openCard = this.openCard.bind(this);
    this.checkPair = this.checkPair.bind(this);
    this.gameWin = this.gameWin.bind(this);
    this.gameDefeat = this.gameDefeat.bind(this);
    this.state = {
      cards: [],
      timeLeft: 12,
      isBoardDiabled: false,
      points: 0
    }
  }
  openCard(card: CardProps) {
    card.opened = true;
    let cards = [...this.state.cards];
    cards.splice(card.index, 1, card);
    if(this.state.selectedCard === undefined) {
      this.setState({
        selectedCard: card,
        cards
      })
    }
    else {
      this.setState({
        cards,
        isBoardDiabled: true
      }, () => { this.checkPair(this.state.selectedCard!, card)})
    }
  }
  checkPair(first: CardProps, second: CardProps) {
    let cards = [...this.state.cards];
    let points = this.state.points;
    let timeLeft = this.state.timeLeft;

    if(first.card === second.card) {
      points += 2;
    }
    else {
      first.opened = second.opened = false;
      cards.splice(first.index, 1, first);
      cards.splice(second.index, 1, second);
      timeLeft--
    }
    setTimeout(() => {
      this.setState({
        cards,
        points,
        isBoardDiabled: false,
        selectedCard: undefined,
        timeLeft
      }, () => {
        if(this.state.cards.filter(c => !c.opened).length === 0) this.gameWin();
        else if(this.state.timeLeft === 0) this.gameDefeat();
      })
    }, 750);
  }
  async gameWin() {
    let points = this.state.points + this.state.timeLeft;
    await Dialogs.alert({
      title: 'Pobjeda',
      message: `Čestitamo, pronašli ste sve parove!<br>Osvojeni poeni: ${points}`,
      className: 'asyncDialog'
    })
    this.props.savePoints(points, 'parovi')
  }
  async gameDefeat() {
    let cards = this.state.cards.map(c => {
      let rs: CardProps = {...c};
      rs.opened = true;
      return rs;
    });
    this.setState({
      cards
    }, async () => {
      setTimeout(async () => {
        let points = this.state.points;
        await Dialogs.alert({
          title: 'Poraz',
          message: `Nažalost niste uspjeli anći sve parove.<br>Osvojeni poeni: ${points}`,
          className: 'asyncDialog'
        })
        this.props.savePoints(points, 'parovi')
      }, 1500);
    })
  }
  componentDidMount(): void {
    let cards: CardProps[] = this.props.data.cards.map((c, index) => {
      let rs: CardProps = {
        card: c,
        opened: false,
        index,
        onClick: this.openCard
      };
      return rs;
    });
    this.setState({
      cards
    })
  }
  render() {
    return (
      <div className={Styles.root}>
        <div className={Styles.timeCounter}>{this.state.timeLeft}</div>
        <div style={{display: this.state.isBoardDiabled ? 'block' : 'none'}} className={Styles.boardDisabler}></div>
        <div className={Styles.board}>{this.state.cards.map(c => {
          return <Card 
            key={c.index}
            card={c.card}
            index={c.index}
            opened={c.opened}
            onClick={c.onClick}
          />
        })}</div>
      </div>
    );
  }
}
interface CardProps {
  card: 'bell' | 'clover' | 'clubs' | 'coin' | 'diamonds' | 'hearts' | 'spades' | 'star',
  opened: boolean,
  index: number,
  onClick: (props: CardProps) => void
}
const Card = (props: CardProps) => {
  let className = ''
  switch(props.opened ? props.card : '') {
    case 'bell': className = Styles.bell; break;
    case 'clover': className = Styles.clover; break;
    case 'clubs': className = Styles.clubs; break;
    case 'coin': className = Styles.coin; break;
    case 'diamonds': className = Styles.diamonds; break;
    case 'hearts': className = Styles.hearts; break;
    case 'spades': className = Styles.spades; break;
    case 'star': className = Styles.star; break;
    default: break;
  }
  return <button 
    className={`${Styles.card} ${className}`}
    disabled={props.opened}
    onClick={() => {props.onClick({...props})}}
  ></button>
}

export default Parovi;
