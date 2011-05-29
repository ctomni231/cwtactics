package com.cwt.logic.mapController;

//import com.client.model.Instance;
import java.util.ArrayList;
//import com.client.model.object.Game;
import com.cwt.model.mapObjects.Player;
import com.cwt.model.mapObjects.Tile;
import com.cwt.model.mapObjects.Unit;
//import com.system.data.DynamicMemory;
//import com.system.data.sheets.ObjectSheet;
//import com.system.data.sheets.Tile_Sheet;
//import com.system.data.sheets.Unit_Sheed;
//import com.system.meowShell.Script_Database;

/**
 * Controls the fog system of the game round.
 * 
 * @author tapsi
 * @version 8.1.2010, #2
 * @todo TODO Class broken due to com.system & com.client removal
 */
public class Fog {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private static ArrayList<Tile> visibleTiles;
	private static ArrayList<Unit> visibleStealths;
	private static boolean noFog;
    private static boolean processFog;
	private static int sightValue;
	

	
	/*
	 * CONSTRUCTORS
	 * ************ 
	 */

	static{
		visibleStealths = new ArrayList<Unit>();
		visibleTiles = new ArrayList<Tile>();
		noFog = true;
        processFog = false;
	}
	
	
	
	/*
	 * ACCESS METHODS
	 * ************** 
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
		return ( !unit.isHidden() || visibleStealths.contains(unit) ) ? true : false;
	}
	
	/**
	 * Is a field in fog ?
	 */
	public static boolean inFog( Tile tile ){
		// IF NOFOG, A TILE IS ALLTIME VISIBLE
		return ( visibleTiles.contains(tile) || noFog ) ? false : true;
	}
	
	/**
	 * Changes the sight value by a given 
	 * value.
	 */
	public static void changeSight( int value ){
		sightValue += value;
	}
	
	/**
	 * Sets the sight value to a given value.
	 */
	public static void setSight( int value ){
		sightValue = value;
	}

    /**
     * Checks to see if the fog was recently processed
     */
    public static boolean isProcessFog(){
        if(processFog){
            processFog = false;
            return true;
        }
        return processFog;
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
	public static void processFog(){
		//processFog( Instance.getCurPlayer() );
	}
	
	private static void processFog( Player player ){

        processFog = true;
		// clear old
		//clear();
		
    	// check up all visions from properties and units
                /**
    	for( Player pl : player.getTeam().getMembers() ){


    		// check property vision
    		for( Tile tile : pl.getProperties() ){
    			
    			clearSight();
    			sightValue = tile.sheet().getVision();
    			//DynamicMemory.setTile(tile);
    			Script_Database.checkAll( "VISION_TILE" );
    			if( sightValue < 0 ) sightValue = 0;
    			//DynamicMemory.reset();
    			vision(tile, tile.sheet()); 
    		}
    		
    		// check unit vision

    		for( Unit unit : pl.getUnits() ){
    			
    			Tile tile =  Game.getMap().findTile(unit);
    			
    			// unit is a load of an another unit
    			if( tile == null ) continue;
    			
    			clearSight();
    			sightValue = unit.sheet().getVision();
    			DynamicMemory.setUnit(unit);
    			Script_Database.checkAll( "VISION_UNIT" );
    			DynamicMemory.reset();
    			// PREVENT WRONG VALUES, UNIT CAN SEE AT MIN. WITH RANGE 1
    			if( sightValue <= 0 ) sightValue = 1;
    			vision( tile , unit.sheet() );
    		}


    	}
          */
    	
    }
	
	
	
	/*
	 * INTERNAL METHODS
	 * ****************
	 */
	
	/**
	 * Checks the vision on an object on a given tile. 
	 */
	/*private static void vision( Tile tile , ObjectSheet sh ){
		
		// variables
		int range = sightValue;
		
		// check that range has more equals the minimum ranges of tiles and units !
		if( sh instanceof Tile_Sheet && range < 0 ) range = 0;
		else if( range < 1 ) range = 1;
		
		
		// protect against incorrect scripts
		//if( sh instanceof Unit_Sheed && range < 1 ) range = 1;
		//else if ( sh instanceof Tile_Sheet && range < 0 ) range = 0;
		
		int x = tile.getPosX();
		int y = tile.getPosY();
		
		// add tiles that the object can see
		for( int i = 0 ; i <= range ; i++ ){
            for( int i2 = 0 ; i2 <= range-i ; i2++ ){
                //if ( x - i2 >= 0 && y - i >= 0                                             ) checkTile( tile, sh , Game.getMap().getTile(x-i2, y-i ));
                //if ( x + i2 < Game.getMap().getSizeX() && y - i >= 0                       ) checkTile( tile, sh , Game.getMap().getTile(x+i2, y-i ));
                //if ( x - i2 >= 0 && y + i < Game.getMap().getSizeY()                       ) checkTile( tile, sh , Game.getMap().getTile(x-i2, y+i ));
               // if ( x + i2 < Game.getMap().getSizeX() && y + i < Game.getMap().getSizeY() ) checkTile( tile, sh , Game.getMap().getTile(x+i2, y+i ));
            }
        }
    }*/
	
	/**
	 * Checks the vision status of an object 
	 * on a given tile for a given target tile.  
	 */
	/*private static void checkTile( Tile start , ObjectSheet sh , Tile target ){
		
		Unit unit = target.getUnit();
		
		// check vision status, if the object can't see the tile,
		// then don't check hidden unit 
		if( !visibleTiles.contains(target) && canSeeTile(start, sh , target) ){
			
			// add tile to visible list
			addTile(target);
			
			// if there is a hidden unit on the tile, check vision status
			if( unit != null && unit.isHidden() && !visibleStealths.contains(unit) && canSeeStealth(start, sh , target) ) addStealth(unit);
		}
	}*/
	
	/**
	 * Can an object see that tile from his position?
	 */
	/*private static boolean canSeeTile( Tile start , ObjectSheet sh , Tile target ){
		
		int range = getRange(start, target);
		//int needed = target.sheet().getDetectingRange( sh );
		
		if( needed == -1 || range <= needed ) return true;
		else return false;
	}*/

	/**
	 * Can an object see that stealth from his position?
	 */
	/*private static boolean canSeeStealth( Tile start , ObjectSheet sh , Tile target ){
		
		int range = getRange(start, target);
		//int needed = target.getUnit().sheet().getStealthRange( sh );
		
		if( range <= needed ) return true;
		else return false;
	}*/
	
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
	
	/**
	 * Clears the sight value.
	 */
	private static void clearSight(){
		sightValue = 0;
	}
}

