package com.client.model.object;

import java.util.ArrayList;

import com.system.data.Data;

public class Map {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */

	private Tile[][] tiles;
	
	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */

	public Map( int sizeX , int sizeY ){
		tiles	= new Tile[sizeX][sizeY];
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
	
	public int getSizeX(){
		return tiles.length;
	}
	
	public int getSizeY(){
		return tiles[0].length;
	}


	
	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
	
	public void printMap(){
		
		System.out.println("Map shape :)");
		for( int i = 0; i < 10 ; i++ ){
			for( int j = 0 ; j < 10 ; j++ ){
				System.out.print( tiles[i][j].sheet().getName() +" || " );
    		}
			System.out.println();
    	}
	}
}

