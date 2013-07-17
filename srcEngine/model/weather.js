// Weather Module
// 

// ### Meta Data

controller.registerInvokableCommand("changeWeather");
controller.registerInvokableCommand("calculateNextWeather");

controller.defineEvent("changeWeather");

controller.defineGameScriptable("neutralizeWeather",0,1);

controller.defineGameConfig("weatherMinDays",1,5,1);
controller.defineGameConfig("weatherRandomDays",0,5,4);

model.weatherTypeParser.addHandler(function( sheet ){
  if( !util.expectBoolean(sheet,"defaultWeather",false) ) return false;
  if( !util.expectNumber(sheet,"vision",false,true,-5,+5) ) return false;
  if( !util.expectNumber(sheet,"att",false,true,-100,+100) ) return false;
  if( !util.expectNumber(sheet,"minRange",false,true,-5,+5) ) return false;
  if( !util.expectNumber(sheet,"maxRange",false,true,-5,+5) ) return false;
});

// ---

// ### Model

// The active weather type object.
model.weather = null;

// Define persistence handler
controller.persistenceHandler(
  
  // load
  function( dom ){
    if( dom.wth ){
      
      // check data
      if( !util.isIn( dom.wth, model.weatherTypes ) ){
        model.criticalError(
          constants.error.ILLEGAL_MAP_FORMAT,
          constants.error.SAVEDATA_WEATHER_MISSMATCH
        );
      }
      
      // set weather
      model.weather = model.weatherTypes[dom.wth];
    }
    else{
      model.weather = model.defaultWeatherType;
      if( controller.isHost() ) model.calculateNextWeather();
    }
  },
  
  // save
  function( dom ){
    dom.wth = model.weather.ID;
  }
);

// ---

// ### Logic

// Calculates the next weather and adds the result
// as timed event to the day events. **Only invokable
// by the host instance.**
//
model.calculateNextWeather = function(){  
  var newTp;
  var duration;
  
  if( !controller.isHost() ){
    model.criticalError( 
      constants.error.HOST_ONLY, 
      constants.error.CALC_NEXT_WEATHER 
    );
  }
  
  // Search a random weather if the last weather was `null` or 
  // the default weather type
  if( model.weather !== null && model.weather === model.defaultWeatherType ){
    
    var list = model.nonDefaultWeatherType;
    newTp = list[ parseInt(Math.random()*list.length,10) ].ID;
    duration = 1;
  }
  else{
    
    // Take default weather and calculate a random amount of days
    newTp = model.defaultWeatherType.ID;
    duration = controller.configValue("weatherMinDays") + parseInt( controller.configValue("weatherRandomDays")*Math.random(), 10);
  }
  
  model.changeWeather.callAsCommand(newTp);
  
  model.pushTimedEvent( 
    model.daysToTurns(duration), 
    model.calculateNextWeather.callToList() 
  );
};

// Changes the weather to a given type. 
// Invokes the `changeWeather` event.
//
// @param {String} wth
//
model.changeWeather = function( wth ){
  
  // check weather type
  if( !model.weatherTypes.hasOwnProperty(wth) ){
    model.criticalError( constants.error.ILLEGAL_DATA, constants.error.UNKNOWN_WEATHER );
  }
  
  model.weather = model.weatherTypes[wth];
  
  // Invoke event
  var evCb = controller.events.changeWeather;
  if( evCb ) evCb( wth );
};