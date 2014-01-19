// Calculates the next weather and adds the result as timed event to
// the day events. **Only invokable by the host instance.**
//
model.event_on("weather_calculateNext",function( wth ){
  var newTp;
  var duration;

  // this event is only host invocable
  assert(controller.network_isHost());

  // Search a random weather if the last weather was `null` or the default weather type
  if( model.weather_data !== null && model.weather_data === model.data_defaultWeatherSheet ){

    var list = model.data_nonDefaultWeatherTypes;
    newTp = list[ parseInt(Math.random()*list.length,10) ].ID;
    duration = 1;

  } else {

    // Take default weather and calculate a random amount of days
    newTp = model.data_defaultWeatherSheet.ID;
    duration = controller.configValue("weatherMinDays") + parseInt(
      controller.configValue("weatherRandomDays")*Math.random(), 10
    );
  }

  controller.commandStack_sharedInvokement("weather_change",newTp);
  model.events.dayEvent( duration, "weather_calculateNext" );
});

// Changes the weather to a given type.
// Invokes the `weather_change` event.
//
model.event_on("weather_change",function( wth ){
  model.weather_data = model.data_weatherSheets[wth];
  model.events.recalculateFogMap();
});
