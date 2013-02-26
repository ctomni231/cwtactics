controller.userAction({
  
  name:"wait",
  
  key:"WTUN",
  
  unitAction: true,
  
  condition: function( mem ){
    return ( mem.targetUnit === null || mem.targetUnit === mem.sourceUnit );
  },
  
  createDataSet: function( mem ){
    return [ mem.sourceUnitId ];
  },
  
  /**
   * Sends an unit into the wait status.
   *
   * @param {Number} uid unit id
   * 
   * @methodOf controller.actions
   * @name wait
   */
  action: function( uid ){
    var uid = ( typeof uid === 'number' )? uid : model.extractUnitId( uid );
    var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;
  
    // NOT THE OWNER OF THE CURRENT TURN
    if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER || uid < startIndex ){
      util.raiseError("unit owner is not the active player");
    }
  
    model.leftActors[ uid - startIndex ] = false;
  
    if( DEBUG ){
      util.log("unit",uid,"going into wait status");
    }
  }
  
});