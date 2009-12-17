package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.Fog;

public class ProcessFog implements Command {

	public void doCommand() {
		Fog.processFog();
	}

}

