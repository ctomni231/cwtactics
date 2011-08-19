#
# module is build with prototyping yet to show how it should look like
#
neko.define "logic.turn", ( require, exports ) ->
	
	currentPlayerID = -1
	
	# checks all effects for the turn start
	startTurn = ( player ) ->
	  # prototyping yet
	  player?.active_CO?.turnStart?( player ) # call effect is available
	  
	  # add funds from properties
	  ( player.gold += prop.sheet().funds ? 0 ) for prop in player.properties
	  
	  for unit in player.units
		
		unit.sheet().turnStart?.call(unit);
		
		# pay salary
		salary = unit.sheet().salary ? 0
		if player.gold >= salary then
		  player.gold -= salary
		else
		  # TODO: destroy unit
	
	  return
		
	# checks all effects for turn end
	endTurn = ( player ) ->	
	  # prototyping yet
	
	  player?.active_CO?.turnEnd?( player ) # call effect is available
	  
	  for unit in player.units
        unit.canAct = on					# reset canAct
        unit.sheet().turnEnd?.call(unit);   # if available react on turn end
    
      return
	
	exports.next = ->
		
		currentPlayerID++
		
		return