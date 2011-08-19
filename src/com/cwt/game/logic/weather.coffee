neko.module "logic.weather", ( require, exports ) -> 

  current = null
  leftTicks = 0

  setWeather = ( weather, ticks ) ->
    throw new Error "InvalidTickNumber" unless ticks >= 0
    throw new Error "InvalidWeatherType" unless weather instanceof WeatherType

    leftTicks = ticks
    current = weather
	return

  setRandomWeather = ->
    setWeather null, Math.random * 10
    return
	
  exports.tick = ->
    leftTicks--
    setRandomWeather() if leftTicks < 0
    return

  exports.active = -> 
    return current