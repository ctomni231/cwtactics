cwt.TileSheet = my.Class(cwt.SheetDatabase,{

  constructor: function ( impl ) {
    this.ID = impl.ID;
    
    cwt.TileSheet.registerSheet(this);
  }
});