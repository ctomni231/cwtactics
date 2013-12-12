model.data_weatherParser.addHandler(function( sheet ){
  assert( util.isUndefined(sheet.defaultWeather) || util.isBoolean(sheet.defaultWeather) );
});