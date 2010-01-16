package com.client.logic.command;

import java.util.ArrayList;

/**
 * CommandList holds all logic commands and
 * gives a thread save access to the 
 * command list.
 * 
 * @author tapsi
 * @version 16.1.2010, #2
 */
public class CommandList {

	/*
	 * VARIABLES
	 * *********
	 */

	private static ArrayList<String> list;

	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */

	// Initialize command stack at program loading 
	static {
		list = new ArrayList<String>();
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
	public synchronized static void addToEndPosition(String c) {
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
	public synchronized static void addToFirstPosition(String c) {
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
	public synchronized static String getNext() {
		String c = list.get(0);
		list.remove(0);
		return c;
	}
	
}
