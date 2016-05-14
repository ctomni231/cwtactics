model.event_on("parse_weather",function( sheet ){
  if( sheet.defaultWeather !== void 0 ) assertBool( sheet.defaultWeather );
});
