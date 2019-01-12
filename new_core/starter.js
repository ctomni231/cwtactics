import { startLoop } from "./loop_manager.js"
import { loop } from "./gameloop.js"

export function boot () {
  startLoop(loop)
}
