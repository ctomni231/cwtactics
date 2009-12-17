package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;

public class UnitCanAct implements Command {

	private Unit unit;
	private boolean canAct;
	
	public UnitCanAct( Unit unit , boolean canAct ) {
		this.unit = unit;
		this.canAct = canAct;
	}

	public void doCommand() {
		unit.canAct(canAct);
	}

}

