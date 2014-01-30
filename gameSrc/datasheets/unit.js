cwt.UnitSheet = my.Class(cwt.SheetDatabase,{
 
  constructor: function ( impl ) {
    this.ID = impl.ID;
    this.cost = 0;
    this.range = 0;
    this.movetype = null;
    this.vision = 1;
    this.fuel = 0;
    this.captures = 0;
    this.ammo = ( impl.ammo !== void 0 )? impl.ammo : 0;
    this.attack = impl.attack;
    this.assets = impl.assets;
    
    cwt.UnitSheet.registerSheet(this);
  }
});