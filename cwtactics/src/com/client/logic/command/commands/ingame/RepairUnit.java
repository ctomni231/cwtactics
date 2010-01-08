package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;

/**
 * Command to increase the health of an unit.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class RepairUnit implements Command {


	/*
	 * VARIABLES
	 * ********* 
	 */

	private Unit unit;
	private int health;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************ 
	 */
	
	public RepairUnit( Unit unit , int health ){
		this.unit = unit;
		this.health = health;
	}
	
	

	/*
	 * WORK METHODS
	 * ************ 
	 */
	
	public void doCommand() {
		unit.increaseHealth(health);
	}

}

