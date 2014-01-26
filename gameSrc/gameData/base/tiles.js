cwt.TileSheet = my.Class({

  constructor: function ( impl ) {
    this.ID = impl.ID;
    
    cwt.TileSheet.registerSheet(this);
  }
});

my.extendClass(cwt.TileSheet,cwt.SheetDatabase);