controller.engineAction({

  name: "makeActable",

  key: "MKAC",
  
  /**
   * Makes an unit id actable.
   *
   * @param {Number} uid unit id
   *
   * @methodOf controller.actions
   * @name makeActable
   */
  action: function( uid ){
    var uid = ( typeof uid === 'number' )? uid : model.extractUnitId( uid );
    var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;
  
    // NOT THE OWNER OF THE CURRENT TURN
    if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER ||
      uid < startIndex ){
  
      util.raiseError("unit owner is not the active player");
    }
  
    model.leftActors[ uid - startIndex ] = true;
  
    if( DEBUG ){
      util.log("unit",uid,"going into wait status");
    }
  }

});