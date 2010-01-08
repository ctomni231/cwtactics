package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.logic.command.MessageServer;
import com.client.menu.GUI.MapDraw;

/**
 * Wait animation command, waits
 * until an animation is completely
 * drawn.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class WaitAnimation implements Command {

	/*
	 * VARIABLES
	 * *********
	 */
	
	MapDraw map;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public WaitAnimation( MapDraw map ){
		this.map = map;
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doCommand() {
		
		// SEND A WAIT COMMAND TO FIRST POS IN THE LIST BUT LOCALLY, BECAUSE 
		// EVERYONE GOT THE FIRST WAIT-COMMAND FROM THE MESSAGE-SERVER
		if( map.isAnimationRunning() ) MessageServer.sendLocalToFirstPos( new WaitAnimation(map) );
	}

}
