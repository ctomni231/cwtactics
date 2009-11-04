package com.system.data.sheets;

import java.util.HashMap;

public class Move_Sheet extends Sheet{

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private HashMap<Weather_Sheet, HashMap< Tile_Sheet , Integer > > moveTable;

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Move_Sheet(){
		moveTable = new HashMap<Weather_Sheet, HashMap<Tile_Sheet, Integer>>();
	}

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	/**
	 * Adds a cost for moving onto a given tile type at 
	 * a given weather type.
	 */
	public void addTileMoveCost( Weather_Sheet wSh , Tile_Sheet tSh , int cost ){
		
		if( !moveTable.containsKey(wSh) ) moveTable.put(wSh, new HashMap<Tile_Sheet, Integer>() );
		if( moveTable.get(wSh).containsKey(tSh) ){
			System.err.println("Contains allready movecost for "+tSh.getName() );
			return;
		}
		else moveTable.get(wSh).put(tSh, cost);
	}
	
	/**
	 * Returns the costs to move onto a tile during
	 * a given weather.
	 * 
	 * @param wSh weather sheet
	 * @param tSh tile sheet
	 * @return move costs to move onto this tile
	 */
	public int getMoveCost( Weather_Sheet wSh , Tile_Sheet tSh ){
		
		if( ! moveTable.containsKey(wSh) ) return -1;
		if( ! moveTable.get(wSh).containsKey(tSh) ) return -1;
		return moveTable.get(wSh).get(tSh);
	}

}

