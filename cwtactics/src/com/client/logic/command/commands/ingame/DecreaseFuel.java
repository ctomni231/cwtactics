package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;

public class DecreaseFuel implements Command {

	private int amount;
	private Unit unit;
	
	public DecreaseFuel( Unit unit , int amount ){
		
		this.unit = unit;
		this.amount = amount;
	}
	
	public void doCommand() {
		unit.decreaseFuel(amount);
	}

}