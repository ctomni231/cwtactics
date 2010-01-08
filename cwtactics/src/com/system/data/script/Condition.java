package com.system.data.script;

import java.util.ArrayList;

import com.system.data.Data;
import com.system.data.sheets.Sheet;

/**
 * Condition class, holds single 
 * conditions. 
 *  
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Condition {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private ArrayList< SingleCondition > conditions;

	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public Condition( String condition_text ){
		
		conditions = new ArrayList< SingleCondition >();
		
		// setup condition
		if( condition_text != null ) setup(condition_text);
		
		// trim to size to save memory
		conditions.trimToSize();
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	/**
	 * Is the condition true?
	 */
	public boolean isTrue(){
		
		for( SingleCondition s : conditions ){
			if( !s.checkCondition() ) return false;
		}
		return true;
	}
	
	

	/*
	 * INTERNAL METHODS
	 * ****************
	 */
	
	/**
	 * 
	 * Fills the condition array from a condition 
	 * text statement.
	 *  
	 */
	private void setup( String text ){

		String[] cond;
		if( text.contains(" %% ") ) text = text.replace( " %% ", "#");
		
		// split the AND conditions
		for( String s : text.split("#") ){
			
			cond = s.split(" ");

			Sheet sh = Data.getSheet( cond[2]);

			if( sh == null ){
				conditions.add( new SingleCondition(
					ScriptLogic.getRelation( cond[0]),
					ScriptLogic.getRelation( cond[1]),
					ScriptLogic.getActionValue( cond[2]) ) 
				);
			}
			else{
				conditions.add( new SingleCondition_Sheet(
					ScriptLogic.getRelation( cond[0]),
					ScriptLogic.getRelation( cond[1]),
					sh ) 
				);
			}
		}
	}
}

