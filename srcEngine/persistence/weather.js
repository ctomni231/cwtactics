model.data_weatherParser.addHandler(function( sheet ){
  assert( util.isUndefined(sheet.defaultWeather) || util.isBoolean(sheet.defaultWeather) );
});

controller.persistence_defineHandler(
  
  // load
  function( dom ){
    if( dom.wth ){

      assert( model.data_weatherSheets.hasOwnProperty(dom.wth) );
      
      // set weather
      model.weather_data = model.data_weatherSheets[dom.wth];
    }
    else{
      model.weather_data = model.data_defaultWeatherSheet;
      // if( controller.isHost() ) model.weather_calculateNext();
    }
  },
  
  // save
  function( dom ){
    dom.wth = model.weather_data.ID;
  }
);