package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;
import com.system.data.sheets.Weapon_Sheed;

public class DecreaseAmmo implements Command {

	private Unit unit;
	private Weapon_Sheed sheet;
	
	public DecreaseAmmo( Unit unit , Weapon_Sheed sheet ){
		this.unit = unit;
		this.sheet = sheet;
	}
	
	public void doCommand() {
		if( unit.getHealth() > 0 && sheet.getUseAmmo() > 0 ) unit.decreaseAmmo( sheet.getUseAmmo() );
	}
}

