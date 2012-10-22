/**
 * The sheets layer holds all object type sheets of the game. Sheets can be
 * accessed over the data layer from higher level layers.
 *
 * @example
 *  dependencies:
 *    -> https://github.com/Baggz/Amanda [0.4]
 *
 *  usage -> read only for client
 *
 * @namespace
 */
var sheets      = {};

/**
 * The model layer holds all necessary data for a game round. This layer can be
 * extended to store additional data for game rounds.
 * </br></br>
 * If you extend this layer you should follow two rules. At first remember that
 * every property of this layer will be saved in a save game. The current
 * persistence layer implementation uses a json algorithm to serialize all model
 * data. This means you cannot store cyclic data structures in the model layer.
 * Furthermore you should not place functions in this layer because this would
 * not follow the specification of this layer.
 *
 * @example
 *  usage -> read only for client
 *
 * @namespace
 */
var domain      = {};

/**
 * The game layer holds access functions to get/set data in the model and
 * logic functions of the game.
 *
 * @namespace
 */
var game        = {};

/**
 * Holds all known game actions.
 *
 * @namespace
 */
var actions     = {};

/**
 * This is the main access layer for the custom wars tactics game client. All
 * data changing actions will be invoked from this layer.
 *
 * The layer itself is build as state machine which represents a player action.
 * Every action starts by a selection of a tile. Which the selected object will
 * be choosen by the state of the tile. An empty tile leads to a map action. An
 * empty (owned) property leads to a property actions like buying an unit. The
 * last option will be choosen if the tile is occupied by an own unit.
 *
 * Action type search:
 * <ul>
 *   <li>1. tile occupied by an actable unit</br>
 *        if yes then unit action else 2.</li>
 *   <li>2. is tile a property that can build things</br>
 *        if yes then property action else 3.</li>
 *   <li>3. map action</li>
 * </ul>
 *
 * @namespace
 */
var controller  = {};

/**
 * @namespace
 */
var persistence = {};

/**
 * Some useful utility functions are stored in this layer. This layer contains
 * the logging functions of custom wars tactics. These functions are
 * overwritable to have a custom log behaviour for the game client. As example
 * if you use a graphical logging solution like BlackbirdJs.
 *
 * @namespace
 */
var util        = {};

/**
 * Event object that allows pushing data into observerable channels.
 *
 * @namespace
 */
var signal      = {};