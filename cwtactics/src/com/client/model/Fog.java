package com.client.model;

import java.util.ArrayList;

//import object.Field;
//import object.Map;

import com.client.model.object.Game;
import com.client.model.object.Player;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.ID;
import com.system.data.script.ScriptFactory;
import com.system.data.script.Trigger_Object;
import com.system.data.sheets.ObjectSheet;
import com.system.data.sheets.Tile_Sheet;
import com.system.data.sheets.Unit_Sheed;

//import core.Misc_Data;

public class Fog {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private static ArrayList<Tile> visibleTiles;
	private static ArrayList<Unit> visibleStealths;
	private static boolean noFog;
	private static int additionalSight;
	

	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */

	static{
		
		visibleStealths = new ArrayList<Unit>();
		visibleTiles = new ArrayList<Tile>();
		noFog = true;
	}
	
	
	
	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	/**
	 * Is no fog mode on ?
	 */
	public static boolean isFog(){
		if( !noFog ) return true;
		else return false;
	}
	
	/**
	 * Sets no fog mode on or off.
	 */
	public static void noFog( boolean fog ){
		noFog = fog;
	}
	
	/**
	 * Is a hidden unit visible ?
	 */
	public static boolean isVisible( Unit unit ){
		
		// if the unit is in visible array, then the stealth
		// unit is detected by an other enemy unit.
		if( visibleStealths.contains(unit) ) return true;
		else return true;
	}
	
	/**
	 * Is a field in fog ?
	 */
	public static boolean inFog( Tile tile ){
		
		// if no fog exist, a tile is all time visible
		if( noFog ) return true;
		
		// if the tile is in visible array, return true
		if( visibleTiles.contains(tile) ) return false;
		else return true;
	}
	
	public static void changeSightAddon( int value ){
		additionalSight += value;
	}
	
	public static void setSightAddon( int value ){
		additionalSight = value;
	}
	

	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */	
	
	/**
	 * Processes all visions of a player and his
	 * team.
	 * 
	 * ! Also in no fog mode is the fog checked to 
	 *   check hidden units and tiles.
	 */
	public static void processFog( Player player ){
    		
		// clear old
		clear();

    	// check up all visions from properties and units
    	for( Player pl : player.getTeam().getMembers() ){
    		    		
    		// check property vision
    		for( Tile tile : pl.getProperties() ){
    			
    			clearSightAddon();
    			Trigger_Object.triggerCall(tile, null);
    			ScriptFactory.checkAll( ID.Trigger.VISION_TILE );
    			vision(tile, tile.sheet()); 
    		}
    		
    		// check unit vision 
    		for( Unit unit : pl.getUnits() ){
    			
    			Tile tile =  Game.getMap().findTile(unit);
    			
    			clearSightAddon();
    			Trigger_Object.triggerCall( tile , null);
    			ScriptFactory.checkAll( ID.Trigger.VISION_UNIT );
    			vision( tile , unit.sheet() );
    		}
    	}
    	
    }
	
	
	
	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */
	
	/**
	 * Checks the vision on an object on a given tile. 
	 */
	private static void vision( Tile tile , ObjectSheet sh ){
		
		// variables
		int range = sh.getVision() + additionalSight;
		
		// check that range has more equals the minimum ranges of tiles and units !
		if( sh instanceof Tile_Sheet && range < 0 ) range = 0;
		else if( range < 1 ) range = 1;
		
		
		// protect against incorrect scripts
		if( sh instanceof Unit_Sheed && range < 1 ) range = 1;
		else if ( sh instanceof Tile_Sheet && range < 0 ) range = 0;
		
		int x = tile.getPosX();
		int y = tile.getPosY();
		
		// add tiles that the object can see
		for( int i = 0 ; i <= range ; i++ ){
            for( int i2 = 0 ; i2 <= range-i ; i2++ ){
                if ( x - i2 >= 0 && y - i >= 0                                             ) checkTile( tile, sh , Game.getMap().getTile(x-i2, y-i ));
                if ( x + i2 < Game.getMap().getSizeX() && y - i >= 0                       ) checkTile( tile, sh , Game.getMap().getTile(x+i2, y-i ));
                if ( x - i2 >= 0 && y + i < Game.getMap().getSizeY()                       ) checkTile( tile, sh , Game.getMap().getTile(x-i2, y+i ));
                if ( x + i2 < Game.getMap().getSizeX() && y + i < Game.getMap().getSizeY() ) checkTile( tile, sh , Game.getMap().getTile(x+i2, y+i ));
            }
        }
    }
	
	/**
	 * Checks the vision status of an object 
	 * on a given tile for a given target tile.  
	 */
	private static void checkTile( Tile start , ObjectSheet sh , Tile target ){
		
		Unit unit = target.getUnit();
		
		// check vision status, if the object can't see the tile,
		// then don't check hidden unit 
		if( !visibleTiles.contains(target) && canSeeTile(start, sh , target) ){
			
			// add tile to visible list
			addTile(target);
			
			// if there is a hidden unit on the tile, check vision status
			if( unit != null && unit.isHidden() && !visibleStealths.contains(unit) && canSeeStealth(start, sh , target) ) addStealth(unit);
		}
	}
	
	/**
	 * Can an object see that tile from his position?
	 */
	private static boolean canSeeTile( Tile start , ObjectSheet sh , Tile target ){
		
		int range = getRange(start, target);
		int needed = target.sheet().getDetectingRange( sh );
		
		if( needed == -1 || range <= needed ) return true;
		else return false;
	}

	/**
	 * Can an object see that stealth from his position?
	 */
	private static boolean canSeeStealth( Tile start , ObjectSheet sh , Tile target ){
		
		int range = getRange(start, target);
		int needed = target.getUnit().sheet().getStealthRange( sh );
		
		if( range <= needed ) return true;
		else return false;
	}
	
	/**
	 * Clears fog class status.
	 */
	private static void clear(){
		visibleTiles.clear();
		visibleStealths.clear();
	}

	/**
	 * Adds a tile to the visible list.
	 */
	private static void addTile( Tile tile ){
		visibleTiles.add(tile);
	}

	/**
	 * Adds an unit to the visible list.
	 */
	private static void addStealth( Unit unit ){
		visibleStealths.add(unit);
	}

	/**
	 * Returns the range between two tiles.
	 */
	private static int getRange( Tile start , Tile target ){
		return Math.abs( start.getPosX() - target.getPosX() ) + Math.abs( start.getPosY() - target.getPosY() );
	}
	
	private static void clearSightAddon(){
		additionalSight = 0;
	}
	
	
	
	/*
	 * 
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
	
	public static void printStatus(){
		
		System.out.println("YOU CAN SEE :");
		for( Tile tile : visibleTiles ){
			System.out.print( tile+" ; ");
		}
		System.out.println("");
		System.out.println("YOU CAN SEE STEALTHS :");
		for( Unit unit : visibleStealths ){
			System.out.print( unit+" ; ");
		}
	}
}

