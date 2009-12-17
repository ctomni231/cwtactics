package com.client.logic.command;

import java.util.ArrayList;

/**
 * CommandList holds all logic commands and
 * gives a multi-thread save access to the 
 * command list.
 * 
 * @author Tapsi [BcMk]
 */
public class CommandList {

	/*
	 * VARIABLES
	 * *********
	 */

	private static ArrayList<Command> list;

	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */

	// Initialize command stack at program loading 
	static {
		list = new ArrayList<Command>();
	}
	
	

	/*
	 * ACCESSING METHODS
	 * *****************
	 */

	/**
	 * Adds a new command to the command list.
	 * The command will be added to the end of the 
	 * list.
	 * 
	 */
	public synchronized static void addToEndPosition(Command c) {
		if( c == null ) return;
		list.add(c);
	}
	
	/**
	 * Adds a new command to the command list.
	 * This is called by a script and must be directly
	 * done after script, so it will be added to first 
	 * position of the command list.
	 * 
	 */
	public synchronized static void addToFirstPosition(Command c) {
		if( c == null ) return;
		list.add( 0 , c);
	}

	/**
	 * Has the list any commands in itself ?
	 * 
	 */
	public synchronized static boolean isEmpty() {
		if (list.isEmpty() ) return true;
		return false;
	}

	
	
	/*
	 * WORKING METHODS
	 * ***************
	 */

	/**
	 * Get the next command from list. The list itself deletes
	 * this command from list! ( push )
	 * 
	 */
	public synchronized static Command getNext() {
		Command c = list.get(0);
		list.remove(0);
		return c;
	}
	
}
