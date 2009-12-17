package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.Turn;

public class TurnEnd implements Command {

	/*
	 * WORK METHODS
	 * ************ 
	 */

	public void doCommand() {
		Turn.nextTurn();
	}
	
}

