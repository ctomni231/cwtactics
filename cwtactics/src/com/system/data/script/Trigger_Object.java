package com.system.data.script;

import com.client.model.object.Tile;
import com.client.model.object.Unit;

/**
 * Static class Trigger object holds instances which are
 * called due a trigger activation.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Trigger_Object {

	/*
	 * VARIABLES
	 * *********
	 */

	private static Tile tile;
	private static Unit unit;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************ 
	 */
	
	/**
	 * Returns the tile.
	 */
	public static Tile getTile() {
		return tile;
	}
	
   /**
 	* Returns the unit. 
 	*/
	public static Unit getUnit() {
		return unit;
	}

	
	
	/*
	 * WORK METHODS
	 * ************ 
	 */
	
	/**
	 * Calls a new trigger object from two tiles.
	 */
	public static void triggerCall( Tile tile , Unit unit ){
		Trigger_Object.tile = tile;
		Trigger_Object.unit = unit;
	}

}

