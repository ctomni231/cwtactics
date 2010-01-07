package com.system.data.script;

import com.client.model.Fight;
import com.client.model.Turn;
import com.client.model.Weather;
import com.client.model.object.Game;
import com.system.data.Data;
import com.system.data.script.ScriptLogic.ScriptKey;
import com.system.log.Logger;

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
	 * ACCESSING METHODS
	 * ***************** 
	 */

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */

	public boolean checkCondition(){

		int result = -1;
		
		// CHECK OBJECT WITH TARGET VALUE
		switch(condition){
		
			case IS_HIDDEN :
				if( Trigger_Object.getUnit1() == null ) break;
				if( Trigger_Object.getUnit1().isHidden() ) result = IS;
				else result = IS_NOT;
				break;
				
			case REPAIR_POSSIBLE :
				if( Trigger_Object.getField1() == null && Trigger_Object.getUnit1() == null ) break;
				if( Trigger_Object.getField1().sheet().canRepair( Trigger_Object.getUnit1().sheet() ) ) result = IS;
				else result = IS_NOT;
				break;
				
			case SUPPLY_POSSIBLE :
				if( Trigger_Object.getField1() == null && Trigger_Object.getUnit1() == null ) break;
				if( Trigger_Object.getField1().sheet().canSupply( Trigger_Object.getUnit1().sheet() ) ) result = IS;
				else result = IS_NOT;
				break;

			case AMMO :
				if( Trigger_Object.getUnit1() == null ) break;
				if( value == ScriptLogic.FULL ) compareValue( Trigger_Object.getUnit1().getAmmo() , Trigger_Object.getUnit1().sheet().getAmmo() );
				else result = compareValue( Trigger_Object.getUnit1().getAmmo() , value );
				break;
				
			case FUEL :
				if( Trigger_Object.getUnit1() == null ) break;
				if( value == ScriptLogic.FULL ) compareValue( Trigger_Object.getUnit1().getFuel() , Trigger_Object.getUnit1().sheet().getFuel() );
				else result = compareValue( Trigger_Object.getUnit1().getFuel() , value );
				break;
				
			case HEALTH :
				if( Trigger_Object.getUnit1() == null ) break;
				if( value == ScriptLogic.FULL ) compareValue( Trigger_Object.getUnit1().getHealth() , 99 );
				else result = compareValue( Trigger_Object.getUnit1().getHealth() , value );
				break;
				
			case TAGS_OF_DEFENDER_TILE :
				if( !Fight.checkStatus() &&  Trigger_Object.getField2() == null ) break;
				if( Trigger_Object.getField2().sheet().hasTag(value) ) result = IS;
				else result = IS_NOT;
				break;
				
			case TAGS_OF_DEFENDER_UNIT :
				if( !Fight.checkStatus() &&  Trigger_Object.getUnit2() == null ) break;
				if( Trigger_Object.getUnit2().sheet().hasTag(value) ) result = IS;
				else result = IS_NOT;
				break;
				
			case X_POSITION_OF_TILE :
				if( Trigger_Object.getField1() == null ) break;
				result = compareValue( Trigger_Object.getField1().getPosX() , value );
				break;
				
			case Y_POSITION_OF_TILE :
				if( Trigger_Object.getField1() == null ) break;
				result = compareValue( Trigger_Object.getField1().getPosY() , value );
				break;
				
			case X_POSITION_OF_UNIT :
				if( Trigger_Object.getUnit1() == null ) break;
				result = compareValue( Game.getMap().findTile( Trigger_Object.getUnit1() ).getPosX() , value );
				break;
				
			case Y_POSITION_OF_UNIT :
				if( Trigger_Object.getUnit1() == null ) break;
				result = compareValue( Game.getMap().findTile( Trigger_Object.getUnit1() ).getPosY() , value );
				break;
				
			case DAY_NUMBER :
				result = compareValue( Turn.getDay() , value );
				break;
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

	
	
	/*
	 * OUTPUT METHODS
	 * **************
	 */
	
	public String toString(){
		return " SC:: COND:"+condition+" - REL:"+relationship+" VALUE:"+value;
	}

}

