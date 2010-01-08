package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.Fog;
import com.client.model.Instance;
import com.client.model.Turn;
import com.client.model.object.Player;

/**
 * Test command.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class TestCommand implements Command{
	
	/*
	 * VARIABLES
	 * *********
	 */
	
	private Player p;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public TestCommand( Player p ){
		this.p = p;
	}

	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doCommand(){
		Turn.setPlayer(p);
		Instance.toStack(p);
		Instance.setCurPlayer(p);
		Fog.noFog(false);
		Fog.processFog();
	}
}

