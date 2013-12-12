// commands
controller.action_registerCommands("weather_change");
controller.action_registerCommands("weather_calculateNext");

// event
model.event_define("weather_change");

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
  if( model.weather_data !== null && model.weather_data === model.data_defaultWeatherSheet ){
    
    var list = model.data_nonDefaultWeatherTypes;
    newTp = list[ parseInt(Math.random()*list.length,10) ].ID;
    duration = 1;
  }
  else{
    
    // Take default weather and calculate a random amount of days
    newTp = model.data_defaultWeatherSheet.ID;
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
  assert( model.data_weatherSheets.hasOwnProperty(wth) );
  
  model.weather_data = model.data_weatherSheets[wth];
  model.fog_recalculateFogMap();

	model.events.weather_change( wth );
};
