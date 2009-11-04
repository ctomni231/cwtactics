package com.client.model.object;

import java.util.ArrayList;

public class Map {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */

	private Tile[][] tiles;
	private ArrayList<Player> players;
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */

	public Map( int sizeX , int sizeY ){
		tiles	= new Tile[sizeX][sizeY];
		players	= new ArrayList<Player>();
	}
	
	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	public Tile[][] getField(){
		return tiles;
	}

	public boolean correctPos( int x , int y ){
		if( x >= 0 && x < tiles[0].length && y >= 0 && y < tiles.length ) return true;
		return false;
	}
	
	public void setTile( Tile tile , int x , int y ){
		if( !correctPos(x, y)) return;
		tiles[x][y] = tile;
	}
	
	public Tile getTile( int x , int y ){
		if( !correctPos(x, y)) return null;
		return tiles[x][y];
	}
	
	public void addPlayer( Player player ){
		players.add(player);
	}
	
	public void removePlayer( Player player ){
		players.remove(player);
	}
	
	public Player getPlayer( int ID ){
		return players.get(ID);
	}
	
	public int getPlayerInt( Player player ){
		return players.indexOf(player);
	}
	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */

	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */

	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

}

