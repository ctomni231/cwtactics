package com.system.data.script;

import java.util.ArrayList;
import java.util.HashMap;
import com.system.data.script.ScriptLogic.Trigger;


public class ScriptFactory {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private static HashMap< Trigger , ArrayList<Script> > scripts;
	private static Script script;

	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	static{
		scripts = new HashMap< Trigger , ArrayList<Script>>();
	}
	
	

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	/**
	 * Sets the last added script.
	 */
	public static void setLast( Script s ){
		script = s;
	}
	
	/**
	 * Returns the last added script.
	 */
	public static Script getLast(){
		return script;
	}
	
	/**
	 * Adds a script to the stack at given trigger.
	 */
	public static void addScript( Trigger trigger , Script s ){
		
		// check the trigger array
		if( scripts.get(trigger) == null ){
			scripts.put( trigger , new ArrayList<Script>() );
		}
		
		// pit the script into trigger array
		scripts.get(trigger).add(s);
		
		setLast(s);
	}
	

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	/**
	 * Checks all scripts for a given trigger.
	 */
	public static void checkAll( Trigger trigger ){
		
		if( !scripts.containsKey(trigger) ) return;
		for( Script s : scripts.get(trigger) ){
			if( s.statementTrue() ) s.callAction();
		}
	}
	
		
	

	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
	
	/**
	 * Prints out the complete content of the script database.
	 */
	public static void printDatabase(){
		for( Trigger trig : scripts.keySet() ){
			System.out.println();
			System.out.println("TRIGGER :: "+trig);
			System.out.println();
			for( Script script : scripts.get(trig) ){
				System.out.println();
				script.print();
				System.out.println();
			}
		}
	}

}

