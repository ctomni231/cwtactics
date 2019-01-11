import { startLoop } from "./loop_manager"
import { loop } from "./gameloop"

export function boot () {
  loopManager.startLoop(loop)
}
