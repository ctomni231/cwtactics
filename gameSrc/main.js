/**
 * This module is simply a starting point for the 'browserify' compiler to link all modules together. We only link
 * the state machine module here because it is the central component of the whole game. All activities will be invoked
 * from this point. This makes the linking of other modules unnecessary, because they will be linked from the state
 * machine module itself.
 *
 * @module
 */

require("./statemachine").start();