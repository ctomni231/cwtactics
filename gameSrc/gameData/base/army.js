cwt.ArmySheet = my.Class({

  constructor: function ( impl ) {
    this.ID = impl.ID;
    
    cwt.ArmySheet.registerSheet(this);
  }
});

my.extendClass(cwt.ArmySheet,cwt.SheetDatabase);