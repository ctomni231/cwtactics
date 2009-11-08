package com.system.data.script;

import java.util.ArrayList;

public class Script {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */

	private ArrayList<Condition> 	conditions;
	private ArrayList<SingleAction> actions;
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Script(){
		conditions 	= new ArrayList<Condition>();
		actions		= new ArrayList<SingleAction>();
	}

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	public void addCondition( String text){
		conditions.add( new Condition(text) );
	}
	
	public void addAction( String text ){
		
		String[] cond;
		
		if( text.contains(" %% ") ) text = text.replace( " %% ", "#");

		// split the AND conditions
		for( String s : text.split("#") ){
				
			cond = s.split(" ");
				
			actions.add( 
				new SingleAction( ScriptFactory.getAction( cond[0] ), ScriptFactory.getActionObj( cond[1] ), ScriptFactory.getActionValue( null ) )
			);
		}
	}

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */

	public boolean statementTrue(){
		
		// All main conditions connected by OR relationships,
		// only one must be true to return a true value
		for( Condition con : conditions ){
			if( con.isTrue() ) return true;
		}
		
		// if no condition is true, return false
		return false;
	}

	public void callAction(){
		
		for( SingleAction action : actions ){
			action.doAction();
		}
	}
	
	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */

	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

}

