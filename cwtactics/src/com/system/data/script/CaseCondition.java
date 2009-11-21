package com.system.data.script;

/**
 * 
 * CaseCondition is an action object with an condition.
 * 
 * @author Tapsi [BcMk]
 *
 */
public class CaseCondition {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private Condition condition;
	private Action action;
	
	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public CaseCondition( String condition , String action ){
		setCondition(condition);
		setAction(action);
	}
	
	

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	/**
	 * Sets the condition of this case object
	 * and setups this condition.
	 */
	private void setCondition( String text ){
		condition = new Condition(text);
	}
	
	/**
	 * Sets the action for this case object
	 * and setups this action.
	 */
	private void setAction( String text ){
		action = new Action(text);
	}
	

	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	/**
	 * Checks if the condition is true.
	 */
	public boolean checkCondition( ){
		return condition.isTrue();
	}

	/**
	 * Calls the action scripts.
	 */
	public void doAction(){
		action.doActions();
	}

	
	
	/*
	 * 
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

	/**
	 * Prints content of this case object onto the console.
	 */
	public void print(){
		System.out.println("CASE CONDITION -------");
		condition.print();
		action.print();
	}
}

