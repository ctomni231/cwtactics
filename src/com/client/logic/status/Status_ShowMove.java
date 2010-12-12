package com.client.logic.status;

import com.system.input.Controls;
import com.client.menu.GUI.MapDraw;
import com.client.menu.logic.Menu;
import com.client.model.Move;
import com.client.model.object.Game;
import com.client.model.object.Tile;

/**
 * Move class.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Status_ShowMove implements Status_Interface {

	public void update(int timePassed, MapDraw map) {
		
		// VARIABLES
    	int x = map.getCursorX();
    	int y = map.getCursorY();
    	Tile tile = Game.getMap().getTile(x, y);
    	if( tile == null ) return;
    	
    	// ADD THE CURRENT TILE TO WAY
		Move.toMoveWay(tile);
		
		if( Controls.isActionClicked() ){
			
			// IF NOT A CORRECT TARGET FOR MOVE, RETURN
			if( Move.getTiles().get(tile) == null || !Move.getTiles().get(tile).isMoveable() ) return;
			
			Move.completeWay();
			Menu.createUnitMenu( Move.getUnit() , Move.getTargetTile() );
			Status.setStatus( Status.Mode.MENU );
		}
		else if(Controls.isCancelClicked()) Status.setStatus( Status.Mode.WAIT );
	}
}

