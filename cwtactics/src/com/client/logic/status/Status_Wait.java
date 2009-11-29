package com.client.logic.status;

import com.client.logic.input.Controls;
import com.client.menu.GUI.MapDraw;
import com.client.menu.logic.Menu;
import com.client.model.Fog;
import com.client.model.Move;
import com.client.model.Range;
import com.client.model.Turn;
import com.client.model.object.Game;
import com.client.model.object.Tile;
import com.client.model.object.Unit;

public class Status_Wait implements Status_Interface {

	public void update(int timePassed , MapDraw map ) {
		
		// variables
    	int x = map.getCursorX();
    	int y = map.getCursorY();
    	Tile tile = Game.getMap().getTile(x, y);
		
    	// check variables
    	if( tile == null ) return;
    	
    	Unit unit = tile.getUnit();
    	
    	
    	// ACTION BUTTON
    	//
    	if( Controls.isActionClicked() ){
    		
    		// UNIT MOVE
    		if( unit != null && !Fog.inFog(tile) ){
    			if( unit.canAct() && unit.getOwner() == Turn.getPlayer() ){
    				
    				// make move tiles
    				Move.initialize(tile, unit);
    				Move.move();
    				
    				Move.printMoveTiles();
    				
    				// set move mode
    				Status.setStatus( Status.Mode.SHOW_MOVE );
    			}
    		}
    		// FACTORY
    		else if( tile.sheet().canBuild() && !Fog.inFog(tile) && tile.getOwner() == Turn.getPlayer() ){
    			
    			Menu.createBuildMenu(tile);
    			
    			// set menu status
    			Status.setStatus( Status.Mode.MENU );
    		}
    		// MAP MENU
    		else{	
    			
    			// make map menu
				Menu.createMapMenu();
				
    			// set menu status
    			Status.setStatus( Status.Mode.MENU );
    		}
    	}
    	// CANCEL BUTTON
    	//
    	else if( Controls.isCancelDown() ){
    		
    		if( unit != null && Fog.inFog(tile) ){
    			
    			// is it a hidden unit ?
    			if( unit.isHidden() && !Fog.isVisible(unit) ) return;
    			
    			// setup tiles
    			Range.getCompleteAttackRange(tile, unit);
    			
    			// set show range status
    			Status.setStatus( Status.Mode.SHOW_RANGE );
    		}
    	}
    	
	}
	
}

