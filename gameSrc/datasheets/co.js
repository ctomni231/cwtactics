cwt.CoSheet = my.Class( cwt.SheetDatabase, {

  constructor: function ( impl ) {
    this.ID = impl.ID;
    
    cwt.CoSheet.registerSheet(this);
  }
});