package com.system.data.script;

import com.client.model.object.Tile;
import com.client.model.object.Unit;

/**
 * 
 * Static class Trigger object holds instances which are
 * called due a trigger activation.
 * 
 */
public class Trigger_Object {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */

	private static Tile field1;
	private static Tile field2;
	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	/**
	 * Returns the first saved tile.
	 */
	public static Tile getField1() {
		return field1;
	}
	
	/**
	 * Returns the second saved tile.
	 */
	public static Tile getField2() {
		return field2;
	}

   /**
 	* Returns the unit from the first saved tile. 
 	*/
	public static Unit getUnit1() {
		if( field1 == null ) return null;
		return field1.getUnit();
	}

   /**
	* Returns the unit from the first saved tile. 
	*/
	public static Unit getUnit2() {
		if( field2 == null ) return null;
		return field2.getUnit();
	}
	
	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	/**
	 * Calls a new trigger object from two tiles.
	 */
	public static void triggerCall( Tile afield1 , Tile afield2 ){
		field1 = afield1;
		field2 = afield2;
	}
	
	
	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */

	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

}

