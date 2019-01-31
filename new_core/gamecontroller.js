import { loop, state }from "./state.js"

// traits
import * as input from "./input.js"
import * as statemachine from "./statemachine.js"
import * as screen from "./screen.js"

const traits = [
  input,
  statemachine,
  screen
]

export function bootGame () {
  traits.forEach(trait => {
    if (trait.setup) trait.setup()
  })
}

export function updateGame (delta) {
  loop.delta = delta

  for (var i = 0; i < traits.length; i++){
    traits[i].update()
  }
}