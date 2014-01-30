cwt.MovetypeSheet = my.Class(cwt.SheetDatabase,{

  constructor: function ( impl ) {
    this.ID = impl.ID;
    
    cwt.MovetypeSheet.registerSheet(this);
  }
});