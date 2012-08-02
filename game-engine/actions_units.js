/**
 * Changes the status of an unit. This action is only available to units of a player that is
 * the current active player of the turn. If a player does this action, the unit does nothing 
 * and looses it actable status.
 *
 * @name WAIT
 * @memberOf cwt.actions
 */
cwt.action.register({
  id: "WAIT",
  
  action: function(){
    
  },
  
  when: function( pid, x, y, uid ){
    return (
      uid !== undefined &&
      
      // target must be selected unit itself or empty
      ( cwt.map.unit( uid ) === null || cwt.map.unit( uid ) === cwt.map.unitByPos( x, y ) )
    );
  }
});

/**
 * Capture action that lets an unit capturing an property of an opposite player. The capturing 
 * lowers the capturePoints of a property object. If the capture value reaches zero, the owner
 * property changes to the owner of the capturer.
 *
 * @name CAPTURE
 * @memberOf cwt.actions
 */
cwt.action.register({
  id: "CAPTURE",
  
  action: function(){
    
  },
  
  when: function( pid, x, y, uid ){
    var prop = cwt.map.propertyByPos( x, y );
    
    return (
      uid !== undefined &&
      
      // property belongs to enemies or neutral
      prop !== null && prop.owner !== pid && 
      cwt.map.player( prop.owner ).team !== cwt.map.player( pid ).team &&
      
      // property is not occupied
      cwt.map.unit( uid ) === null
    );
  }
});