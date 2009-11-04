package com.client.logic.command;

import java.util.ArrayList;

public class CommandStack {

	/*
	 * 
	 * VARIABLES
	 * *********
	 * 
	 */

	private static ArrayList<Command> stack;

	/*
	 * 
	 * CONSTRUCTORS
	 * ************
	 * 
	 */

	// Initialize command stack at program loading 
	static {
		stack = new ArrayList<Command>();
	}

	/*
	 * 
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	/**
	 * Adds a new command to the command stack
	 * 
	 */
	public synchronized static void addCommand(Command c) {
		stack.add(c);
	}

	/**
	 * Has the stack any commands in itself ?
	 * 
	 */
	public synchronized static boolean isEmpty() {
		if (stack.size() == 0)
			return true;
		return false;
	}

	/*
	 * INTERNAL METHODS
	 */

	/*
	 * WORKING METHODS
	 */

	/**
	 * Get the next command from stack. The stack itself deletes
	 * this command from stack! ( push )
	 * 
	 */
	public synchronized static Command getNext() {
		Command c = stack.get(0);
		stack.remove(0);
		return c;
	}

	/*
	 * OUTPUT METHODS
	 */

}
