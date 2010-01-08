package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;

/**
 * Command to hide or un-hide an unit.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class HideUnit implements Command {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private boolean hide;
	private Unit unit;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public HideUnit( Unit unit , boolean hide ){
		this.unit = unit;
		this.hide = hide;
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doCommand() {
		unit.setHidden(hide);
	}
}

