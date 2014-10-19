"use strict";

var actions = require("./actions");
var ai = require("./system/behaviourTree");

exports.data = ai.Sequence([

    // check battlefield -> do not build things when the own army is strong enough to hold
    //                      position -> save money (if you)
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
]);