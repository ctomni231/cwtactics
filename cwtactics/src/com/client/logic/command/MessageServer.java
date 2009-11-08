package com.client.logic.command;

import com.system.ID.MessageMode;

public class MessageServer {

	/*
	 * 
	 * VARIABLES
	 * *********
	 * 
	 */
	
	// communication mode of commands
	private static MessageMode mode;
	
	
	
	/*
	 * 
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	/**
	 * Sends a command through the message
	 * server.
	 */
	public static void send( Command command , boolean atFirstPos ){
		switch( mode ){
			case LOCAL :
				toCommandList(command, atFirstPos);
				break;
			case IRC_NETWORK :
				System.err.println("NETWORK MODE NOT IMPLEMENTED YET...");
				break;
		}
	}
	
	/**
	 * Sends a command local directly to the command
	 * list.
	 */
	public static void toCommandList( Command command , boolean atFirstPos ){
		if( atFirstPos ) CommandList.addToFirstPosition(command);
		else CommandList.addToEndPosition(command);
	}
	
	/**
	 * Sets the communication mode. 
	 */
	public static void setMode( MessageMode mode ){
		MessageServer.mode = mode;
	}

}

