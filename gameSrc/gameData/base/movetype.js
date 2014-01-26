cwt.MovetypeSheet = my.Class({

  constructor: function ( impl ) {
    this.ID = impl.ID;
    
    cwt.MovetypeSheet.registerSheet(this);
  }
});

my.extendClass(cwt.MovetypeSheet,cwt.SheetDatabase);