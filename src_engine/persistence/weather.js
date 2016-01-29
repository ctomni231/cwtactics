model.event_on("prepare_game",function( dom ){
  model.weather_data = model.data_defaultWeatherSheet;
});

model.event_on("load_game",function( dom ){
  assert( model.data_weatherSheets.hasOwnProperty(dom.wth) );
  model.weather_data = model.data_weatherSheets[dom.wth];
});

model.event_on("save_game",function( dom ){
  dom.wth = model.weather_data.ID;
});