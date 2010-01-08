package com.client.logic.command.commands.ingame;

import com.client.menu.GUI.MapDraw;
import com.client.logic.command.Command;

public class StartMoveAnimation implements Command {
	
	MapDraw map;
	
	public StartMoveAnimation( MapDraw map ){
		this.map = map;
	}
	
	public void doCommand(){
		map.startMoveAnimation();
	}

}
