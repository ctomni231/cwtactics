package com.system.data.script;

import java.util.ArrayList;

public class Condition {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private ArrayList< SingleCondition > conditions;

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Condition( String condition_text ){
		
		conditions = new ArrayList< SingleCondition >();
		setup(condition_text);
	}

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	public boolean isTrue(){
		
		boolean value = false;
		for( SingleCondition s : conditions ){
			value =  s.checkCondition();
		}
		return value;
	}

	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
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

			conditions.add( new SingleCondition(
				ScriptFactory.getCondition( cond[0]),
				ScriptFactory.getRelation( cond[1]),
				ScriptFactory.getValue( cond[2])
			) );
		}
	}

	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

}

