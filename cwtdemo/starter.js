import * as screenlib from "./engine/screenlibrary.js"
import * as test from "./engine/screentest.js"

// These represent the different traits and screens
import * as debugscr from "./engine/js/debug.js"
import * as inputscr from "./engine/js/input.js"

// These represent the screens
import * as cwtdemo from "./cwtdemo.js"
//import * as cwtdemobox from "./tools/dump/cwtdemobox.js"
//import * as cwtdemohex from "./tools/dump/cwtdemohex.js"

export function boot() {

  // This will execute the test modules
  //test.executeModuleTests()

  screenlib.setWindowSize()
  screenlib.addTrait(inputscr)
  screenlib.addTrait(debugscr)

  // Let's test some screens
  screenlib.addTrait(cwtdemo)

  // screenlib.addTrait(cwtdemobox)
  // screenlib.addTrait(cwtdemohex)

  screenlib.run()

}
