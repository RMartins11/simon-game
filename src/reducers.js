import $ from "jquery";

//////////////////////////////////REDUCERS/////////////////////////////////
var sound1 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"); 
var sound2 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"); 
var sound3 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"); 
var sound4 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"); 
var soundBoard = [sound1, sound2, sound3, sound4];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getSeries() {
  var series = [] 
  for(var i = 0; i < 24; i++) {
  series[i] = getRandomIntInclusive(0,3);
  }
    return series
  }
  
  function lightUp (tile) {
    var toAnimate = $("#tile"+tile);
    
    toAnimate.addClass("anim");
    
    soundBoard[tile].playbackRate = 0.7;
    soundBoard[tile].play()
    
    setTimeout(function(){
      toAnimate.removeClass("anim");
    }, 500);
  };
  
  function checkEquality( partialSeries, lengthController, playerInput) {
    return partialSeries[lengthController] == playerInput[lengthController] ? true : false;
  };

export const initialStore= {
  series: getSeries(),
  partialSeries: [],
  playerInputs: [],
  strictMode: false,
  turn: "",
  status: "Beginning",
  clickable: false,
  lightUp: lightUp,
  lengthController: -1
};



export function reducer (state = initialStore, {type, payload}) {
  switch (type) {
    
    case "t.start": {
      return {...state, status: payload };
    }
    case "t.changeTurn": {
      return {...state, turn: payload, clickable: true };
    }
    case "t.partialS": {
      return {...state, partialSeries: payload};
    }
    case "t.updateController" : {
      return { ...state, lengthController: payload}
    }
    case "t.setStrict" : {
      return {...state, strictMode: !state.strictMode};
    }
    case "t.restart" : {
      return {...initialStore, series: getSeries(), strictMode: state.strictMode }
    }
    case "t.updateInputs" : {
      state.lengthController ++;
      state.playerInputs = [...state.playerInputs, payload] ;
      
      var nextTurn = checkEquality(state.partialSeries, state.lengthController, state.playerInputs );
      
      if (state.partialSeries.length == state.series.length){
        alert("You Won!");
          return{...initialStore, series: getSeries() }
      }
      
      if (state.playerInputs.length == state.partialSeries.length && nextTurn) {
        state.lightUp(payload);
        let incremented = state.series.slice(0, state.playerInputs.length+1);
        
        return { ...state, partialSeries: incremented, turn: "PlaySeq", playerInputs: []}
      }
      
      if (nextTurn) {
        state.lightUp(payload);
        return {...state}
      } else if (!state.strictMode) {
        alert ("WrongInput, you have one more try");
        return { ...state, turn: "PlaySeq", playerInputs: [] }
      } else {
        alert ("WrongInput, Try Again!");
        return {...initialStore, series: getSeries(), strictMode: state.strictMode }
      }
    }
      
    default: 
      return state;
  }
}