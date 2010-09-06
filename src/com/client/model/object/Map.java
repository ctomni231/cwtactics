package com.client.model.object;

/**
 * Holds a couple of tiles, these tiles
 * together are a map.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Map {

	/*
	 * VARIABLES
	 * *********
	 */

	private Tile[][] tiles;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************ 
	 */

	public Map( int sizeX , int sizeY ){
		tiles	= new Tile[sizeX][sizeY];
	}
	
	
	
	/*
	 * ACCESS METHODS
	 * ************** 
	 */
	
	public Tile[][] getField(){
		return tiles;
	}
	
	public Tile findTile( Unit unit ){
		
		// try to find the unit on the map
		for( Tile[] row : tiles ){
			for( Tile tile : row ){
				if( tile.getUnit() == unit ) return tile;
			}
		}
		
		System.err.println("Cannot find the field, where unit "+unit+" is.");
		return null;
	}

	public boolean correctPos( int x , int y ){
		if( x >= 0 && x < tiles.length && y >= 0 && y < tiles[0].length ) return true;
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
	

	public Tile getTile( String x , String y ){
		return getTile( Integer.parseInt(x) , Integer.parseInt(y) );
	}
	
	public int getSizeX(){
		return tiles.length;
	}
	
	public int getSizeY(){
		return tiles[0].length;
	}
	
	public static Unit getUnit( int ID ){
		int idPlayer = ID / 10000;
		int idUnit = ID % 10000;
		return Game.getPlayer(idPlayer).getUnits().get(idUnit);
	}
	
}

