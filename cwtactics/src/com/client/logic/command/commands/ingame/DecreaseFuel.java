package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;

/**
 * Command to decrease the fuel of
 * a given unit by a given value.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class DecreaseFuel implements Command {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private int amount;
	private Unit unit;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public DecreaseFuel( Unit unit , int amount ){	
		this.unit = unit;
		this.amount = amount;
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doCommand() {
		unit.decreaseFuel(amount);
	}

}