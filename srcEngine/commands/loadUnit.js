controller.userAction({

  name:"loadUnit",

  key:"LODU",

  unitAction: true,

  condition: function( mem ){
    var selectedUnitId = mem.sourceUnitId;
    var transporterId = mem.targetUnitId;
    if( transporterId === -1 || mem.targetUnit.owner !== model.turnOwner){
      return false;
    }

    return (
      model.isTransport( transporterId ) &&
      model.canLoad( selectedUnitId, transporterId )
    );
  },

  createDataSet: function( mem ){
    return [ mem.sourceUnitId, mem.targetUnitId ];
  },

  /**
   * Loads an unit into a transporter.
   *
   * @param {Number} uid load unit id
   * @param {Number} tid transporter id
   *
   * @methodOf controller.actions
   * @name loadUnit
   */
  action: function( uid, tid ){
    model.loadUnitInto( uid, tid );
  }

});