package com.client.model;

import com.client.model.object.Game;
import com.client.model.object.Player;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.DynamicMemory;
import com.system.meowShell.Script_Database;

/**
 * Class turn controls the internal 
 * turn based logic.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Turn {

	/*
	 * VARIABLES
	 * ********* 
	 */
	
	private static Player turnPlayer;
	private static int dayCounter;

	
	
	/*
	 * ACCESSING METHODS
	 * *****************
	 */

	/**
	 * Sets the current player.
	 */
	public static void setPlayer( Player turnPlayer ) {
		Turn.turnPlayer = turnPlayer;
	}

	/**
	 * Returns the current player.
	 */
	public static Player getPlayer() {
		return turnPlayer;
	}
	
	/**
	 * Returns the current day. 
	 */
	public static int getDay() {
		return dayCounter;
	}

	/**
	 * Increases the turn counter.
	 */
	public static void increaseTurnCounter(){
		dayCounter++;
	}
	
	

	/*
	 * WORK METHODS
	 * ************
	 */

	/**
	 * Starts the turn for the player.
	 */
	public static void startTurn( Player newPlayer ){
		
		// SET CURRENT PLAYER AND UPDATE CLIENT INSTANCE
		// IF POSSIBLE
		setPlayer( newPlayer );
		if( Instance.instanceOfClient(newPlayer) ) Instance.setCurPlayer(newPlayer);
				
		// ONLY MASTER ( SERVER ) PLAYER CHANGES WEATHER AND INCREASES
		// TURN COUNTERS
		if( newPlayer == Game.getMaster() ){
			increaseTurnCounter();
			Weather.decreaseLeftDays();
			if( Instance.instanceOfClient(newPlayer) && Weather.getLeftDays() == 0 ) Weather.changeWeather();
		}
		
		// CHECK EFFECTS
		checkStartTurnEffects(newPlayer);
		
		// RESET FOG
		Fog.processFog();
	}

	/**
	 * End turn for old player.
	 */
	public static void endTurn( Player oldPlayer ){
		checkEndTurnEffects(oldPlayer);
	}

	/**
	 * Starts next turn.
	 */
	public static void nextTurn(){
		
		// VARIABLES
		Player oldPlayer = getPlayer();
		Player newPlayer = Game.getNextPlayer();
		
		// END OLD TURN AND START NEW TURN
		endTurn(oldPlayer);
		startTurn(newPlayer);
	} 
	
	/**
	 * Checks all effects for the turn end of the 
	 * player of the ending turn.
	 */
	private static void checkEndTurnEffects( Player oldPl ){
		
		// CHECK EFFECTS FOR EVERY UNIT OF PLAYER
		for( Unit unit : oldPl.getUnits() ){
			DynamicMemory.setUnit(unit);
			Script_Database.checkAll("TURN_END_UNITS");
			DynamicMemory.reset();
			unit.canAct(true);
		}
		
		// CHECK EFFECTS FOR EVERY PROPERTY OF PLAYER
		for( Tile property : oldPl.getProperties() ){
			DynamicMemory.setTile(property);
			Script_Database.checkAll("TURN_END_TILES");
			DynamicMemory.reset();
		}
		
	}
	
	/**
	 * Checks all effects for the turn start of the 
	 * next player.
	 */
	private static void checkStartTurnEffects( Player newPl ){
		
		// CHECK EFFECTS FOR EVERY UNIT OF PLAYER
		for( Unit unit : newPl.getUnits() ){
			DynamicMemory.setUnit(unit);
			Script_Database.checkAll("TURN_START_UNITS");
			DynamicMemory.reset();
		}
		
		// CHECK EFFECTS FOR EVERY PROPERTY OF PLAYER
		for( Tile property : newPl.getProperties() ){
			DynamicMemory.setTile(property);
			Script_Database.checkAll("TURN_START_TILES");
			DynamicMemory.reset();
		}
	}
	
	
	
	/*
	 * OUTPUT METHODS
	 * ************** 
	 */
	
	/**
	 * Returns status of Turn class.
	 */
	public static String getStatus(){
		return "TURN :: It's day number "+getDay()+" and "+getPlayer().getName()+" has it's turn.";
	}
}

