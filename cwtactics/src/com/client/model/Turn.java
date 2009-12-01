package com.client.model;

import com.client.model.object.Game;
import com.client.model.object.Player;
import com.client.model.object.Unit;

public class Turn {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private static Player turnPlayer;
	private static int dayCounter;

	
	
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
	
	

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	public static void nextTurn(){
		
		// reset units
		for( Unit unit : getPlayer().getUnits() ){
			unit.canAct(true);
		}
		
		// set next player
		setPlayer( Game.getNextPlayer() );
		
		Fog.processFog( getPlayer() );
	}
	
	

}

