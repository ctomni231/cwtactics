package com.system.data.script;

import java.util.ArrayList;

public class Script {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */

	private ArrayList<Condition> mainConditions;
	private ArrayList<CaseCondition> cases;
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Script(){
		mainConditions 	= new ArrayList<Condition>();
		cases		= new ArrayList<CaseCondition>();
	}

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	/**
	 * Adds a main condition to the script.
	 */
	public void addMainCondition( String condition ){
		mainConditions.add( new Condition( condition ));
		mainConditions.trimToSize();
	}
	
	/**
	 * Adds a case to the script.
	 */
	public void addCase( String condition , String action ){
		cases.add( new CaseCondition(condition, action));
		cases.trimToSize();
	}

	
	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */

	/**
	 * Checks the condition status.
	 */
	public boolean statementTrue(){
		
		if( mainConditions.size() == 0 ) return true;
		
		// All main conditions connected by OR relationships,
		// only one must be true to return a true value
		for( Condition con : mainConditions ){
			if( con.isTrue() ) return true;
		}
		
		// if no condition is true, return false
		return false;
	}

	/**
	 * Calls an action from script.
	 */
	public void callAction(){
		
		for( CaseCondition caseAction : cases ){
			if( caseAction.checkCondition() ){
				caseAction.doAction();
				return;
			}
		}
	}
	
	

	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
	
	/**
	 * Prints out script content onto console.
	 */
	public void print(){
		System.out.println("============SCRIPT=========");
		for( Condition cond : mainConditions ){
			cond.print();
		}
		for( CaseCondition cond : cases ){
			cond.print();
		}
	}

}

