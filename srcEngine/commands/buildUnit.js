controller.registerCommand({

  key:"buildUnit",
  propertyAction: true,
  hasSubMenu: true,

  canPropTypeBuildUnitType: function( pType, uType ){
    var pSheet = model.sheets.tileSheets[ pType ];
    var bList = pSheet.builds;
    if( bList === undefined ) return false;

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

  // ------------------------------------------------------------------------
  prepareMenu: function( data, addEntry ){
    var prop = data.getSourceProperty();
    if( DEBUG && prop === null ){ util.illegalArgumentError(); }

    var bList = this.getBuildList( model.extractPropertyId( prop ) );

    // APPEND TYPES
    for( var i=0,e=bList.length; i<e; i++ ) addEntry( bList[i] );
  },

  // ------------------------------------------------------------------------
  condition: function( data ){
    var property = data.getSourceProperty();

    return (
      model.hasFreeUnitSlots( model.turnOwner ) &&
        this.getBuildList(
          model.extractPropertyId( data.getSourceProperty() )
        ).length > 0
      );
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    var x = data.getSourceX();
    var y = data.getSourceY();
    var subEntry = data.getSubAction();

    var uid = model.createUnit( model.turnOwner, subEntry );
    model.setUnitPosition( uid, x,y );

    var pl = model.players[ model.turnOwner ];
    pl.gold -= model.sheets.unitSheets[ subEntry ].cost;

    var newData = controller.aquireActionDataObject();
    newData.setSourceUnit(model.units[uid]);
    newData.setAction("wait");
    controller.invokeCommand( newData );
  }

});