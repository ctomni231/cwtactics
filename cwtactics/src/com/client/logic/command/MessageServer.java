package com.client.logic.command;

import com.system.ID;
import com.system.ID.MessageMode;
import com.system.log.Logger;

/**
 * Controls incoming commands and send it in 
 * many possible ways like network, local...
 * to the command list.
 * 
 * @author tapsi
 * @version 8.1.2010, #2
 */
public class MessageServer {

	/*
	 * VARIABLES
	 * *********
	 */
	
	// communication mode of commands
	private static MessageMode mode;
	
	
	
	/*
	 * ACCESS METHODS
	 * **************
	 */
	
	/**
	 * Sets the communication mode. 
	 */
	public static void setMode( MessageMode mode ){
		MessageServer.mode = mode;
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
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
				Logger.warn("Network mode isn't implemented yet!");
				break;
				
			default :
				Logger.warn("Unknown communication mode! ==> "+mode.toString() );
		}
	}
	
	/**
	 * Sends a command to the list.
	 */
	public static void send( Command command ){
		send( command , false , mode );
	}

	/**
	 * Sends a command directly to the command list
	 * of this client.
	 */
	public static void sendLocal( Command command ){
		send(command, false , ID.MessageMode.LOCAL );
	}

	/**
	 * Sends a command to the first position of the list.
	 */
	public static void sendToFirstPos( Command command ){
		send( command , true , mode );
	}

	/**
	 * Sends a command, directly to the client, to the first position of the list.
	 */
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

