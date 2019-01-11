const gamedata = require("./state")

exports.update = function () {
  const nextState = gamedata.state.next
  
  if (nextState !== null){
    logInfo("change game state to " + nextState)
    
    gamedata.state.current = nextState
    gamedata.state.next = null
  }
}

exports.draw = function(canvas, ctx) {}