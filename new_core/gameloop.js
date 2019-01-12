import * as gamestate from "./state.js"

// traits
import * as input from "./input.js"
import * as statemachine from "./statemachine.js"
import * as screen from "./screen.js"

var traits = [
  input,
  statemachine,
  screen
]

export function loop (delta) {
  gamestate.loop.delta = delta
  
  for (var i = 0; i < traits.length; i++){
    traits[i].update()
  }
}