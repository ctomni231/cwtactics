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
		
		// setup condition
		if( condition_text != null ) setup(condition_text);
		
		// trim to size to save memory
		conditions.trimToSize();
	}
	
	
	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
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

	/**
	 * Print out content of this condition onto console.
	 */
	public void print(){
		System.out.println("__CONDITION__");
		for( SingleCondition cond : conditions ){
			System.out.println("    "+cond);
		}
	}
}

