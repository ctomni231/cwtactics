controller.userAction({

  name:"silofire",

  key:"SLFR",

  unitAction: true,

  _doDamage: function( x,y ){
    if( model.isValidPosition(x,y) ){
      var unit = model.unitPosMap[x][y];
      if( unit !== null ){
        unit.hp -= 20;
        if( unit.hp < 9 ) unit.hp = 9;
      }
    }
  },

  isTargetValid: function( mem, x,y ){
    return model.isValidPosition(x,y);
  },

  condition: function( mem ){
    var selectedUnit = mem.sourceUnit;
    var selectedProperty = mem.targetProperty;

    if( selectedProperty === null || selectedProperty.owner !== model.turnOwner ) return false;

    if( mem.targetUnit !== null ) return false;

    if( selectedUnit.type !== "INFT" && selectedUnit.type !== "MECH" ){
      return false;
    }

    return ( selectedProperty.type === "SILO" );
  },

  createDataSet: function( mem ){
    return [ 
      mem.sourceUnitId, 
      mem.targetX, mem.targetY, 
      mem.targetPropertyId, 
      mem.selectionX, mem.selectionY
    ];
  },

  action: function( uid, sx,sy, prid, tx,ty ){
    var dmgF = this._doDamage;
    var x = tx;
    var y = ty;

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
    var px = sx;
    var py = sy;
    model.propertyPosMap[px][py].type = "SILO_EMPTY";
    controller.actions.wait( uid );
  }

});