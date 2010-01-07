package com.client.menu.logic.buttons;

import com.client.model.object.Unit;
import com.system.data.sheets.Sheet;

public class UnloadUnitButton extends Button {

	private Unit loadedUnit;
	
	public UnloadUnitButton(ButtonType type, Sheet sheet, Unit loadedUnit ) {
		super(type, sheet);
		this.loadedUnit = loadedUnit;
	}
	
	public Unit getUnit(){
		return loadedUnit;
	}

}
