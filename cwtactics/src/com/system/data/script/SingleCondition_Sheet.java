package com.system.data.script;

import com.client.model.Fight;
import com.client.model.Weather;
import com.system.data.script.ScriptLogic.ScriptKey;
import com.system.data.sheets.Sheet;

/**
 * Condition class.
 *  
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class SingleCondition_Sheet extends SingleCondition {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private Sheet value;
	private static final int IS			= 1;
	private static final int IS_NOT		= 2;
	private static final int GREATER	= 3;
	private static final int LOWER		= 4;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public SingleCondition_Sheet(ScriptKey condition, ScriptKey relationship, Sheet value) {
		super(condition,relationship,-1);
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

			case TYPE_OF_WEATHER :
				if( Weather.getWeather() == value ) result = IS;
				else result = IS_NOT;
				break;
				
			case WEAPON :
				if( !Fight.checkStatus() ) break;
				if( Fight.getAttackerWeapon() == value ) result = IS;
				else result = IS_NOT;
				break;
				
			case TYPE_OF_UNIT :
				if( Trigger_Object.getUnit() == null ) break;
				if( Trigger_Object.getUnit().sheet() == value ) result = IS;
				else result = IS_NOT;
				break;
				
			case TYPE_OF_TILE :
				if( Trigger_Object.getTile() == null ) break;
				if( Trigger_Object.getTile().sheet() == value ) result = IS;
				else result = IS_NOT;
				break;
				
			case TYPE_OF_DEFENDER_TILE :
				if( !Fight.checkStatus() && Fight.getDefender() == null ) break;
				if( Fight.getDefender().sheet() == value ) result = IS;
				else result = IS_NOT;
				break;
				
			case TYPE_OF_DEFENDER_UNIT :
				if( !Fight.checkStatus() && Fight.getDefender() == null ) break;
				if( Fight.getDefender().sheet() == value ) result = IS;
				else result = IS_NOT;
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

}
