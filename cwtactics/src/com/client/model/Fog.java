package com.client.model;

import java.util.ArrayList;

//import object.Field;
//import object.Map;

import com.client.model.object.Game;
import com.client.model.object.Player;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.sheets.ObjectSheet;

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
	

	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	public static void noFog( boolean fog ){
		clearTiles();
		clearSteahlts();
		noFog = fog;
	}
	
	public static void processFog( Player player ){
    		
    	// check up all visions from properties and units
    	for( Player pl : Game.getPlayers() ){
    		
    		// TODO if( ! map.inTeam( p, player) ) continue;
    		
    		for( Tile tile : pl.getProperties() ){
        		vision(tile, tile.sheet() );
        	}
    		
    		for( Unit unit : pl.getUnits() ){
    			vision( Game.getMap().findTile(unit) , unit.sheet() );
    		}
    	}
    	
    }
	
	
	
	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */
	
	private static void clearTiles(){
		visibleTiles.clear();
	}
	
	private static void clearSteahlts(){
		visibleStealths.clear();
	}
	
	private static void addTile( Tile tile ){
		visibleTiles.add(tile);
	}
	
	private static void addStealth( Unit unit ){
		visibleStealths.add(unit);
	}
	
	private static void vision( Tile tile , ObjectSheet sh ){
		
		// variables
		int range = sh.getVision();
		int x = tile.getPosX();
		int y = tile.getPosY();
		
		// add tiles that the object can see
		for( int i = 0 ; i <= range ; i++ ){
            for( int i2 = 0 ; i2 <= range-i ; i2++ ){
                if ( x - i2 >= 0 && y - i >= 0                                             && !visibleTiles.contains( Game.getMap().getTile(x-i2, y-i )) ) ;
                if ( x + i2 < Game.getMap().getSizeX() && y - i >= 0                       && !visibleTiles.contains( Game.getMap().getTile(x+i2, y-i )) ) ;
                if ( x - i2 >= 0 && y + i < Game.getMap().getSizeY()                       && !visibleTiles.contains( Game.getMap().getTile(x-i2, y+i )) ) ;
                if ( x + i2 < Game.getMap().getSizeX() && y + i < Game.getMap().getSizeY() && !visibleTiles.contains( Game.getMap().getTile(x+i2, y+i )) ) ;
            }
        }
    }
	
	//private static checkTile( Tile tile ){
		
	//	if( canSeeTile() ){
			
	//		Unit unit = tile.getUnit();
	//		if( unit != null /* hidden */ ){
				
	//		}
	//	}
	//}
	
	//private static boolean canSee( int x , int y , ObjectSheet sh , Tile target ){

     //   int xR = target.getPosX() - x;
     //   int yR = target.getPosY() - y;
     //   if( xR < 0 ) xR = xR*(-1);
    //    if( yR < 0 ) yR = yR*(-1);
     //   int range = xR + yR;
    //    int needR = 1;
        
	//	if( target.sheet().getDetectingRange(sh) != -1 ){
	//		needR = target.sheet().getDetectingRange(sh);
	//	}
		
   //     if ( id != -1 ) needR = Misc_Data.specialVisionRange(type, id);

   //     if ( range <= needR ) return true;
   //     return false;
   // }
	
	//private static boolean canSeeStealth( int x , int y , ObjectSheet sh , Unit target ){
    	
		
		
		
		
     //   int range = 0;
     //   int xR = field.getPos_x() - x;
     ///   int yR = field.getPos_y() - y;
     //   if( xR < 0 ) xR = xR*(-1);
     //   if( yR < 0 ) yR = yR*(-1);
     //   range += xR + yR;
    //    int needR = 1;
    //    if ( id != -1 ) needR = Misc_Data.specialVisionRange(type, id);

    //    if ( range <= needR ) return true;
    //    return false;
    //}
	

	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

}

