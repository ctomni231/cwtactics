package com.client.menu.logic.buttons;

import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.sheets.Sheet;

public class UnloadUnitTargetButton extends UnloadUnitButton {

	private Tile unloadTile;
	
	public UnloadUnitTargetButton(ButtonType type, Sheet sheet, Unit loadedUnit, Tile unloadTile ) {
		super(type, sheet, loadedUnit);	
		this.unloadTile = unloadTile;
	}

	public Tile getTile(){
		return unloadTile;
	}
	
}
