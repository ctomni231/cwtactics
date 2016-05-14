controller.defineGameScriptable( "neutralizeWeather", 0,1);
controller.defineGameConfig(     "weatherMinDays",    1,5,1);
controller.defineGameConfig(     "weatherRandomDays", 0,5,4);

// The active weather type object.
//
model.weather_data = null;
