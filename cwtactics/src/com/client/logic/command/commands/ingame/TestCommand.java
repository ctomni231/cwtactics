package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.Fog;
import com.client.model.Turn;
import com.client.model.object.Player;

public class TestCommand implements Command{
	
	private Player p;
	
	public TestCommand( Player p ){
		this.p = p;
	}

	public void doCommand(){
		Turn.setPlayer(p);
		Fog.noFog(false);
		Fog.processFog(p);
		Fog.printStatus();
	}
}

