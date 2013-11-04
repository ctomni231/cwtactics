model.weatherTypeParser.addHandler(function( sheet ){
  assert( util.isUndefined(sheet.defaultWeather) || util.isBoolean(sheet.defaultWeather) );
});

controller.persistence_defineHandler(
  
  // load
  function( dom ){
    if( dom.wth ){

      assert( model.weatherTypes.hasOwnProperty(dom.wth) );
      
      // set weather
      model.weather_data = model.weatherTypes[dom.wth];
    }
    else{
      model.weather_data = model.defaultWeatherType;
      if( controller.isHost() ) model.weather_calculateNext();
    }
  },
  
  // save
  function( dom ){
    dom.wth = model.weather_data.ID;
  }
);