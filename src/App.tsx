import React, { Component } from 'react'
import Styles from './App.module.css'
//interfaces
import IGame from './interfaces/game.interface';
import TGameNamesForPoints from './interfaces/gameNamesForPoints'
//helper functions
import { generateGame } from './helperFunctions/helperFunctions';
// Dialogs
import { Dialogs } from 'bv-react-async-dialogs';
//Pages
import ControlPanel from './Pages/ControlPanel/ControlPanel'
import Slagalica from './Pages/Slagalica/Slagalica';
import Spajalica from './Pages/Spajalica/Spajalica';
import DesnoLijevo from './Pages/DesnoLijevo/DesnoLijevo';
import Zid from './Pages/Zid/Zid';
import Asocijacije from './Pages/Asocijacije/Asocijacije';
import Premetaljka from './Pages/Premetaljka/Premetaljka';
import Parovi from './Pages/Parovi/Parovi';
import MojBroj from './Pages/MojBroj/MojBroj';
import PutOkoSvijeta from './Pages/PutOkoSvijeta/PutOkoSvijeta';
import Sef from './Pages/Sef/Sef';
import Instructions from './Pages/Instructions/Instructions';

interface AppState {
  element: React.ReactNode,
  game: IGame,
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

export default class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    const points = {
      "slagalica": 0,
      "moj broj": 0,
      "spajalica": 0,
      "parovi": 0,
      "desno - lijevo": 0,
      "sef": 0,
      "zid": 0,
      "put oko svijeta": 0,
      "asocijacije": 0,
      "premetaljka": 0,
    }
    this.openPage = this.openPage.bind(this);
    this.savePoints = this.savePoints.bind(this);
    
    this.state = {
      game: generateGame(),
      element: <ControlPanel points={points} openPage={this.openPage}/>,
      points
    }
    // window.addEventListener('beforeunload', (e) => {e.preventDefault()})
  }
  openPage(name: TGameNamesForPoints | 'control-panel' | 'instructions' | '') {
    let element: React.ReactNode | undefined;
    switch(name) {
      case 'control-panel': element = <ControlPanel points={this.state.points} openPage={this.openPage}/>; break;
      case 'instructions': element = <Instructions />; break;
      case 'slagalica': element = <Slagalica savePoints={this.savePoints} data={this.state.game!.slagalica} />; break;
      case 'spajalica': element = <Spajalica savePoints={this.savePoints} data={this.state.game!.spajalica}/>; break;
      case 'desno - lijevo': element = <DesnoLijevo savePoints={this.savePoints} data={this.state.game!.desnoLijevo}/>; break;
      case 'zid': element = <Zid savePoints={this.savePoints} data={this.state.game!.zid}/>; break;
      case 'asocijacije': element = <Asocijacije savePoints={this.savePoints} data={this.state.game!.asocijacije} />; break;
      case 'premetaljka': element = <Premetaljka savePoints={this.savePoints} data={this.state.game!.premetaljka} />; break;
      case 'parovi': element = <Parovi savePoints={this.savePoints} data={this.state.game!.parovi} />; break;
      case 'moj broj': element = <MojBroj savePoints={this.savePoints} data={this.state.game!.mojBroj}/>; break;
      case 'put oko svijeta': element = <PutOkoSvijeta savePoints={this.savePoints} data={this.state.game!.putOkoSvijeta} />; break;
      case 'sef': element = <Sef savePoints={this.savePoints} data={this.state.game!.sef} />; break;
      default: break
    }
    this.setState({
      element
    })
  }
  savePoints(points: number, game: TGameNamesForPoints) {
    let newState = {...this.state};
    newState.points[game] = points;
    this.setState(newState, () => { this.openPage('control-panel') })
  }
  render() {
    return (
      <div className={Styles.App}>{
        this.state.element
      }</div>
    );
  }
}
