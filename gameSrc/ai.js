"use strict";

/**
 * Dumboy behaviorTree.
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

var behaviorTree = {};

function createNodeType(nodeRunner) {
    return function(node) {
        return new behaviorTree.Node(nodeRunner, node);
    };
}

function createCompositeType(nodeRunner) {
    return function(nodes) {
        return new behaviorTree.Composite(nodeRunner, nodes);
    };
}

function repeaterHandler(object) {
    var times = this.times;

    // run until times goes to zero (if times not given, then it runs endless)
    do {
        this.node.run(object);
        times--;
    } while (times != 0);

    return behaviorTree.Node.SUCCESS;
}

function constructBaseNode(fn) {
    assert(typeof fn === "function");
    this.run = fn;
}

behaviorTree.Node = function(fn, subNode) {
    assert(subNode === null || subNode instanceof behaviorTree.Node);

    constructBaseNode(fn);
    this.node = subNode;
};

/**
 * Marks a failure execution of a node.
 *
 * @type {number}
 */
behaviorTree.Node.FAILURE = 0;

/**
 * Marks a successful execution of a node.
 *
 * @type {number}
 */
behaviorTree.Node.SUCCESS = 1;

behaviorTree.TimerNode = function(fn, subNode, times) {
    behaviorTree.Node.call(this, fn, subNode);
    this.times = times;
};

behaviorTree.TimerNode.prototype = Object.create(behaviorTree.Node.prototype);

behaviorTree.Composite = function(fn, nodeList) {
    for (var x = 0; x < nodeList.length; x++) assert(nodeList[i] instanceof behaviorTree.Node);

    constructBaseNode(fn);
    this.nodeList = nodeList;
};

behaviorTree.Composite.prototype = Object.create(behaviorTree.Node.prototype);

behaviorTree.BehaviorTree = function(rootNode) {
    this.rootNode = rootNode;
};

behaviorTree.BehaviorTree.prototype = {
    step: function(object) {
        this.rootNode(object);
    }
};

behaviorTree.Task = function(taskFunction) {
    return new behaviorTree.Node(taskFunction, null);
};

behaviorTree.Inverter = createNodeType(function(object) {
    var result = this.node.run(object);

    if (result === behaviorTree.Node.SUCCESS) result = behaviorTree.Node.FAILURE;
    else if (result === behaviorTree.Node.FAILURE) result = behaviorTree.Node.SUCCESS;

    return result;
})

behaviorTree.Succeeder = createNodeType(function(object) {
    this.node.run(object);
    return behaviorTree.Node.SUCCESS;
});

behaviorTree.Repeater = function(node, timesToRun) {
    return new behaviorTree.TimerNode(repeaterHandler, node, timesToRun);
};

behaviorTree.RepeatUntilFail = createNodeType(function(object) {
    var result;

    do {
        result = this.node.run(object);
    } while (result === behaviorTree.Node.SUCCESS);

    return behaviorTree.Node.SUCCESS;
});

behaviorTree.Sequence = createCompositeType(function(object) {
    var i = 0;

    for (; i < this.nodes.length; i++) {
        var result = this.nodes[i].run(object);

        // break sequence when one node returns fail
        if (result === behaviorTree.Node.FAIL) return result;
    }

    return behaviorTree.Node.SUCCESS;
});

behaviorTree.Selector = createCompositeType(function(object) {
    var i = 0;

    for (; i < this.nodes.length; i++) {
        var result = this.nodes[i].run(object);

        // break sequence when one node returns success
        if (result === behaviorTree.Node.SUCCESS) return result;
    }

    return behaviorTree.Node.FAILURE;
});

behaviorTree.Random = createCompositeType(function(object) {
    return this.nodes[parseInt(Math.random() * this.nodes.length, 10)].run(object);
});

var tree = new behaviorTree.BehaviorTree(
    behaviorTree.Selector([

        behaviorTree.Sequence([

            // is power available for activation?
            behaviorTree.Task(function (model){
                return (co.canActivatePower(model.turnOwner, co.POWER_LEVEL_COP)? behaviorTree.Node.SUCCESS : behaviorTree.Node.FAILURE);
            }),

            // when super power is not far away and the battlefield situation equal or in win situation
            // then try to saveGameConfig for the super co power
            behaviorTree.Task(function (){

            }),

            // activate power
            behaviorTree.Task(function (){
                actions.sharedAction("activatePower", model.turnOwner.id, co.POWER_LEVEL_COP);
            })
        ]),

        behaviorTree.Sequence([

            // lookup for visible enemy captures
            behaviorTree.Task(function () {

            }),

            // make decision on capture type (neutral/own stuff?)
            behaviorTree.Task(function () {

            }),

            // lookup for possible attacking unit
            behaviorTree.Task(function () {

            }),

            // make attack
            behaviorTree.Task(function () {

            })
        ]),

        // capture properties
        behaviorTree.Sequence([

        ]),

        // attack units
        behaviorTree.Sequence([

        ]),

        behaviorTree.Sequence([

        ]),

        behaviorTree.Sequence([

            // check battlefield -> do not build things when the own army is strong enough to hold
            //                      position -> saveGameConfig money (if you)
            //                   -> when enough money is saved to build super heavy objects then build regardless
            //                      of the situation on the battlefield
            behaviorTree.Task(function () {

            }),

            // at least one factory must be free and ready to produce things
            behaviorTree.Task(function () {

            }),

            // check money: the player must at least able to buy the cheapest thing
            behaviorTree.Task(function () {
                return behaviorTree.Node.FAILURE;
            }),

            // foot soldiers
            behaviorTree.Sequence([

                // check the situation on the battlefield
                //  - dumbboy will try to generate a footsoldier ratio
                //  - the ratio changes when dumbboy sees enemy or neutral properties
                behaviorTree.Task(function () {

                }),

                // build infantry on factory
                behaviorTree.Task(function () {

                })
            ]),

            // artilleries
            behaviorTree.Sequence([

                // check the situation on the battlefield
                //  - dumbboy will try to generate a direct/indirect ratio
                //  - the ratio changes maybe when the ai sees a lot of strong enemy units
                behaviorTree.Task(function () {

                }),

                // build artillery on factory
                behaviorTree.Task(function () {

                })
            ]),

            // other direct attack units
            behaviorTree.Sequence([

                // build other direct attack units on factory
                behaviorTree.Task(function () {

                })
            ])
        ]),

        behaviorTree.Task(function () {
            // there is nothing to do for dumbBoy when a tick reaches this leaf
            //  -> invoke next turn to end the turn for the current active ai instance.

            actions.sharedAction("nextTurn");
            return behaviorTree.Node.SUCCESS;
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