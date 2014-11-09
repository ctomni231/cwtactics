"use strict";

/**
 * Dumboy AI.
 *
 * TARGETS FOR 0.38
 *  - capture
 *  - prevent recapture of own cities
 *  - dynamic indirect unit production
 *  - unit production
 *
 * @module
 */

var actions = require("./actions");
var model = require("./model");
var debug = require("./debug");
var ai = require("./system/behaviourTree");

var tree = new ai.BehaviorTree(
    ai.Selector([

        ai.Sequence([

            // is power available for activation?
            ai.Task(function (model){
                return (co.canActivatePower(model.turnOwner, co.POWER_LEVEL_COP)? ai.Node.SUCCESS : ai.Node.FAILURE);
            }),

            // when super power is not far away and the battlefield situation equal or in win situation
            // then try to saveGameConfig for the super co power
            ai.Task(function (){

            }),

            // activate power
            ai.Task(function (){
                actions.sharedAction("activatePower", model.turnOwner.id, co.POWER_LEVEL_COP);
            })
        ]),

        ai.Sequence([

            // lookup for visible enemy captures
            ai.Task(function () {

            }),

            // make decision on capture type (neutral/own stuff?)
            ai.Task(function () {

            }),

            // lookup for possible attacking unit
            ai.Task(function () {

            }),

            // make attack
            ai.Task(function () {

            })
        ]),

        // capture properties
        ai.Sequence([

        ]),

        // attack units
        ai.Sequence([

        ]),

        ai.Sequence([

        ]),

        ai.Sequence([

            // check battlefield -> do not build things when the own army is strong enough to hold
            //                      position -> saveGameConfig money (if you)
            //                   -> when enough money is saved to build super heavy objects then build regardless
            //                      of the situation on the battlefield
            ai.Task(function () {

            }),

            // at least one factory must be free and ready to produce things
            ai.Task(function () {

            }),

            // check money: the player must at least able to buy the cheapest thing
            ai.Task(function () {
                return ai.Node.FAILURE;
            }),

            // foot soldiers
            ai.Sequence([

                // check the situation on the battlefield
                //  - dumbboy will try to generate a footsoldier ratio
                //  - the ratio changes when dumbboy sees enemy or neutral properties
                ai.Task(function () {

                }),

                // build infantry on factory
                ai.Task(function () {

                })
            ]),

            // artilleries
            ai.Sequence([

                // check the situation on the battlefield
                //  - dumbboy will try to generate a direct/indirect ratio
                //  - the ratio changes maybe when the ai sees a lot of strong enemy units
                ai.Task(function () {

                }),

                // build artillery on factory
                ai.Task(function () {

                })
            ]),

            // other direct attack units
            ai.Sequence([

                // build other direct attack units on factory
                ai.Task(function () {

                })
            ])
        ]),

        ai.Task(function () {
            // there is nothing to do for dumbBoy when a tick reaches this leaf
            //  -> invoke next turn to end the turn for the current active ai instance.

            actions.sharedAction("nextTurn");
            return ai.Node.SUCCESS;
        })
    ])
);

/**
 * Registers a player as AI player. The player will be handled by the host instance of a game round instance.
 *
 * @param player
 */
exports.registerAiPlayer = function (player) {
    if (!player instanceof model.Player) debug.logCritical("IllegalArgumentType");
    debug.logCritical("NotImplementedException");
};

/**
 * Resets all given AI data.
 */
exports.resetAiData = function () {
    debug.logCritical("NotImplementedException");
};

/**
 * Makes a step for the AI state machine. The AI will do things here.
 *
 * @param player
 */
exports.tick = function (player) {
    if (!player instanceof model.Player) debug.logCritical("IllegalArgumentType");
    debug.logCritical("NotImplementedException");
};