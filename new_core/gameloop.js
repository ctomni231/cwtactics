const statemachine = require("./statemachine")

const updateTraits = [
  statemachine
]

const renderTraits = [
]

function checkTraits () {
  if (updateTraits.filter(trait => !trait.update).length > 0){
    throw new Error("update trait must have an update function")
  }
  if (renderTraits.filter(trait => !trait.render).length > 0){
    throw new Error("render trait must have a render function")
  }
}

exports.boot = function () {
  checkTraits()
}

exports.loop = function () {
  logInfo("evaluate game turn") 
  
  for (var ui = 0; ui < updateTraits.length; ui++){
    updateTraits[ui].update()
  }
  
  for (var ri = 0; ui < renderTraits.length; ri++){
    renderTraits[ri].render(null, null)
  }
  
}