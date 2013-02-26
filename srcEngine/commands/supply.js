controller.userAction({

  name:"supply",

  key:"SPPL",

  unitAction: true,

  _resupplyUnitAt: function( x,y ){
    var unit = model.unitPosMap[x][y];
    var uSheet = model.sheets.unitSheets[ unit.type ];
    unit.ammo = uSheet.maxAmmo;
    unit.fuel = uSheet.maxFuel;
  },

  condition: function( mem ){

    var selectedUnit = mem.sourceUnit;
    var sSheet = model.sheets.unitSheets[ selectedUnit.type ];
    if( sSheet.supply === undefined ) return false;

    var pid = selectedUnit.owner;

    var x = mem.targetX;
    var y = mem.targetY;
    var check = model.thereIsAnOwnUnitAt;

    return (
      check(x-1,y,pid) ||
      check(x+1,y,pid) ||
      check(x,y-1,pid) ||
      check(x,y+1,pid)
    );
  },

  createDataSet: function( mem ){
    return [ mem.sourceUnitId, mem.targetX, mem.targetY ];
  },

  /**
   * Supplies units that are near a supplier.
   *
   * @param {Number} sid supplier unit id
   * @param {Number} x x coordinate of the supplier
   * @param {Number} y y coordinate of the supplier
   * 
   * @methodOf controller.actions
   * @name supply
   */
  action: function( sid, x,y ){

    var selectedUnit = model.units[ sid ];
    var pid = selectedUnit.owner;
    var check = model.thereIsAnOwnUnitAt;
    var refill = this._resupplyUnitAt;

    if( check(x-1,y,pid) ){ refill(x-1,y); }
    if( check(x+1,y,pid) ){ refill(x+1,y); }
    if( check(x,y-1,pid) ){ refill(x,y-1); }
    if( check(x,y+1,pid) ){ refill(x,y+1); }

    controller.actions.wait(sid);
  }
});