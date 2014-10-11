var ai = require("./system/behaviourTree");
var actions = require("./actions");

var co = require("./logic/co");

/*

TARGETS FOR 0.5

 - capture
 - prevent recapture of own cities
 - dynamic indirect unit production
 - unit production

 */

var dumbBoyLogic = new ai.BehaviorTree(
	ai.Selector([

    // ------------------------------------------
    // co power
    
    ai.Sequence([
      
      // is power available for activation?
      ai.Task(function (model){
        return (
          co.canActivatePower(model.turnOwner, co.POWER_LEVEL_COP)? 
            ai.Node.SUCCESS : ai.Node.FAILURE);
      }),

      // when super power is not far away and the battlefield situation equal or in win situation
      // then try to save for the super co power
      ai.Task(function (){

      }),

      // activate power
      ai.Task(function (){
        actions.sharedAction("activatePower", model.player.id, co.POWER_LEVEL_COP);
      })
    ]),

    // ------------------------------------------
    // stop enemy captures
    
    ai.Sequence([
      
      // lookup for visible enemy captures
      ai.Task(function (){
        
      }),

      // make decision on capture type (neutral/own stuff?)
      ai.Task(function (){

      }),

      // lookup for possible attacking unit
      ai.Task(function (){

      }),

      // make attack
      ai.Task(function (){

      })
    ]),

    // ------------------------------------------
    // capture stuff with infantry units
    
    ai.Sequence([

    ]),

    // ------------------------------------------
    // attack stuff

    ai.Sequence([

    ]),

    // ------------------------------------------
    // move footsoldiers to properties when possible 
    
    ai.Sequence([

    ]),

    // ------------------------------------------
    // move direct units to front
    
    ai.Sequence([

    ]),

    // ------------------------------------------
    // move indirects units to front for defense or surpression

    ai.Sequence([

    ]),

    // ------------------------------------------
    // production
    
    ai.Sequence([

      // check battlefield -> do not build things when the own army is strong enough to hold
      //                      position -> save money (if you)
      //                   -> when enough money is saved to build super heavy objects then build regardless 
      //                      of the situation on the battlefield    
      ai.Task(function (){

      }),

      // at least one factory must be free and ready to produce things
      ai.Task(function (){

      }),

      // check money: the player must at least able to buy the cheapest thing
      ai.Task(function () {
        return ai.Node.FAILURE;
      }),

      // footsoldiers
      ai.Sequence([

        // check the situation on the battlefield
        //  - dumbboy will try to generate a footsoldier ratio
        //  - the ratio changes when dumbboy sees enemy or neutral properties
        ai.Task(function (){

        }),

        // build infantry on factory
        ai.Task(function (){

        })
      ]),

      // artilleries
      ai.Sequence([

        // check the situation on the battlefield
        //  - dumbboy will try to generate a direct/indirect ratio
        //  - the ratio changes maybe when the ai sees a lot of strong enemy units
        ai.Task(function (){

        }),

        // build artillery on factory
        ai.Task(function (){

        })
      ]),

      // other direct attack units
      ai.Sequence([

        // build other direct attack units on factory
        ai.Task(function (){

        })
      ])
    ]),

    // ------------------------------------------
    // next Turn
    
    ai.Task(function () {
      // there is nothing to do for dumbBoy when a tick reaches this leaf 
      //  -> invoke next turn to end the turn for the current active ai instance.

      actions.sharedAction("nextTurn");
      return ai.Node.SUCCESS;
    })
  ])
);

exports.registerAiPlayer = function (player) {
  throw new Error("NotImplementedException");
};

exports.resetAiData = function () {
  throw new Error("NotImplementedException");
};

exports.tick = function (player) {
  throw new Error("NotImplementedException");
  dumbBoyLogic.step(null);
};