package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.menu.GUI.MapDraw;
import com.client.model.object.Player;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.sheets.Unit_Sheed;

public class BuildUnit implements Command {
	
	/*
	 * VARIABLES
	 * *********
	 */
	
	private Unit_Sheed sh;
	private Tile property;
	private Player player;
	private MapDraw map;
	
	

	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public BuildUnit( Tile property , Unit_Sheed sh , Player player , MapDraw map ){
		this.property = property;
		this.player = player;
		this.map = map;
		this.sh = sh;
	}
	

	
	/*
	 * WORK METHODS
	 * ************ 
	 */

	public void doCommand() {
		
		// create unit and add it to players stack
		Unit unit = new Unit( sh , player );
		property.setUnit(unit);
		player.addUnit(unit);
		
		// update graphic engine
		map.updateMapItem( property.getPosX() , property.getPosY() );
	}
	
	/*
	 * INTERNAL METHODS
	 * ****************
	 */

}

