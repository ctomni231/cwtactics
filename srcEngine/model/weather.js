/**
 * The type of the active weather.
 */
model.weather = null;

/**
 * 
 */
model.calculateNextWeather = function(){  
  var newTp;
  var duration;
  
  // SEARCH RANDOM WEATHER
  if( model.weather !== null && model.weather === model.defaultWeatherType ){
    var list = model.nonDefaultWeatherType;
    newTp = list[ parseInt(Math.random()*list.length,10) ].ID;
    duration = 1;
  }
  // TAKE DEFAULT WEATHER
  else{
    newTp = model.defaultWeatherType.ID;
    duration = controller.configValue("weatherMinDays") + parseInt( controller.configValue("weatherRandomDays")*Math.random(), 10);
  }
  
  model.changeWeather.callAsCommand(newTp);
  
  if( DEBUG ) util.log( "Weather will change in",duration,"days" );
  
  model.pushTimedEvent( 
    model.daysToTurns(duration), 
    model.calculateNextWeather.callToList() 
  );
};

/**
 * 
 * @param {String} wth
 * @param {Number} duration
 */
model.changeWeather = function( wth ){
  if( !model.weatherTypes.hasOwnProperty(wth)){
    util.raiseError("unknown weather type");
  }
  
  if( DEBUG ) util.log( "changing weather to",wth);
   
  model.weather = model.weatherTypes[wth];
};