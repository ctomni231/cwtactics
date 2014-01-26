cwt.CoSheet = my.Class({

  constructor: function ( impl ) {
    this.ID = impl.ID;
    
    cwt.CoSheet.registerSheet(this);
  }
});

my.extendClass(cwt.CoSheet,cwt.SheetDatabase);