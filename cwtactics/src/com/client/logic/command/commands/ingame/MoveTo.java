package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.logic.command.MessageServer;
import com.client.menu.GUI.MapDraw;
import com.client.model.Fog;
import com.client.model.Move;
import com.client.model.object.Tile;
import com.client.model.object.Unit;

public class MoveTo implements Command {

	

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private MapDraw map;
	
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public MoveTo( MapDraw map ){
		this.map = map;
	}
	


	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	public void doCommand() {
		
		// complete move way
		Move.completeWay();
		
		// variables
		Unit unit = Move.getUnit();
		Tile start = Move.getStartTile();
		Tile target = Move.getWay().get( Move.getWay().size() - 1 );
		
		// decrease fuel
		MessageServer.sendLocalToFirstPos( new DecreaseFuel(unit, Move.getCompleteFuel() ));
		
		// reset unit positions
		start.setUnit(null);
		target.setUnit(unit);
		
		// update graphic logic
		map.updateMapItem( start.getPosX() , start.getPosY() );
        map.startMoveAnimation(); //working on move to... got to get it to display.
		//map.updateMapItem( target.getPosX() , target.getPosY() );
		
		// process fog
		Fog.processFog();
	}
	
	
	
}

