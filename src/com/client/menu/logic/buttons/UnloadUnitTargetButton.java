package com.client.menu.logic.buttons;

import com.cwt.model.mapObjects.Tile;
import com.cwt.model.mapObjects.Unit;
import com.system.data.sheets.Sheet;

/**
 * Holds the target tile to unload
 * a loaded unit.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class UnloadUnitTargetButton extends UnloadUnitButton {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private Tile unloadTile;
	
	
	
	/*
	 * CONSTRUCTOR
	 * ***********
	 */
	
	public UnloadUnitTargetButton(ButtonType type, Sheet sheet, Unit loadedUnit, Tile unloadTile ) {
		super(type, sheet, loadedUnit);	
		this.unloadTile = unloadTile;
	}
	
	
	
	/*
	 * ACCESS METHODS
	 * **************
	 */

	/**
	 * Returns the target tile,
	 * where the unit will unloaded.
	 */
	public Tile getTile(){
		return unloadTile;
	}
	
}
