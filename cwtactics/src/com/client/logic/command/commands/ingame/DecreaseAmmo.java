package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;
import com.system.data.sheets.Weapon_Sheed;

/**
 * Command to decrease the ammo of 
 * a given unit by a given value.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class DecreaseAmmo implements Command {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private Unit unit;
	private Weapon_Sheed sheet;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public DecreaseAmmo( Unit unit , Weapon_Sheed sheet ){
		this.unit = unit;
		this.sheet = sheet;
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doCommand() {
		if( unit.getHealth() > 0 && sheet.getUseAmmo() > 0 ) unit.decreaseAmmo( sheet.getUseAmmo() );
	}
}

