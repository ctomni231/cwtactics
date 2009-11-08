package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;

/**
 * Changes the amount of fuel of the unit
 * by the given value of fuel.
 */
public class DecreaseFuel implements Command {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private int fuel;
	private Unit unit;
	
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public DecreaseFuel( Unit unit , int fuel ){
		this.fuel = fuel;
		this.unit = unit;
	}
	
	

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	public void doCommand(){
		
		unit.decreaseFuel(fuel);
	}
	
	
	
	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
 
	public String toString(){
		return "DECREASE_FUEL-"+unit.getID()+"-"+fuel;
	}
}

