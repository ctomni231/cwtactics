package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.Fog;

/**
 * Command to reprocess fog of war.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class ProcessFog implements Command {

	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doCommand() {
		Fog.processFog();
	}

}

