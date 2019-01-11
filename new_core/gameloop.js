import * as gamestate from "./state"

// traits
import * as input from "input"
import * as statemachine from "statemachine"
import * as screen from "screen"

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