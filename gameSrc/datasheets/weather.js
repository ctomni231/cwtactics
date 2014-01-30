cwt.WeatherSheet = my.Class(cwt.SheetDatabase,{

  constructor: function ( impl ) {
    this.ID = impl.ID;
    
    cwt.WeatherSheet.registerSheet(this);
  }
});