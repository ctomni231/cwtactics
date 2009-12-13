package com.system.data.script;

import java.util.ArrayList;

/**
 * 
 * Actions holds various single actions 
 * which are connected with AND.
 * 
 * @author Tapsi [BcMk]
 *
 */
public class Action {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private ArrayList< SingleAction > actions;

	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Action( String text ){
		
		actions = new ArrayList< SingleAction >();
		
		// setup action object
		if( text != null ) setup(text);
		else System.err.println("Action is created without an acion!");
		
		// trim to size after setup to save memory
		actions.trimToSize();
	}



	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	/**
	 * Do all actions in this action object.
	 */
	public void doActions(){
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
	
	/**
	 * 
	 * Fills the action array from a condition 
	 * text statement.
	 *  
	 */
	private void setup( String text ){

		String[] cond;
		
		if( text.contains(" %% ") ) text = text.replace( " %% ", "#");

		// split the AND conditions
		for( String s : text.split("#") ){
				
			cond = s.split(" ");
			if( cond.length == 2 ) cond = new String[]{ cond[0] , cond[1] , null };
			actions.add( 
				new SingleAction( ScriptLogic.getAction( cond[0] ), ScriptLogic.getActionObj( cond[1] ), ScriptLogic.getActionValue( cond[2] ) )
			);
		}
	}

	
	
	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
	
	/**
	 * Print content of action object onto console.
	 */
	public void print(){
		System.out.println("__ACTION__");
		for( SingleAction act : actions ){
			System.out.println("    "+act);
		}
	}
	
	
}

