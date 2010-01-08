package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.menu.GUI.MapDraw;
import com.client.model.object.Tile;
import com.client.model.object.Unit;

/**
 * Command to set a unit onto a given tile.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class FieldSetUnit implements Command {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private Tile tile;
	private Unit unit;
	private MapDraw map;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public FieldSetUnit( Tile tile , Unit unit , MapDraw map ){
		this.tile = tile;
		this.unit = unit;
		this.map = map;
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doCommand() {
		tile.setUnit(unit);
		map.updateMapItem( tile.getPosX() , tile.getPosY() );
	}

}

