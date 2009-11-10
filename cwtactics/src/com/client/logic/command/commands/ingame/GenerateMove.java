package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.Move;

public class GenerateMove implements Command {

	public void doCommand() {
		Move.move();
	}

}

