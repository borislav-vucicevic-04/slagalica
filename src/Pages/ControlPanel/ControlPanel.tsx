import React, { Component } from 'react';
import Styles from './ControlPanel.module.css'
import TGameNamesForPoints from '../../interfaces/gameNamesForPoints';
import { Dialogs, OptionTypes } from 'bv-react-async-dialogs';

interface ControlPanelProps {
  openPage: (game: TGameNamesForPoints | 'control-panel' | 'instructions' | '') => void,
  points: {
    "slagalica": number,
    "moj broj": number,
    "spajalica": number,
    "parovi": number,
    "desno - lijevo": number,
    "sef": number,
    "zid": number,
    "put oko svijeta": number,
    "asocijacije": number,
    "premetaljka": number,
  }
}

interface ControlPanelState {
  element?: React.ReactNode,
}

const PLAYED_GAMES: string [] = [];
class ControlPanel extends Component<ControlPanelProps, ControlPanelState> {
  constructor(props: ControlPanelProps) {
    super(props)
    this.showTablePoints =  this.showTablePoints.bind(this);
    this.state = {
      element: undefined,
    }
  }
  async showTablePoints() {
    let message = `<table class="${Styles.tablePoints}">`;
    let total = 0;
    for(const [key, value] of Object.entries(this.props.points)) {
      message += `
        <tr>
          <td>${key}</td>
          <td>${value}</td>
        </tr>
      `
      total += value;
    }
    message += `
      <tr>
        <td><strong>Ukupno</strong></td>
        <td><strong>${total}</strong></td>
      </tr>
    `
    message += `</table>`
    await Dialogs.alert({
      title: 'Poeni',
      message,
      className: 'asyncDialog'
    })
  }
  render() {
    return (
      <div className={Styles.root}>{
        this.state.element ? this.state.element : 
        <div className={Styles.container}>
          <ControlButton text='slagalica' points={this.props.points.slagalica} onClick={this.props.openPage}></ControlButton>
          <ControlButton text='moj broj' points={this.props.points['moj broj']} onClick={this.props.openPage}></ControlButton>
          <ControlButton text='spajalica' points={this.props.points.spajalica} onClick={this.props.openPage}></ControlButton>
          <ControlButton text='parovi' points={this.props.points.parovi} onClick={this.props.openPage}></ControlButton>
          <ControlButton text='desno - lijevo' points={this.props.points['desno - lijevo']} onClick={this.props.openPage}></ControlButton>
          <ControlButton text='sef' points={this.props.points.sef} onClick={this.props.openPage}></ControlButton>
          <ControlButton text='zid' points={this.props.points.zid} onClick={this.props.openPage}></ControlButton>
          <ControlButton text='put oko svijeta' points={this.props.points.asocijacije} onClick={this.props.openPage}></ControlButton>
          <ControlButton text='asocijacije' points={this.props.points.asocijacije} onClick={this.props.openPage}></ControlButton>
          <ControlButton text='premetaljka' points={this.props.points.premetaljka} onClick={this.props.openPage}></ControlButton>
          <button className={Styles.controlBtn} onClick={() => { this.props.openPage('instructions') }} > {`Uputstva`} </button>
          <button className={Styles.controlBtn} onClick={this.showTablePoints}>{`poeni`}</button>
        </div>
      }</div>
    );
  }
}
interface ControlButtonProps {
  text: TGameNamesForPoints, 
  points: number, 
  onClick: (game: TGameNamesForPoints | 'control-panel' | '') => void
}
const ControlButton = (props: ControlButtonProps) =>{
  let className = `${Styles.switchBtn} ${PLAYED_GAMES.includes(props.text) ? Styles.playedGame : ''}`
  return <button
    className={className}
    onClick={() => {
      if(PLAYED_GAMES.includes(props.text)) return;
      PLAYED_GAMES.push(props.text)
      props.onClick(props.text)
    }}
  >{props.text}</button>
}
export default ControlPanel;
