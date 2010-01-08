package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.logic.command.MessageServer;
import com.client.menu.GUI.MapDraw;

public class WaitAnimation implements Command {

	MapDraw map;
	
	public WaitAnimation( MapDraw map ){
		this.map = map;
	}
	
	public void doCommand() {
		
		// SEND A WAIT COMMAND TO FIRST POS IN THE LIST
		// BUT LOCALLY, BECAUSE EVERYONE GOT THE FIRST 
		// WAIT-COMMAND FROM THE MESSAGE-SERVER
		if( map.isAnimationRunning() ) MessageServer.sendLocalToFirstPos( new WaitAnimation(map) );
	}

}
