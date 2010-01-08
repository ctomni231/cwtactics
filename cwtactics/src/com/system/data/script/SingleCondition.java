package com.system.data.script;

import com.client.model.Fight;
import com.client.model.Turn;
import com.client.model.object.Game;
import com.system.data.script.ScriptLogic.ScriptKey;
import com.system.log.Logger;

/**
 * Condition class.
 *  
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class SingleCondition {

	/*
	 * VARIABLES
	 * *********
	 */

	protected ScriptKey 	condition;
	protected ScriptKey		relationship;
	private int 			value;
	
	private static final int IS			= 1;
	private static final int IS_NOT		= 2;
	private static final int GREATER	= 3;
	private static final int LOWER		= 4;
	

	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public SingleCondition( ScriptKey condition, ScriptKey relationship, int value) {
		this.condition 		= condition;
		this.relationship 	= relationship;
		this.value 			= value;
	}


	
	/*
	 * WORK METHODS
	 * ************ 
	 */

	public boolean checkCondition(){

		int result = -1;
		
		// CHECK OBJECT WITH TARGET VALUE
		switch(condition){
		
			case IS_HIDDEN :
				if( Trigger_Object.getUnit() == null ) break;
				if( Trigger_Object.getUnit().isHidden() ) result = IS;
				else result = IS_NOT;
				break;
				
			case REPAIR_POSSIBLE :
				if( Trigger_Object.getTile() == null && Trigger_Object.getUnit() == null ) break;
				if( Trigger_Object.getTile().sheet().canRepair( Trigger_Object.getUnit().sheet() ) ) result = IS;
				else result = IS_NOT;
				break;
				
			case SUPPLY_POSSIBLE :
				if( Trigger_Object.getTile() == null && Trigger_Object.getUnit() == null ) break;
				if( Trigger_Object.getTile().sheet().canSupply( Trigger_Object.getUnit().sheet() ) ) result = IS;
				else result = IS_NOT;
				break;

			case AMMO :
				if( Trigger_Object.getUnit() == null ) break;
				if( value == ScriptLogic.FULL ) compareValue( Trigger_Object.getUnit().getAmmo() , Trigger_Object.getUnit().sheet().getAmmo() );
				else result = compareValue( Trigger_Object.getUnit().getAmmo() , value );
				break;
				
			case FUEL :
				if( Trigger_Object.getUnit() == null ) break;
				if( value == ScriptLogic.FULL ) compareValue( Trigger_Object.getUnit().getFuel() , Trigger_Object.getUnit().sheet().getFuel() );
				else result = compareValue( Trigger_Object.getUnit().getFuel() , value );
				break;
				
			case HEALTH :
				if( Trigger_Object.getUnit() == null ) break;
				if( value == ScriptLogic.FULL ) compareValue( Trigger_Object.getUnit().getHealth() , 99 );
				else result = compareValue( Trigger_Object.getUnit().getHealth() , value );
				break;
				
			case TAGS_OF_DEFENDER_TILE :
				if( !Fight.checkStatus() &&  Fight.getDefender() == null ) break;
				if( Fight.getDefender().sheet().hasTag(value) ) result = IS;
				else result = IS_NOT;
				break;
				
			case TAGS_OF_DEFENDER_UNIT :
				if( !Fight.checkStatus() && Fight.getDefender() == null ) break;
				if( Fight.getDefender().sheet().hasTag(value) ) result = IS;
				else result = IS_NOT;
				break;
				
			case TAGS_OF_TILE :
				if( Trigger_Object.getTile() == null ) break;
				if( Trigger_Object.getTile().sheet().hasTag(value) ) result = IS;
				else result = IS_NOT;
				break;
				
			case TAGS_OF_UNIT :
				if( Trigger_Object.getUnit() == null ) break;
				if( Trigger_Object.getUnit().sheet().hasTag(value) ) result = IS;
				else result = IS_NOT;
				break;
				
			case X_POSITION_OF_TILE :
				if( Trigger_Object.getTile() == null ) break;
				result = compareValue( Trigger_Object.getTile().getPosX() , value );
				break;
				
			case Y_POSITION_OF_TILE :
				if( Trigger_Object.getTile() == null ) break;
				result = compareValue( Trigger_Object.getTile().getPosY() , value );
				break;
				
			case X_POSITION_OF_UNIT :
				if( Trigger_Object.getUnit() == null ) break;
				result = compareValue( Game.getMap().findTile( Trigger_Object.getUnit() ).getPosX() , value );
				break;
				
			case Y_POSITION_OF_UNIT :
				if( Trigger_Object.getUnit() == null ) break;
				result = compareValue( Game.getMap().findTile( Trigger_Object.getUnit() ).getPosY() , value );
				break;
				
			case DAY_NUMBER :
				result = compareValue( Turn.getDay() , value );
				break;
				
			default :
				Logger.warn( "Got unknown condition ==> "+condition.toString() );
		}
		
		// CHECK RESULT WITH THE SEARCHED RELATIONSHIP
		switch(relationship){
		
			case IS :
				if( result == IS ) return true;
				break;
				
			case IS_NOT :
				if( result != IS ) return true;
				break;
				
			case GREATER :
				if( result == GREATER ) return true;
				break;
				
			case LOWER :
				if( result == LOWER ) return true;
				break;
				
			case HAS :
				if( result == IS ) return true;
				break;
				
			case HAS_NOT :
				if( result != IS ) return true;
				break;
		}
		
		// IF NO STATEMENT MATCHES, RETURN FALSE
		return false;
	}
	
	
	
	/*
	 * INTERNAL METHODS
	 * ****************
	 */
	
	private int compareValue( int hlp , int value ){
		
		int result;
		
		// COMPARE THE HELP VARIABLE WITH CONDITION VALUE
		if( hlp > value ) result = GREATER;
		else if( hlp < value ) result = LOWER;
		else result = IS;
		
		// RETURN RESULT
		return result;
	}
}

