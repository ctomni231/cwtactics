package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;

public class RepairUnit implements Command {


	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */

	private Unit unit;
	private int health;
	
	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public RepairUnit( Unit unit , int health ){
		this.unit = unit;
		this.health = health;
	}
	
	

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	public void doCommand() {
		unit.increaseHealth(health);
	}

	
	
	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
  
	public String toString(){
		return "REPAIRUNIT-"+unit.getID()+"-"+health;
	}
}

