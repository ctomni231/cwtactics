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
	private static Unit unit1;
	private static Unit unit2;
	
	
	
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
		return unit1;
	}

   /**
	* Returns the unit from the first saved tile. 
	*/
	public static Unit getUnit2() {
		return unit2;
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
		unit1 = null;
		unit2 = null;
		if( field1 != null ) unit1 = field1.getUnit();
		if( field2 != null ) unit2 = field2.getUnit();
	}
	
	public static void triggerCall( Tile afield1 , Tile afield2 , Unit unit1 , Unit unit2 ){
		field1 = afield1;
		field2 = afield2;
		Trigger_Object.unit1 = unit1;
		Trigger_Object.unit2 = unit2;
	}
	
	public static void triggerCall( Unit unit1 , Unit unit2 ){
		field1 = null;
		field2 = null;
		Trigger_Object.unit1 = unit1;
		Trigger_Object.unit2 = unit2;
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

