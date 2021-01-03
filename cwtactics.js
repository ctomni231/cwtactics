import * as screenlib from "./engine/screenlibrary.js"
import * as test from "./engine/screentest.js"

// These represent the different traits and screens
import * as debugscr from "./engine/js/debug.js"
import * as inputscr from "./engine/js/input.js"

// These represent the screens
import * as battle from "./game/cwbattle.js"
import * as testbed from "./game/testbed.js"
import * as main from "./game/maingame.js"

// This is starter.js for CWTactics

export function boot() {

  // This will execute the test modules
  //test.executeModuleTests()

  screenlib.setWindowSize()
  screenlib.addTrait(inputscr)
  screenlib.addTrait(debugscr)

  // Let's test some screens
  screenlib.addTrait(main)
  //screenlib.addTrait(battle)

  screenlib.run()

}
