package com.client.logic.status;

import com.client.logic.input.Controls;
import com.client.menu.GUI.MapDraw;
import com.client.menu.logic.Menu;
import com.client.model.Move;
import com.client.model.object.Game;
import com.client.model.object.Tile;

public class Status_ShowMove implements Status_Interface {

	public void update(int timePassed, MapDraw map) {
		
		// variables
    	int x = map.getCursorX();
    	int y = map.getCursorY();
    	Tile tile = Game.getMap().getTile(x, y);
    	
    	// check variables
    	if( tile == null ) return;
    	
    	// add the tile under the cursor to the move way
		Move.toMoveWay(tile);
		
		// test output
		Move.printMoveWay();
    	
		if( Controls.isActionClicked() ){
			
			// create unit menu
			Menu.createUnitMenu( Move.getUnit() , Move.getTargetTile() );
			
			// set menu status
			Status.setStatus( Status.Mode.MENU );
		}
		else if (  Controls.isCancelClicked() ){
			
			// cancel moving and set wait mode
			Status.setStatus( Status.Mode.WAIT );
		}
	}
}

