import { state } from "./state.js"
import { startLoop } from "./loop_manager.js"
import { updateGame, bootGame } from "./gamecontroller.js"
import { executeModuleTests } from "./test.js"

import * as inputData from "./config/input.js"
console.log(inputData)

export function boot () {
  executeModuleTests()
  bootGame()
  startLoop(updateGame)
}
