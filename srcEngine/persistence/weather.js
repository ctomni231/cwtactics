model.data_weatherParser.addHandler(function( sheet ){
  assert( util.isUndefined(sheet.defaultWeather) || util.isBoolean(sheet.defaultWeather) );
});

controller.persistence_defineHandler(
  
  
  // -----------------------------------------------------------------------
  // load map data
  //

  function(){
    model.weather_data = model.data_defaultWeatherSheet;
  },

  // -----------------------------------------------------------------------
  // load save game data
  //

  function( dom ){
    assert( model.data_weatherSheets.hasOwnProperty(dom.wth) );
      
    // set weather
    model.weather_data = model.data_weatherSheets[dom.wth];
  },
  
  // -----------------------------------------------------------------------
  // save game data
  //
  
  function( dom ){
    dom.wth = model.weather_data.ID;
  }
);