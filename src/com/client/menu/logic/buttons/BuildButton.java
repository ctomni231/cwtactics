package com.client.menu.logic.buttons;

import com.cwt.model.mapObjects.Tile;
import com.system.data.sheets.Sheet;

public class BuildButton extends Button{

	/*
	 * VARIABLES
	 * *********
	 */
	
	private Tile tile;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public BuildButton(ButtonType type, Sheet sheet , Tile tile ) {
		super(type, sheet);
		this.tile = tile;
	}

	
	
	/*
	 * ACCESS METHODS
	 * **************
	 */
	
	public Tile getProperty(){
		return tile;
	}
}
