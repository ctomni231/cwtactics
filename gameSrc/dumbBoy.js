var ai = require("./system/behaviourTree");
var actions = require("./actions");

var dumbBoyLogic = new ai.BehaviorTree(
	ai.Selector([

    // ------------------------------------------
    // stop enemy captures
    ai.Sequence([
      
      // lookup for visible enemy captures
      
      // make decision on capture type (neutral/own stuff?)
      
      // lookup for possible attacking unit
      
      // make attack
    ]),

    // ------------------------------------------
    // production
    ai.Sequence([

      // check money: the player must at least able to buy the cheapest thing
      ai.Task([]),

      // infantries
      ai.Sequence([]),

      // tanks
      ai.Sequence([]),

      // artilleries
      ai.Sequence([]),
    ]),

    // ------------------------------------------
    // capture stuff
    ai.Sequence([]),

    // ------------------------------------------
    // build infantry
    ai.Sequence([
      ai.Task(function () {
        // search free factory
      })
    ]),

    // ------------------------------------------
    // next Turn
    ai.Task(function () {
      actions.sharedAction("nextTurn");
      return ai.Node.SUCCESS;
    })
  ])
);

exports.tick = function (player) {
  dumbBoyLogic.step(null);
};