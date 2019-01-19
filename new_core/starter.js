import { startLoop } from "./loop_manager.js"
import { loop } from "./gameloop.js"
import { state } from "./state.js"

export function boot () {

  state.current = "INITIAL"

  startLoop(loop)
}
