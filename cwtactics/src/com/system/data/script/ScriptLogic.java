package com.system.data.script;

import com.system.data.Data;

public class ScriptLogic {

	/*
	 * ENUMERATIONS
	 * ************
	 */

	public static final int TILE2 = 999995;
	public static final int UNIT2 = 999996;
 	public static final int TILE = 999997;
	public static final int UNIT = 999998;
	public static final int FULL = 999999;
	public static final int HIDDEN = 1000000;
	
	public enum Relationship{
    	IS,
    	IS_NOT,
    	LESS_THAN,
    	MORE_THAN,
    	CAN_REPAIR,
    	CAN_PAY_REPAIR,
    	IS_OWNER_OF
    }
    
    public enum TriggerTest{
    	UNIT_TAG,
    	FIELD_TAG,
    	UNIT2_TAG,
    	FIELD_TYPE,
    	UNIT_TYPE,
    	WEATHER_TYPE,
    	FIELD2_TAG,
    	FUEL_OF_UNIT,
    	AMMO_OF_UNIT,
    	HEALTH_OF_UNIT,
    	FIELD,
    	UNIT
    }
    
    public enum TriggerAction{
    	DESTROY_UNIT,
    	GIVE_FUNDS,
    	RESUPPLY_UNIT,
    	HEAL_UNIT,
    	PAY_REPAIR,
    	PAY_RESUPPLY,
    	DECREASE_FUEL,
    	INCREASE_ATTACK_BY_RANDOM,
    	INCREASE_DEFENSE_BY_RANDOM,
    	DECREASE_ATTACK_BY_RANDOM,
    	DECREASE_DEFENSE_BY_RANDOM,
    	INCREASE_ATTACK,
    	INCREASE_DEFENSE,
    	DECREASE_ATTACK,
    	DECREASE_DEFENSE,
    	INCREASE_SIGHT,
    	DECREASE_SIGHT,
    	DECREASE_MOVEPOINTS,
    	INCREASE_MOVEPOINTS,
    	INCREASE_MOVECOST,
    	DECREASE_MOVECOST,
    	SET_MOVECOST,
    	SET_SIGHT
    }
    
    public enum TriggerAction_Obj{
    	FIELD,
    	UNIT,
    	FIELD2,
    	UNIT2
    }
    
    public enum Trigger{
    	TURN_START_FIELDS,
    	TURN_START_UNITS,
    	WANT_TO_BUILD,
    	UNIT_BUILDED,
    	UNIT_WILL_MOVE,
    	UNIT_MOVED,
    	UNIT_ATTACK,
    	UNIT_DEFEND,
    	UNIT_DESTROYED,
    	WEATHER_CHANGED,
    	BUILDING_CAPTURED,
    	PLAYER_LOOSED,
    	TURN_END_FIELDS,
    	TURN_END_UNITS,
    	VISION_UNIT,
    	VISION_TILE,
    	MOVE_ONTO
    }
    
    
    
    /*
     * WORK METHODS
     * ************
     */
    

	/**
	 * Returns the action value.
	 */
	public static TriggerAction getAction( String text ){
			
			 if( text.equals("DESTROY_UNIT")) 		return TriggerAction.DESTROY_UNIT;
		else if( text.equals("GIVE_FUNDS")) 		return TriggerAction.GIVE_FUNDS;
		else if( text.equals("RESUPPLY")) 			return TriggerAction.RESUPPLY_UNIT;
		else if( text.equals("HEAL_UNIT")) 			return TriggerAction.HEAL_UNIT;
		else if( text.equals("DECREASE_FUEL")) 		return TriggerAction.DECREASE_FUEL;
		else if( text.equals("INCREASE_ATTACK_BY_RANDOM")) 	return TriggerAction.INCREASE_ATTACK_BY_RANDOM;
		else if( text.equals("DECREASE_ATTACK_BY_RANDOM")) 	return TriggerAction.DECREASE_ATTACK_BY_RANDOM;
		else if( text.equals("INCREASE_DEFENSE_BY_RANDOM")) return TriggerAction.INCREASE_DEFENSE_BY_RANDOM;
		else if( text.equals("DECREASE_DEFENSE_BY_RANDOM")) return TriggerAction.DECREASE_DEFENSE_BY_RANDOM;
		else if( text.equals("INCREASE_ATTACK")) 	return TriggerAction.INCREASE_ATTACK;
		else if( text.equals("DECREASE_ATTACK")) 	return TriggerAction.DECREASE_ATTACK;
		else if( text.equals("INCREASE_DEFENSE")) 	return TriggerAction.INCREASE_DEFENSE;
		else if( text.equals("DECREASE_DEFENSE")) 	return TriggerAction.DECREASE_DEFENSE;
		else if( text.equals("INCREASE_SIGHT")) 	return TriggerAction.INCREASE_SIGHT;
		else if( text.equals("DECREASE_SIGHT")) 	return TriggerAction.DECREASE_SIGHT;
		else if( text.equals("DECREASE_MOVEPOINTS"))return TriggerAction.INCREASE_MOVEPOINTS;
		else if( text.equals("INCREASE_MOVEPOINTS"))return TriggerAction.DECREASE_MOVEPOINTS;
		else if( text.equals("INCREASE_MOVECOST")) 	return TriggerAction.INCREASE_MOVECOST;
		else if( text.equals("DECREASE_MOVECOST")) 	return TriggerAction.DECREASE_MOVECOST;
		else if( text.equals("SET_MOVECOST")) 		return TriggerAction.SET_MOVECOST;
		else if( text.equals("SET_SIGHT")) 			return TriggerAction.SET_SIGHT;
		return null;
	}
	
