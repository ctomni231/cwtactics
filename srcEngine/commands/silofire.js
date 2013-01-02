controller.registerCommand({

  key:"silofire",

  _doDamage: function( x,y ){
    if( model.isValidPosition(x,y) ){
      var unit = model.unitPosMap[x][y];
      if( unit !== null ){
        unit.hp -= 20;
        if( unit.hp < 9 ) unit.hp = 9;
      }
    }
  },

  // ------------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    var selectedProperty = data.getSourceProperty();

    if( selectedUnit === null || selectedUnit.owner !== model.turnOwner ||
        selectedProperty === null ||
        selectedProperty .owner !== model.turnOwner ) return false;

    // if( controller.actiondata.getTargetUnit(data) !== null ) return false;

    if( selectedUnit.type !== "INFT" && selectedUnit.type !== "MECH" ){
      return false;
    }

    return ( selectedProperty.type === "SILO" );
  },

  // ------------------------------------------------------------------------
  targetValid: function( data, x,y ){
    return model.isValidPosition(x,y);
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    var dmgF = this._doDamage;
    var x = data.getActionTargetX();
    var y = data.getActionTargetY();

    // RANGE OF TWO -> CIRCLE SHAPE
    dmgF( x  ,y-2 );
    dmgF( x-1,y-1 );
    dmgF( x  ,y-1 );
    dmgF( x+1,y-1 );
    dmgF( x-2,y   );
    dmgF( x-1,y   );
    dmgF( x  ,y   );
    dmgF( x+1,y   );
    dmgF( x+2,y   );
    dmgF( x-1,y+1 );
    dmgF( x  ,y+1 );
    dmgF( x+1,y+1 );
    dmgF( x  ,y+2 );

    // SET EMPTY TYPE
    data.getSourceProperty().type = "SILO_EMPTY";
    controller.invokeCommand(data,"wait");
  }

});