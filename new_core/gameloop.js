import * as gamestate from "./state.js"
import * as performance from "./performance.js"

// traits
import * as input from "./input.js"
import * as statemachine from "./statemachine.js"
import * as screen from "./screen.js"

const GAMELOOP_MEASURE_ID = "gameloop-update"

const traits = [
  input,
  statemachine,
  screen
]

export function loop (delta) {
  gamestate.loop.delta = delta
  
  performance.startMeasure(GAMELOOP_MEASURE_ID)

  for (var i = 0; i < traits.length; i++){
    traits[i].update()
  }
  
  performance.stopMeasure(GAMELOOP_MEASURE_ID)
}