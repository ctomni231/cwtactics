package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.Turn;

/**
 * Command to end a turn.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class TurnEnd implements Command {

	/*
	 * WORK METHODS
	 * ************ 
	 */

	public void doCommand() {
		Turn.nextTurn();
	}
	
}

