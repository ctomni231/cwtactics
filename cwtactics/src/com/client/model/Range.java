package com.client.model;

import java.util.ArrayList;
import java.util.HashMap;

import com.client.model.object.Game;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.sheets.Weapon_Sheed;

/**
 * Class Range holds and controls unit attack ranges 
 * and battle targets.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Range {

	
	/*
	 * VARIABLES
	 * *********
	 */
	
	private static ArrayList<Tile> range = new ArrayList<Tile>();
	private static ArrayList<Tile> targets = new ArrayList<Tile>();
	private static ArrayList<Tile> helpList = new ArrayList<Tile>();
	

	
	/*
	 * ACCESS METHODS
	 * ************** 
	 */
	
	/**
	 * Clears all data from Range.
	 */
	public static void clear(){
		range.clear();
		targets.clear();
	}

    public static boolean isIn( Tile tile ){
        if( range.contains(tile) )
            return true;
        else
            return false;
    }
	
	/**
	 * Adds a target to Range.
	 */
	public static void addTargets( Tile tile ){
		targets.add(tile);
	}
	
	/**
	 * Returns a list of targets.
	 */
	public static ArrayList<Tile> getTargets(){
		return targets;
	}

	/**
	 * Adds a tile to the range.
	 */
	public static void addTile( Tile tile ){
		range.add(tile);
	}
	
	/**
	 * Returns a list of tiles in range. 
	 */
	public static ArrayList<Tile> getList(){
		return range;
	}

	/**
	 * Sets a list of tiles as range list.
	 */
	public static void setList( ArrayList<Tile> list){
		if( list != null ) range = list;
	}

	/**
	 * Adds a list of tiles to the range list.
	 */
	public static void addListToList( ArrayList<Tile> list ){
		for( Tile tile : list ){
			if( !range.contains(tile) ) range.add(tile);
		}
	}
	
	

	/*
	 * WORK METHODS
	 * ************
	 */
	
	/** 
	 * Shows the possible attack range for an unit. 
	 */
    public static void getCompleteAttackRange( Tile tile , Unit unit ){
    	
    	// setup
    	clear();
    	
    	// variables
    	int x = tile.getPosX();
    	int y = tile.getPosY();
    	
    	// check range for every weapon
    	for( Weapon_Sheed sh : unit.sheet().getAllWeapons() ){
    		
    		// if you don't have enough ammo to use this weapon, continue
    		if( sh.getUseAmmo() != -1 && unit.getAmmo() < sh.getUseAmmo() ) continue;
    		    		
    		if( sh.getFireMode() == 0 || sh.getFireMode() == 2 ){

    			// make virtual move first
		    	Move.initialize(tile, unit);
		    	Move.move();
		    	
		    	// get tiles from move
		    	HashMap<Tile, MoveObject> tiles = Move.getTiles();
		    	
		    	// attack from every tile
		    	for( Tile mt : tiles.keySet() ){

		    		if( tiles.get(mt).isMoveable() ){
		    			getAttackRange( mt.getPosX() , mt.getPosY() , sh);
		    			addListToList(helpList);
		    		}
		    	}
    		}
    		else{

    			// attack from start place
		    	getAttackRange(x, y, sh);
		    	addListToList(helpList);
				break;
    		}	
    	}
    }

	/**
	 * Generates the internal list of targets.
	 */
    public static void generateTargets( Tile start , Unit unit , Weapon_Sheed sh ){
    	    	
    	// variables
    	int x = start.getPosX();
    	int y = start.getPosY();
    	
    	// attack from start place
    	getAttackRange(x, y, sh);
    	addListToList(helpList);
    	
    	for( Tile tile : range ){
    		if( tile.getUnit() != null && tile.getUnit().getOwner() != unit.getOwner() ){
        	
    			if( !targets.contains(tile) && sh.canAttack( tile.getUnit().sheet() ) ) targets.add(tile);
    		}
    	}
    }

	/**
	 * Has the unit targets from a given tile and a given weapon type?
	 */
    public static boolean hasWeaponTargets( Tile tile , Unit unit , Weapon_Sheed sh ){
    	
    	clear();
    	
    	generateTargets(tile, unit, sh);
    	
    	if( targets.size() > 0 ) return true;
    	else return false;
    }
    
    /**
     * Has a unit targets ?
     */
	public static boolean hasUnitTargets( Tile tile , Unit unit ){

		for( Weapon_Sheed sh : unit.sheet().getAllWeapons() ){
			if( hasWeaponTargets(tile, unit, sh) ) return true;
		}
		return false;
	}

    
    
    /*
     * INTERNAL METHODS
     * ****************
     */

	/**
	 * Returns all tiles from a position and a given weapon.
	 */
    private static void getAttackRange( int x , int y , Weapon_Sheed sh ){
    	
    	// variables
    	int minRange = sh.getMinRange() - 1;
    	int maxRange = sh.getMaxRange();

    	helpList.clear();
    
    	if( maxRange > -1 && maxRange > minRange ) addRange(maxRange, x, y);
    	if( minRange > -1 && maxRange > minRange ) removeRange(minRange, x, y);
    }

	/**
	 * Adds tiles for a given range to the help list.
	 */
    private static void addRange(int range, int x, int y ) {
	    
		for( int i = 0 ; i <= range ; i++ ){
	        for( int i2 = 0 ; i2 <= range-i ; i2++ ){
	            if ( x - i2 >= 0                       && y - i >= 0                       && helpList.indexOf(Game.getMap().getTile(x-i2, y-i)) == -1 ) helpList.add( Game.getMap().getTile(x-i2, y-i) );
	            if ( x - i2 >= 0                       && y + i < Game.getMap().getSizeY() && helpList.indexOf(Game.getMap().getTile(x-i2, y+i)) == -1 ) helpList.add( Game.getMap().getTile(x-i2, y+i) );
	            if ( x + i2 < Game.getMap().getSizeX() && y - i >= 0                       && helpList.indexOf(Game.getMap().getTile(x+i2, y-i)) == -1 ) helpList.add( Game.getMap().getTile(x+i2, y-i) );
	            if ( x + i2 < Game.getMap().getSizeX() && y + i < Game.getMap().getSizeY() && helpList.indexOf(Game.getMap().getTile(x+i2, y+i)) == -1 ) helpList.add( Game.getMap().getTile(x+i2, y+i) );
	        }
	    }
    }

	/**
	 * Removes tiles for a given range from the help list.
	 */
    private static void removeRange(int range, int x, int y ) {
    	
		for( int i = 0 ; i <= range ; i++ ){
	        for( int i2 = 0 ; i2 <= range-i ; i2++ ){
	            if ( x - i2 >= 0                       && y - i >= 0                       && helpList.indexOf(Game.getMap().getTile(x-i2, y-i)) != -1 ) helpList.remove( Game.getMap().getTile(x-i2, y-i) );
	            if ( x - i2 >= 0                       && y + i < Game.getMap().getSizeY() && helpList.indexOf(Game.getMap().getTile(x-i2, y+i)) != -1 ) helpList.remove( Game.getMap().getTile(x-i2, y+i) );
	            if ( x + i2 < Game.getMap().getSizeX() && y - i >= 0                       && helpList.indexOf(Game.getMap().getTile(x+i2, y-i)) != -1 ) helpList.remove( Game.getMap().getTile(x+i2, y-i) );
	            if ( x + i2 < Game.getMap().getSizeX() && y + i < Game.getMap().getSizeY() && helpList.indexOf(Game.getMap().getTile(x+i2, y+i)) != -1 ) helpList.remove( Game.getMap().getTile(x+i2, y+i) );
	        }
	    }
    }

}

