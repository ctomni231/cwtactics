package com.system;

public interface ID {
	
	public final int ENEMY_TILE = 999995;
	public final int ENEMY_UNIT = 999996;
 	public final int TILE = 999997;
	public final int UNIT = 999998;
	public final int FULL = 999999;
	
	/*
	 * Keyboard values
	 */
	public enum Keys{
		
		// action keys with values for keyboard keys
        //ENTER(28),CANCEL(157)
		UP(200),DOWN(208),RIGHT(205),LEFT(203),ENTER(44),CANCEL(45);
		
		// key value of the key
		private int value;
		
		Keys( int val ){ value = val; }
		
		// Access Methods
		public int value(){ return value; }
		public void setValue( int val ){ value = val; }
		
	}

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
    	ENEMY_TAG,
    	FIELD_TYPE,
    	UNIT_TYPE,
    	ENEMY_FIELD_TAG,
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
    	DECREASE_SIGHT
    }
    
    public enum TriggerAction_Obj{
    	FIELD,
    	UNIT,
    	ENEMY_FIELD,
    	ENEMY_UNIT
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
    	VISION_TILE
    }
    
    public enum MessageMode{
    	LOCAL,IRC_NETWORK
    }
}

