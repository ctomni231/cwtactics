package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Tile;
import com.client.model.object.Unit;

/**
 * Command to try to capture a property
 * by a given unit.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class CaptureBuilding implements Command {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private Tile property;
	private Unit unit;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public CaptureBuilding( Tile tile , Unit unit ){
		this.property = tile;
		this.unit = unit;
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doCommand() {
		
		//TODO HQ routines 
		
		// decrease capture points
		property.decreaseCapPoints( unit.sheet().getCaptureValue() );
		
		// change owner if capture value of the property
		// is zero
		if( property.getCapPoints() == 0 ){
			
			property.changeOwner(unit.getOwner());
			property.resetCapPoints();
		}
	}
}

