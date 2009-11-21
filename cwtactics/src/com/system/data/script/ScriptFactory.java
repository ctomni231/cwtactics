package com.system.data.script;

import java.util.ArrayList;
import java.util.HashMap;

import com.system.ID;
import com.system.data.Data;


public class ScriptFactory {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private static HashMap< ID.Trigger , ArrayList<Script> > scripts;
	private static Script script;

	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	static{
		scripts = new HashMap< ID.Trigger , ArrayList<Script>>();
	}
	
	

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	/**
	 * Sets the last added script.
	 */
	public static void setLast( Script s ){
		script = s;
	}
	
	/**
	 * Returns the last added script.
	 */
	public static Script getLast(){
		return script;
	}
	
	/**
	 * Adds a script to the stack at given trigger.
	 */
	public static void addScript( ID.Trigger trigger , Script s ){
		
		// check the trigger array
		if( scripts.get(trigger) == null ){
			scripts.put( trigger , new ArrayList<Script>() );
		}
		
		// pit the script into trigger array
		scripts.get(trigger).add(s);
		
		setLast(s);
	}
	

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	/**
	 * Checks all scripts for a given trigger.
	 */
	public static void checkAll( ID.Trigger trigger ){
		
		if( !scripts.containsKey(trigger) ) return;
		for( Script s : scripts.get(trigger) ){
			if( s.statementTrue() ) s.callAction();
		}
	}
	
	/**
	 * Returns the action value.
	 */
	public static ID.TriggerAction getAction( String text ){
			
			 if( text.equals("DESTROY_UNIT")) 		return ID.TriggerAction.DESTROY_UNIT;
		else if( text.equals("GIVE_FUNDS")) 		return ID.TriggerAction.GIVE_FUNDS;
		else if( text.equals("RESUPPLY")) 			return ID.TriggerAction.RESUPPLY_UNIT;
		else if( text.equals("HEAL_UNIT")) 			return ID.TriggerAction.HEAL_UNIT;
		else if( text.equals("DECREASE_FUEL")) 		return ID.TriggerAction.DECREASE_FUEL;
		else if( text.equals("INCREASE_ATTACK_BY_RANDOM")) 	return ID.TriggerAction.INCREASE_ATTACK_BY_RANDOM;
		else if( text.equals("DECREASE_ATTACK_BY_RANDOM")) 	return ID.TriggerAction.DECREASE_ATTACK_BY_RANDOM;
		else if( text.equals("INCREASE_DEFENSE_BY_RANDOM")) return ID.TriggerAction.INCREASE_DEFENSE_BY_RANDOM;
		else if( text.equals("DECREASE_DEFENSE_BY_RANDOM")) return ID.TriggerAction.DECREASE_DEFENSE_BY_RANDOM;
		else if( text.equals("INCREASE_ATTACK")) 	return ID.TriggerAction.INCREASE_ATTACK;
		else if( text.equals("DECREASE_ATTACK")) 	return ID.TriggerAction.DECREASE_ATTACK;
		else if( text.equals("INCREASE_DEFENSE")) 	return ID.TriggerAction.INCREASE_DEFENSE;
		else if( text.equals("DECREASE_DEFENSE")) 	return ID.TriggerAction.DECREASE_DEFENSE;
		else if( text.equals("INCREASE_SIGHT")) 	return ID.TriggerAction.INCREASE_SIGHT;
		else if( text.equals("DECREASE_SIGHT")) 	return ID.TriggerAction.DECREASE_SIGHT;
		else if( text.equals("DECREASE_MOVEPOINTS"))return ID.TriggerAction.INCREASE_MOVEPOINTS;
		else if( text.equals("INCREASE_MOVEPOINTS"))return ID.TriggerAction.DECREASE_MOVEPOINTS;
		else if( text.equals("INCREASE_MOVECOST")) 	return ID.TriggerAction.INCREASE_MOVECOST;
		else if( text.equals("DECREASE_MOVECOST")) 	return ID.TriggerAction.DECREASE_MOVECOST;
		else if( text.equals("SET_MOVECOST")) 		return ID.TriggerAction.SET_MOVECOST;
		else if( text.equals("SET_SIGHT")) 			return ID.TriggerAction.SET_SIGHT;
		return null;
	}
	
