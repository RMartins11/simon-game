import React from "react";
import { createStore } from "redux";

import { updateInputs, updateController, start, partialS, changeTurnToPlayer, toggleStrict, restart} from "./actions";
import {initialStore, reducer } from "./reducers";
import styles from "./App.css"






//////////////////////////////////////////////////////////////////////App//////////////////////

const store = createStore(reducer);

class App extends React.Component{
  
  componentDidMount () {
    this.unsubscribe = store.subscribe(() => 
      this.forceUpdate()
    );
  }
  
  componentWillUnmount () {
    this.unsubscribe();
  }
  
  
  render() {
    let state = store.getState();
    return(
      <div className={'flex-container-simon'}>
       
        <Color1 
          name="colors-simon t-l" 
          id="tile0" 
          clickable={state.clickable}
          />
        <Color2 
          name="colors-simon t-r" 
          id="tile1"
          clickable={state.clickable}
          />
        <Color3 
          name="colors-simon b-l" 
          id="tile2"
          clickable={state.clickable}
          />
        <Color4 
          name="colors-simon b-r"
          id="tile3"
          clickable={state.clickable}
          />
        <Control 
          name='center-simon' 
          series={state.series} 
          lightUp={state.lightUp}
          turn={state.turn}
          status={state.status}
          partialSeries={state.partialSeries}
          mode={state.strictMode}
          />
      </div>
    )
  }
}

class Color1 extends React.Component {
  onClick = () => {
    if(this.props.clickable) {
      store.dispatch( updateInputs(0) );
    }
  };
  
  render() {
    return (
      <div className={this.props.name} onClick={this.onClick} id={this.props.id}>
        </div>
    )
  }
}

class Color2 extends React.Component{
  onClick = (item) => {
    if(this.props.clickable) {
      store.dispatch( updateInputs(1) );
    }
  };
  
  render() {
    var item = this.props.item;
    return (
      <div className={this.props.name} onClick={this.onClick} id={this.props.id}>
        </div>
    )
  }
}

class Color3 extends React.Component {
  onClick = (item) => {
    if(this.props.clickable) {
      store.dispatch( updateInputs(2) );
    }
  };
  render() {
    var item = this.props.item;
    return (
    <div className={this.props.name} onClick={this.onClick} id={this.props.id}>
        </div>
      )
  }
}

class Color4 extends React.Component {
  onClick = (item) => {
    if(this.props.clickable) {
      store.dispatch( updateInputs(3) );
    }
  };
  render(){
    var item = this.props.item;
    return (
    <div className={this.props.name} onClick={this.onClick} id={this.props.id}>
        </div>
      )
  }
}

class Control extends React.Component {
  
  startGame = () => {
    let first = this.props.series.slice(0,3)
    this.playSeq(first);
    store.dispatch( start() );
    store.dispatch( partialS(first) );
  };
  
  toggle = () => {
    store.dispatch(toggleStrict() );
  };
  
  restart = () => {
    store.dispatch( restart() );
  };
  
  playSeq = (sequence) => {
    let i = 0;
    var interval = setInterval( () => {
      this.props.lightUp(sequence[i]);
      i++;
      if( i >= sequence.length){
        clearInterval(interval);
        store.dispatch( changeTurnToPlayer() );
        store.dispatch( updateController() );
      }
    }, 1200)                         
  };
  
  render() {
    if (this.props.turn === "PlaySeq") {
      this.playSeq(this.props.partialSeries);
    }
    
    return(
      <div className={this.props.name}>   
        <h2 style={{fontSize:"3.5vh", marginTop:"5vh", fontFamily:"monospace"}}>Simon Game</h2>
        <div>
          <h1 className="count-simon" style={{ float: "left" }}>{this.props.partialSeries.length}</h1>
          
        <button className={this.props.status != "Beginning" ? "btn btn-danger disabled" : "btn btn-danger active"} onClick={this.props.status== "Beginning" ? this.startGame : null} style={{float: "left", marginRight:-12, marginLeft:"0.5vh", height:"4vh", width:"7vh",backgroundColor: "#d90404", border:"0.3vh solid black",borderRadius: "10%", fontSize:"2vh", fontFamily:"monospace", fontWeight:"bold"}}>Start </button>
      </div>
      <div> 
        <button
            className={ this.props.mode ? 'led-simon led-on' : 'led-simon' }    
            >  </button>
           
             <button                
                className='round-btn-simon'
                style={{ top: 5 }}
                onClick={ this.toggle }
            >                
           </button>
            <h5 style={{fontSize:"1.55vh", marginTop: 6, fontFamily: "monospace"}}>STRICT</h5>
          </div>
        
          <button 
            style={{marginTop: -5, backgroundColor: "#c4c4c4", border:"0.3vh solid black",borderRadius: "10%", fontFamily: "monospace", fontWeight:"bold", height:"3.5vh", fontSize:"1.5vh" }}
            onClick={this.restart}
            > Restart </button>
      </div>
    )
  }
}


export default App;