package com.system.data.sheets;

import java.util.HashMap;

/**
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Move_Sheet extends Sheet{

	/*
	 * VARIABLES
	 * *********
	 */
	
	private HashMap< Tile_Sheet , Integer > moveTable;

	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public Move_Sheet(){
		moveTable = new HashMap<Tile_Sheet, Integer>();
	}

	
	
	/*
	 * ACCESS METHODS
	 * **************
	 */

	/**
	 * Adds a cost for moving onto a given tile type at 
	 * a given weather type.
	 */
	public void addTileMoveCost( Tile_Sheet tSh , int cost ){
		
		if( moveTable.containsKey(tSh) ){
			System.err.println("Contains allready movecost for "+tSh.getName() );
			return;
		}
		else moveTable.put(tSh, cost);
	}
	
	/**
	 * Returns the costs to move onto a tile during
	 * a given weather.
	 * 
	 * @param wSh weather sheet
	 * @param tSh tile sheet
	 * @return move costs to move onto this tile
	 */
	public int getMoveCost( Tile_Sheet tSh ){
		
		if( ! moveTable.containsKey(tSh) ) return -1;
		return moveTable.get(tSh);
	}

}

