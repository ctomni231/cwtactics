package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;

public class HideUnit implements Command {

	private boolean hide;
	private Unit unit;
	
	public HideUnit( Unit unit , boolean hide ){
		this.unit = unit;
		this.hide = hide;
	}
	
	public void doCommand() {
		unit.setHidden(hide);
	}
}

