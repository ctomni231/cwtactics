package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.menu.GUI.MapDraw;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.log.Logger;

public class FieldSetUnit implements Command {

	private Tile tile;
	private Unit unit;
	private MapDraw map;
	
	public FieldSetUnit( Tile tile , Unit unit , MapDraw map ){
		this.tile = tile;
		this.unit = unit;
		this.map = map;
	}
	
	public void doCommand() {
		tile.setUnit(unit);
		map.updateMapItem( tile.getPosX() , tile.getPosY() );
		Logger.printStamp();
	}

}

