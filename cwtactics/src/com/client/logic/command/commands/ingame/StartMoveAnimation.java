package com.client.logic.command.commands.ingame;

import com.client.menu.GUI.MapDraw;
import com.client.logic.command.Command;

/**
 * Command to start a move animation.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class StartMoveAnimation implements Command {
	
	/*
	 * VARIABLES
	 * *********
	 */
	
	MapDraw map;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public StartMoveAnimation( MapDraw map ){
		this.map = map;
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************ 
	 */
	
	public void doCommand(){
		map.startMoveAnimation();
	}

}
