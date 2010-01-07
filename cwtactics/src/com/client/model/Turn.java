package com.client.model;

import com.client.model.object.Game;
import com.client.model.object.Player;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.script.ScriptFactory;
import com.system.data.script.Trigger_Object;
import com.system.data.script.ScriptLogic;

public class Turn {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private static Player turnPlayer;
	private static int dayCounter;
	private static int turns;

	
	static{
		turns = 0;
	}
	
	
	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	public static void setPlayer( Player turnPlayer ) {
		Turn.turnPlayer = turnPlayer;
	}
	
	public static Player getPlayer() {
		return turnPlayer;
	}
	
	public static void setDay(int dayCounter) {
		Turn.dayCounter = dayCounter;
	}
	
	public static int getDay() {
		return dayCounter;
	}
	
	public static void increaseTurnCounter(){
		turns++;
	}
	
	

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	public static void startTurn( Player newPlayer ){
		
		// set next player, and set the player of current instance if it's an instance
		// of this client
		setPlayer( newPlayer );
		if( Instance.instanceOfClient(newPlayer) ) Instance.setCurPlayer(newPlayer);
				
		// reset fog
		Fog.processFog();
	}
	
	public static void nextTurn(){
		
		// Variables
		Player oldPlayer = getPlayer();
		Player newPlayer = Game.getNextPlayer();
		
		// prepare turn
		prepareRound(oldPlayer, newPlayer);
		
		// decrease left weather days, if the master player is in this client, then change weather
		// and send data over network to the other clients.
		if( newPlayer == Game.getMaster() ){
			increaseTurnCounter();
			Weather.decreaseLeftDays();
			if( Instance.instanceOfClient(newPlayer) && Weather.getLeftDays() == 0 ) Weather.changeWeather();
		}
		
		// start turn now
		startTurn(newPlayer);
	} 
	
	private static void prepareRound( Player oldPl , Player newPl ){
		
		// end setup all units from old player
		for( Unit unit : oldPl.getUnits() ){
			Trigger_Object.triggerCall( unit , null );
			ScriptFactory.checkAll( ScriptLogic.Trigger.TURN_END_UNITS );
			unit.canAct(true);
		}
		
		// end setup all properties from old player 
		for( Tile property : oldPl.getProperties() ){
			Trigger_Object.triggerCall( property , null );
			ScriptFactory.checkAll( ScriptLogic.Trigger.TURN_START_TILES );	
		}
		
		// setup all units from new player
		for( Unit unit : newPl.getUnits() ){
			Trigger_Object.triggerCall( unit , null );
			ScriptFactory.checkAll( ScriptLogic.Trigger.TURN_START_UNITS );
		}
		
		// get funds and repairs for new player
		for( Tile property : newPl.getProperties() ){
			Trigger_Object.triggerCall( property , null );
			ScriptFactory.checkAll( ScriptLogic.Trigger.TURN_START_TILES );	
		}
	}
	

}

