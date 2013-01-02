controller.registerCommand({

  key:"supply",
  unitAction: true,

  _resupplyUnitAt: function( x,y ){
    var unit = model.unitPosMap[x][y];
    var uSheet = model.sheets.unitSheets[ unit.type ];
    unit.ammo = uSheet.maxAmmo;
    unit.fuel = uSheet.maxFuel;
  },

  // -----------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    var sSheet = model.sheets.unitSheets[ selectedUnit.type ];
    if( sSheet.supply === undefined ) return false;

    var pid = selectedUnit.owner;

    var x = data.getTargetX();
    var y = data.getTargetY();
    var check = model.thereIsAnOwnUnitAt;

    return (
      check(x-1,y,pid) || check(x+1,y,pid) ||
      check(x,y-1,pid) || check(x,y+1,pid)
    );
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    var selectedUnit = data.getSourceUnit();
    var pid = selectedUnit.owner;
    var x = data.getTargetX();
    var y = data.getTargetY();
    var check = model.thereIsAnOwnUnitAt;
    var refill = this._resupplyUnitAt;

    if( check(x-1,y,pid) ){ refill(x-1,y); }
    if( check(x+1,y,pid) ){ refill(x+1,y); }
    if( check(x,y-1,pid) ){ refill(x,y-1); }
    if( check(x,y+1,pid) ){ refill(x,y+1); }

    controller.invokeCommand(data,"wait");
  }
});