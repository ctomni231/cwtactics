// commands
controller.action_registerCommands("weather_change");
controller.action_registerCommands("weather_calculateNext");

// event
controller.event_define("weather_change");

// scriptables
controller.defineGameScriptable("neutralizeWeather",0,1);

// configs
controller.defineGameConfig("weatherMinDays",1,5,1);
controller.defineGameConfig("weatherRandomDays",0,5,4);

// The active weather type object.
//
model.weather_data = null;

// Calculates the next weather and adds the result
// as timed event to the day events. **Only invokable
// by the host instance.**
//
model.weather_calculateNext = function(){  
  var newTp;
  var duration;
  
  assert(controller.isHost());
  
  // Search a random weather if the last weather was `null` or the default weather type
  if( model.weather_data !== null && model.weather_data === model.defaultWeatherType ){
    
    var list = model.nonDefaultWeatherType;
    newTp = list[ parseInt(Math.random()*list.length,10) ].ID;
    duration = 1;
  }
  else{
    
    // Take default weather and calculate a random amount of days
    newTp = model.defaultWeatherType.ID;
    duration = controller.configValue("weatherMinDays") + parseInt(
      controller.configValue("weatherRandomDays")*Math.random(), 10
    );
  }
  
  controller.action_sharedInvoke("weather_change",[newTp]);
  
  model.dayEvents_push( 
    model.round_daysToTurns(duration), 
    "weather_calculateNext",
    []
  );
};

// Changes the weather to a given type. 
// Invokes the `weather_change` event.
//
model.weather_change = function( wth ){
  assert( model.weatherTypes.hasOwnProperty(wth) );
  
  model.weather_data = model.weatherTypes[wth];
  model.fog_recalculateFogMap();

	controller.events.weather_change( wth );
};
