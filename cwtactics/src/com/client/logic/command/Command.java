package com.client.logic.command;

/**
 * Command interface for logic commands.
 * 
 * @author Tapsi [BcMk]
 */
public interface Command{
    	
	// every command do an individual action,
    // all information about the command saves the command
    // itself.
    void doCommand();
  
}