	/**
	 * Returns the action object value.
	 */
	public static TriggerAction_Obj getActionObj( String text ){
		
			 if( text.equals("FIELD")) 				return TriggerAction_Obj.FIELD;
		else if( text.equals("UNIT")) 				return TriggerAction_Obj.UNIT;
		else if( text.equals("FIELD2")) 			return TriggerAction_Obj.FIELD2;
		else if( text.equals("UNIT1")) 				return TriggerAction_Obj.UNIT2;
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
	public static TriggerTest getCondition( String text ){
		
			 if( text.equals("UNIT_TAG")) 			return TriggerTest.UNIT_TAG;
		else if( text.equals("FIELD_TAG")) 			return TriggerTest.FIELD_TAG;
		else if( text.equals("UNIT2_TAG"))	 		return TriggerTest.UNIT2_TAG;
		else if( text.equals("FIELD_TYPE"))			return TriggerTest.FIELD_TYPE;
		else if( text.equals("WEATHER_TYPE"))		return TriggerTest.WEATHER_TYPE;
		else if( text.equals("UNIT_TYPE"))	 		return TriggerTest.UNIT_TYPE;
		else if( text.equals("FIELD2_TAG"))		 	return TriggerTest.FIELD2_TAG;
		else if( text.equals("FUEL_OF_UNIT"))	 	return TriggerTest.FUEL_OF_UNIT;
		else if( text.equals("AMMO_OF_UNIT")) 		return TriggerTest.AMMO_OF_UNIT;
		else if( text.equals("HEALTH_OF_UNIT")) 	return TriggerTest.HEALTH_OF_UNIT;
		else if( text.equals("UNIT")) 				return TriggerTest.UNIT;
		else if( text.equals("FIELD")) 				return ScriptLogic.TriggerTest.FIELD;
		return null;
	}  
	
	/**
	 * Returns the relationship value.
	 */
	public static Relationship getRelation( String text ){
		
				if( text.equals("IS"))				return Relationship.IS;
		else	if( text.equals("IS_NOT"))			return Relationship.IS_NOT;
		else	if( text.equals("LESS_THAN"))		return Relationship.LESS_THAN;
		else	if( text.equals("MORE_THAN"))		return Relationship.MORE_THAN;
		else	if( text.equals("CAN_REPAIR"))		return Relationship.CAN_REPAIR;
		else	if( text.equals("CAN_PAY_REPAIR"))	return Relationship.CAN_PAY_REPAIR;
		else	if( text.equals("IS_OWNER_OF"))		return Relationship.IS_OWNER_OF;
		return null;
	}
	
	/**
	 * Returns the target value.
	 */
	public static int getValue( String text ){
		
				if( Data.existTagID(text) ) 		return Data.getIntegerTagID(text);
		else	if( Data.existIntegerID(text) ) 	return Data.getIntegerID(text);
		else	if( text.equals("FIELD2"))			return TILE2;
		else	if( text.equals("UNIT2"))			return UNIT2;
		else	if( text.equals("FIELD"))			return TILE;
		else	if( text.equals("UNIT"))			return UNIT;
		else	if( text.equals("FULL"))			return FULL;
		else	if( text.equals("HIDDEN"))			return HIDDEN;
				
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
	
	
	
}

