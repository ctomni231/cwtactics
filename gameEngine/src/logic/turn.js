var cwtTurn$my$own$var = function(){};
var cwtTurn_$_my_$_own_$_var = function(){};
var cwtTurn_my_own_var = function(){};

var cwtTurn = {};
require.js("model.game", function(){

  cwtTurn.Event = {
    turnEnd: "turnEnds",
    turnStart: "turnStarts"
  };

  /**
   * Next turn function.
   *
   * [@WAITS BETA-1]
   */
  cwtTurn.turn_next = function(){
    if( DEBUG ) cwtLog.info("starting next turn");

    cwtTurn_my_own_var = 10;

    // event turn ends
    if( DEBUG ) cwtLog.info("firing turn end event");
    //event_dispatch( cwtTurn.Event.turnEnd );

    cwtModel.turn++;
    if( DEBUG ) cwtLog.info("turn number is {0}",cwtModel.game.turn);

    if( DEBUG ) cwtLog.info("tick next player (current is {0})",cwtModel.game.activePlayer);
    //TODO check circular dependency
    while( true ){

      cwtModel.game.activePlayer++;

      // increase day if you reach the invalid player id, go back to zero ( one day cylce is done )
      if( cwtModel.game.activePlayer === cwtModel.game.players.length ){

        cwtModel.game.activePlayer = 0;

        cwtModel.game.day++;
        //event_dispatch("nextDay",game_round_day);

        if( DEBUG ) log_info("day changed, day number is now {0}",cwtModel.game.turn);
      }

      // valid player found
      if( cwtModel.game.players[cwtModel.game.activePlayer].team !== -1 ) break;
    }

    // set actable units
    //collection_copy( game_round.canAct, nextPlayer.units );

    // pay salary
    if( DEBUG ) cwtLog.info("paying salary for units");
    collection_each( nextPlayer.units, function( unit ){
      nextPlayer.gold -= unit.sheet().salary; // correct?
      //TODO: remove unit if salary isn't payable
    });

    // give funds
    if( DEBUG ) cwtLog.info("receiving funds from properties");
    cwtModel.players.forEach(function(property){
      if( property.owner === nextPlayer ) nextPlayer.gold += property.sheet().funds;
    });

    // event turn starts
    if( DEBUG ) cwtLog.info("firing turn starts event");
    //event_dispatch( cwtTurn.Event.turnStart );

    if( DEBUG ) cwtLog.info("turn startet");
  };

});