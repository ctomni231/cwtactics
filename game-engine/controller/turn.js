/**
 * Turn controller.
 *
 * @module
 * @namespace
 */
cwt.turn = {

  /** @private */
  _activePlayer: -1,

  /** @private */
  _leftActors: [],

  init: function( annotated ){
    annotated.persist("_activePlayer");
    annotated.persist("_leftActors");

    annotated.userAction("nextTurn", this._condNextTurn);
    annotated.transaction("nextTurn");

    annotated.userAction("wait", this._condWait );
    annotated.transaction("wait");
  },

  /** @private */
  _condNextTurn: function( actions, x, y, prop, unit, selected ){
    if( selected === null ){
      actions.push({
        k:"turn.nextTurn",
        a:null
      });
    }
  },

  /** @private */
  _condWait: function( actions, x, y, prop, unit, selected ){
    if( selected !== null ){
      actions.push({
        k:"turn.wait",
        a:[ selected ]
      });
    }
  },

  wait: function( uid ){
    if( cwt.DEBUG ) cwt.log.info("unit {0} going into wait status", uid );

  },

  /**
   * @example
   *  type: userAction
   *  type: transaction
   */
  nextTurn: function(){
    if( cwt.DEBUG ) cwt.log.info("ending turn");

    // TODO currently as niy helper
    return;

    var pid = this._activePlayer;

    // end turn
    this._endTurn( cwt.model.player(pid) );
    this._leftActors.splice(0); // clean and get rid of the array 
    //(TODO implement reuse management)

    // find next player
    var oid = pid;
    pid++;
    while( pid !== oid ){

      if( cwt.model.player( pid ).team !== cwt.model.INACTIVE ){

        // found next player
        break;
      }

      // increase id
      pid++;
      if( pid === 8 ) pid = 0;
    }

    // check new 
    if( pid === oid ) cwt.log.error("cannot find next player");

    // add actors 
    this._leftActors = cwt.model.units( cwt.selectors.own, this._activePlayer );

    // start turn
    this._activePlayer = pid;
    this._startTurn( cwt.model.player(pid) );
  },

  /** @private */
  _startTurn: function( player ){
    if( cwt.DEBUG ) cwt.log.info( player.name+" starts his turn" );
  },

  /** @private */
  _endTurn: function( player ){
    if( cwt.DEBUG ) cwt.log.info( player.name+" ends his turn" );
  }
};