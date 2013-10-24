controller.registerInvokableCommand("weatherChange");
controller.registerInvokableCommand("weatherCalcNext");

controller.defineEvent(             "weatherChanged");

controller.defineGameScriptable(    "weatherNeutralized",0,1);

controller.defineGameConfig(        "weatherMinDays",   1,5,1);
controller.defineGameConfig(        "weatherRandomDays",0,5,4);

// TODO -> into persistence
model.weatherTypeParser.addHandler(function( sheet ){
  if( typeof sheet.defaultWeather !== "undefined" ) expect(sheet.defaultWeather).boolean();
  expect(sheet.rules).list();
});

controller.persistenceHandler(
  
  // load
  function( dom ){
    if( typeof dom.wth !== "undefined" ){
      expect(dom.wth).string().notEmpty().isIn(model.weatherTypes);
      model.weather = model.weatherTypes[dom.wth];
    } else {
      model.weather = model.defaultWeatherType;
      
      // the host tries to calculate the next weather which will be activated after a random number of days
      if( controller.isHost() ) model.weatherCalcNext();
    }
  },
  
  // save
  function( dom ){
    dom.wth = model.weather.ID;
  }
);
// TODO -> into persistence


// The active weather type object.
//
model.weather = null;

// Calculates the next weather and adds the result as timed event to the day events. **Only invokable
// by the host instance.**
//
model.weatherCalcNext =/* model.calculateNextWeather = */ function(){  
  var newTp,duration;
  
  // expect().isHost();
  model.clientAssertIsHost();
  
  // Search a random weather if the current weather is `null` or the default weather type
  if( model.weather !== null && model.weather === model.defaultWeatherType ){
    
    // Calculates a special weather that durates for one turn
    newTp     = model.nonDefaultWeatherType[ parseInt(Math.random()*model.nonDefaultWeatherType.length,10) ].ID;
    duration  = 1;
  } else {
    
    // Take default weather and calculate a random amount of days
    newTp     = model.defaultWeatherType.ID;
    duration  = controller.configValue("weatherMinDays") + 
                parseInt( controller.configValue("weatherRandomDays")*Math.random(), 10 );
    // duration  = model.weatherMinDays() + parseInt( model.weatherRandomDays()*Math.random(), 10 );
  }
  
  controller.sharedInvokement("changeWeather",[newTp]);
  
  model.pushTimedEvent( 
    model.daysToTurns(duration), 
    "weatherCalcNext",
    []
  );
};

// Expactation that expects a value to be a valid ID for a weather type.
//
model.weatherAssertValidId = expectation(expect.string,expect.notEmpty,expect.isIn,model.weatherTypes);

// Changes the weather to a given type. Invokes the `weatherChanged` event.
//
model.weatherChange = /*model.changeWeather =*/ function( wth ){
  if( DEBUG ) expect(wth).string().notEmpty().isIn(model.weatherTypes);
  if( DEBUG ) model.weatherAssertValidId(wth);
  
  model.weather = model.weatherTypes[wth];
  model.recalculateFogMap();

	controller.events.weatherChanged( wth );
};
