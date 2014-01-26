cwt.WeatherSheet = my.Class({

  constructor: function ( impl ) {
    this.ID = impl.ID;
    
    cwt.WeatherSheet.registerSheet(this);
  }
});

my.extendClass(cwt.WeatherSheet,cwt.SheetDatabase);