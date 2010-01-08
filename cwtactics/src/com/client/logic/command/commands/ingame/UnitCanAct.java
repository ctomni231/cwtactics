package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;

/**
 * Command to set the canAct status
 * of an unit.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class UnitCanAct implements Command {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private Unit unit;
	private boolean canAct;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************ 
	 */
	
	public UnitCanAct( Unit unit , boolean canAct ) {
		this.unit = unit;
		this.canAct = canAct;
	}

	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doCommand() {
		unit.canAct(canAct);
	}

}

