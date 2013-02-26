controller.userAction({

  name:"buildUnit",

  key:"BDUN",
  
  propertyAction: true,

  hasSubMenu: true,

  canPropTypeBuildUnitType: function( pType, uType ){
    var pSheet = model.sheets.tileSheets[ pType ];
    var bList = pSheet.builds;
    if( bList === undefined ) return false;
    if( model.rules.blockedUnits.indexOf(uType) !== -1 ) return false;

    if( bList.indexOf("*") !== -1 ) return true;
    if( bList.indexOf( uType ) !== -1 ) return true;

    var uSheet = model.sheets.unitSheets[ uType ];

    var moveType = uSheet.moveType;
    if( bList.indexOf( moveType ) !== -1 ) return true;

    return false;
  },

  getBuildList: function( pid ){
    var bl = [];
    var types = model.getListOfUnitTypes();
    var property = model.properties[ pid ];
    var propSheet = model.sheets.tileSheets[ property.type ];

    var budget = model.players[ model.turnOwner ].gold;
    for( var i=0,e=types.length; i<e; i++ ){
      if( this.canPropTypeBuildUnitType( property.type, types[i] ) ){
        if( model.sheets.unitSheets[types[i]].cost <= budget ) bl.push( types[i] );
      }
    }
    return bl;
  },

  condition: function( mem ){
    var property = mem.sourceProperty;
    if( model.countUnits(model.turnOwner) >= model.rules.unitLimit ){
      return false;
    }

    return (
      model.hasFreeUnitSlots( model.turnOwner ) &&
        this.getBuildList( model.extractPropertyId( property ) ).length > 0
    );
  },
  
  prepareMenu: function( mem ){
    var property = mem.sourceProperty;
    
    if( DEBUG && property === null ){ 
      util.raiseError();
    }

    var bList = this.getBuildList( mem.sourcePropertyId );
    for( var i=0,e=bList.length; i<e; i++ ){
      mem.addEntry( bList[i] );
    }
  },
  
  createDataSet: function( mem ){
    return [ mem.sourceX, mem.sourceY, mem.subAction ];
  },

  /**
   * Builds an unit.
   *
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {String} type type of the unit
   *
   * @methodOf controller.actions
   * @name buildUnit
   */
  action: function( x,y, type ){

    controller.actions.createUnit( x,y, model.turnOwner, type );
    
    var uid = model.extractUnitId( model.unitPosMap[x][y] );
    var pl = model.players[ model.turnOwner ];
    
    pl.gold -= model.sheets.unitSheets[ type ].cost;

    controller.actions.wait( uid );
  }

});