/**
 *
 * @name NEXT_TURN
 * @memberOf cwt.actions
 */
cwt.actions.register({
  id: "NEXT_TURN",
  
  // action
  action: function(){
    // cwt.turn.nextTurn();
  },
  
  // condition
  when: function( pid, x, y, uid ){
  
    // only if no own object is selected
    return uid === undefined && cwt.turn.activePlayer === pid && ( 
      cwt.map.unit( x, y ) === null || cwt.map.unit( x, y ).owner !== pid );
  }
});