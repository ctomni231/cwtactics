package com.client.menu.logic.buttons;

import com.client.model.object.Unit;
import com.system.data.sheets.Sheet;

/**
 * Holds a loaded unit which 
 * can be unloaded.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class UnloadUnitButton extends Button {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private Unit loadedUnit;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public UnloadUnitButton(ButtonType type, Sheet sheet, Unit loadedUnit ) {
		super(type, sheet);
		this.loadedUnit = loadedUnit;
	}
	
	
	
	/*
	 * ACCESS METHODS
	 * **************
	 */
	
	/**
	 * Returns the loaded unit.
	 */
	public Unit getUnit(){
		return loadedUnit;
	}

}
