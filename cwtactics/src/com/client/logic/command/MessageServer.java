package com.client.logic.command;

import com.system.ID;
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
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	/**
	 * Sets the communication mode. 
	 */
	public static void setMode( MessageMode mode ){
		MessageServer.mode = mode;
	}
	
	
	
	/*
	 * 
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	/**
	 * Sends a command through the message server.
	 */
	private static void send( Command command , boolean atFirstPos , ID.MessageMode mode ){
		switch( mode ){
			case LOCAL :
				addCommand(command, atFirstPos);
				break;
			case IRC_NETWORK :
				System.err.println("NETWORK MODE NOT IMPLEMENTED YET...");
				break;
		}
	}
	
	public static void send( Command command ){
		send( command , false , mode );
	}

	public static void sendLocal( Command command ){
		send(command, false , ID.MessageMode.LOCAL );
	}
	
	public static void sendToFirstPos( Command command ){
		send( command , true , mode );
	}
	
	public static void sendLocalToFirstPos( Command command ){
		send(command, true , ID.MessageMode.LOCAL );
	}
	
	
	/**
	 * Sends a command to the command list.
	 */
	private static void addCommand( Command command , boolean atFirstPos ){
		if( atFirstPos ) CommandList.addToFirstPosition(command);
		else CommandList.addToEndPosition(command);
	}

}