	/**
	 * Returns the action object value.
	 */
	public static ID.TriggerAction_Obj getActionObj( String text ){
		
			 if( text.equals("FIELD")) 			return ID.TriggerAction_Obj.FIELD;
		else if( text.equals("UNIT")) 			return ID.TriggerAction_Obj.UNIT;
		else if( text.equals("FIELD2")) 		return ID.TriggerAction_Obj.FIELD2;
		else if( text.equals("UNIT1")) 			return ID.TriggerAction_Obj.UNIT2;
		return null;
	}
	
	/**
	 * Returns the target value.
	 */
	public static int getActionValue( String text ){
		
				if( Data.existTagID(text) ) 		return Data.getIntegerTagID(text);
		else	if( Data.existIntegerID(text) ) 	return Data.getIntegerID(text);
		else 	if( text == null )					return -1;
				
		// plain integer value
		else{
			try{
				return Integer.parseInt( text ); 
			}
			catch( NumberFormatException e ){
				System.err.println("Action VAlue : Found unknown script command ( "+text+" ) , no parser known and not a value integer value");
				return -1;
			}
		}
	}
	
	/**
	 * Returns the condition value.
	 */
	public static ID.TriggerTest getCondition( String text ){
		
			 if( text.equals("UNIT_TAG")) 					return ID.TriggerTest.UNIT_TAG;
		else if( text.equals("FIELD_TAG")) 					return ID.TriggerTest.FIELD_TAG;
		else if( text.equals("UNIT2_TAG"))	 				return ID.TriggerTest.UNIT2_TAG;
		else if( text.equals("FIELD_TYPE"))					return ID.TriggerTest.FIELD_TYPE;
		else if( text.equals("WEATHER_TYPE"))				return ID.TriggerTest.WEATHER_TYPE;
		else if( text.equals("UNIT_TYPE"))	 				return ID.TriggerTest.UNIT_TYPE;
		else if( text.equals("FIELD2_TAG"))		 			return ID.TriggerTest.FIELD2_TAG;
		else if( text.equals("FUEL_OF_UNIT"))	 			return ID.TriggerTest.FUEL_OF_UNIT;
		else if( text.equals("AMMO_OF_UNIT")) 				return ID.TriggerTest.AMMO_OF_UNIT;
		else if( text.equals("HEALTH_OF_UNIT")) 			return ID.TriggerTest.HEALTH_OF_UNIT;
		else if( text.equals("UNIT")) 						return ID.TriggerTest.UNIT;
		else if( text.equals("FIELD")) 						return ID.TriggerTest.FIELD;
		return null;
	}  
	
	/**
	 * Returns the relationship value.
	 */
	public static ID.Relationship getRelation( String text ){
		
				if( text.equals("IS"))				return ID.Relationship.IS;
		else	if( text.equals("IS_NOT"))			return ID.Relationship.IS_NOT;
		else	if( text.equals("LESS_THAN"))		return ID.Relationship.LESS_THAN;
		else	if( text.equals("MORE_THAN"))		return ID.Relationship.MORE_THAN;
		else	if( text.equals("CAN_REPAIR"))		return ID.Relationship.CAN_REPAIR;
		else	if( text.equals("CAN_PAY_REPAIR"))	return ID.Relationship.CAN_PAY_REPAIR;
		else	if( text.equals("IS_OWNER_OF"))		return ID.Relationship.IS_OWNER_OF;
		return null;
	}
	
	/**
	 * Returns the target value.
	 */
	public static int getValue( String text ){
		
				if( Data.existTagID(text) ) 		return Data.getIntegerTagID(text);
		else	if( Data.existIntegerID(text) ) 	return Data.getIntegerID(text);
		else	if( text.equals("FIELD2"))			return ID.TILE2;
		else	if( text.equals("UNIT2"))			return ID.UNIT2;
		else	if( text.equals("FIELD"))			return ID.TILE;
		else	if( text.equals("UNIT"))			return ID.UNIT;
		else	if( text.equals("FULL"))			return ID.FULL;
		else	if( text.equals("HIDDEN"))			return ID.HIDDEN;
				
		// plain integer value
		else{
			try{
				return Integer.parseInt( text ); 
			}
			catch( NumberFormatException e ){
				System.err.println("Found unknown script command ( "+text+" ) , no parser known and not a value integer value");
				return -1;
			}
		}
	}
		
	

	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
	
	/**
	 * Prints out the complete content of the script database.
	 */
	public static void printDatabase(){
		for( ID.Trigger trig : scripts.keySet() ){
			System.out.println();
			System.out.println("TRIGGER :: "+trig);
			System.out.println();
			for( Script script : scripts.get(trig) ){
				System.out.println();
				script.print();
				System.out.println();
			}
		}
	}

}

