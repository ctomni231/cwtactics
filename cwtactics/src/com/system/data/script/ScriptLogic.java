package com.system.data.script;

import com.system.data.Data;
import com.system.log.Logger;

/**
 * Script logic class.
 *  
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class ScriptLogic {

	/*
	 * ENUMERATIONS
	 * ************
	 */
	
	public static final int FULL = -1;

	public enum ScriptKey{
		
		// RELATIONSHIP
		IS,
		IS_NOT,
		IS_OWNER_OF,
		IS_ON,
		IS_NOT_ON,
		HAS,
		HAS_NOT,
		GREATER,
		LOWER,
		REPAIR_POSSIBLE,
		SUPPLY_POSSIBLE,
		IS_HIDDEN,
 
		// CONDITION OBJECT
    	WEAPON,
    	AMMO,
    	FUEL,
    	HEALTH,
    	TYPE_OF_TILE,
    	TYPE_OF_UNIT,
    	TYPE_OF_DEFENDER_TILE,
    	TYPE_OF_DEFENDER_UNIT,
    	TAGS_OF_UNIT,
    	TAGS_OF_TILE,
    	TAGS_OF_DEFENDER_TILE,
    	TAGS_OF_DEFENDER_UNIT,
    	TYPE_OF_WEATHER,
    	DAY_NUMBER,
    	X_POSITION_OF_TILE,
    	Y_POSITION_OF_TILE,
    	X_POSITION_OF_UNIT,
    	Y_POSITION_OF_UNIT,
    		
    		//TODO SPECIAL CONDITION OBJECTS WITH HELP VARIABLE
    		AMOUNT_OF_RESSOURCE,

    	// ACTION OBJECT
    	UNIT,
    	TILE,
    	ATTACK,
    	DEFENSE,
    	FOG,
    	MOVE,
    	GAME,
    	//FUEL
    	//AMMO
    	SIGHT,
    	MOVEPOINTS,

    	// ACTION
    	DEFEAT_PLAYER,
    	DESTROY,
    	SUPPLY,
    	HEAL,
    	GIVE_FUNDS,
		INCREASE_BY,
		INCREASE_BY_RANDOM,
		DECREASE_BY,
		DECREASE_BY_RANDOM,
		SET_TO,
		SET_TO_RANDOM
    }
    
    public enum Trigger{
    	
    	TURN_START_TILES,
        TURN_START_UNITS,
        TURN_END_TILES,
        TURN_END_UNITS,
        WANT_TO_BUILD,
        UNIT_BUILDED,
        UNIT_WILL_MOVE,
        UNIT_MOVED,
        UNIT_ATTACK,
        UNIT_DEFEND,
        UNIT_COUNTERATTACK,
        UNIT_DESTROYED,
        WEATHER_CHANGED,
        BUILDING_CAPTURED,
        PLAYER_LOOSED,
        VISION_UNIT,
        VISION_TILE,
        MOVE_ONTO
    }
    
    
    
    /*
     * WORK METHODS
     * ************
     */
    
	/**
	 * Returns the relationship value.
	 */
    public static ScriptKey getRelation( String text ){

		// CHECK EVERY COMMAND
		for( ScriptKey enumObj : ScriptKey.values() ){ 
			if( text.equals( enumObj.toString() ) ) return enumObj;
		}

		// IF YOU ARRIVE THIS POINT, THROW WARNING MESSAGE
		Logger.warn( "Scripengine :: Got unknown script keyword ==> "+text );
		return null;
	}
    
    /**
     * Returns the trigger for a given String.
     */
    public static Trigger getTrigger( String text ){

		// CHECK EVERY COMMAND
		for( Trigger enumObj : Trigger.values() ){ 
			if( text.equals( enumObj.toString() ) ) return enumObj;
		}
			 
		// IF YOU ARRIVE THIS POINT, THROW WARNING MESSAGE
		Logger.warn( "Scripengine :: Got unknown trigger keyword ==> "+text);
		return null;
	}

	/**
	 * Returns the target value.
	 */
	public static int getActionValue( String text ){
		
				if( text == null )					return -99;
		else	if( Data.existTagID(text) ) 		return Data.getIntegerTagID(text);
		else	if( text.equals("FULL"))			return FULL;
		// plain integer value
		else{
			try{ return Integer.parseInt( text ); }
			catch( NumberFormatException e ){
				System.err.println("Scripengine :: Found unknown script keyword ( "+text+" ) , no parser known and not a value integer value");
				return -1;
			}
		}
	}
	
}

