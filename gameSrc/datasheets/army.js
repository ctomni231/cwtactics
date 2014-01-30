cwt.ArmySheet = my.Class(cwt.SheetDatabase,{

  constructor: function ( impl ) {
    this.ID = impl.ID;
    
    cwt.ArmySheet.registerSheet(this);
  }
});