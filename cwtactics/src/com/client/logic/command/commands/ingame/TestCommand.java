package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.Move;
import com.client.model.object.Game;

public class TestCommand implements Command{

	public void doCommand(){
		
		Move.printMoveTiles();
		
		Move.toMoveWay( Game.getMap().getTile(4,5) );
		Move.toMoveWay( Game.getMap().getTile(8,5) );
		
		Move.printMoveWay();
	}
}

