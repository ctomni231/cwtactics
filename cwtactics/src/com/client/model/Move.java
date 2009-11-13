package com.client.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Set;

import com.client.model.object.Game;
import com.client.model.object.Tile;
import com.client.model.object.Unit;

public class Move {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */

	private static HashMap<Tile,MoveObject> moveTiles = new HashMap<Tile, MoveObject>();
	private static ArrayList<Tile> moveWay 	= new ArrayList<Tile>();
	private static int additionalTiles;
	private static Tile	start;
	private static Unit unit;

	
	
	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	/**
	 * Resets the status of Move system.
	 */
	public static void clear(){ 
		
		clearFields(); 
		clearWay(); 
		additionalTiles = 0;
		start = null;
		unit = null;
	}
	
	/**
	 * Clears move way. 
	 */
	public static void clearWay(){ 
		moveWay.clear(); 
	}

	/**
	 * Clears tile map.
	 */
	public static void clearFields(){ 
		moveTiles.clear(); 
	}

	
	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */

	/**
	 * Initializes the Move system for an unit and a 
	 * start tile. 
	 */
	public static void initialize( Tile start , Unit unit ){
		
		// clear old
		clear();
		
		// set variables
		Move.start = start;
		Move.unit = unit;
		
		// check trigger
		additionalTiles = 1;	// <-- only as test, later here will be a trigger check for UNIT_WANT_MOVE
	}
	
	/**
	 * Is the Move system initialized ? 
	 */
	public static boolean initialized(){
		if( moveTiles.size() == 0 && moveWay.size() == 0 ) return true;
		return false;
	}

	/**
	 * Returns the complete fuel consumption
	 * for the move way.
	 */
    public static int getCompleteFuel(){
    	return getFuel( 1 );
    }
	
	/**
	 * Set ups, a map of tiles for the unit
	 * which want to move.
	 */
	public static void move(){
		
		// check status of move
		if( !initialized() ){
			System.err.println("Unit wants to move, but Move isn't correctly initialised");
			return;
		}
		
		// variables
		ArrayList<Tile> freeTiles = new ArrayList<Tile>();
		
		// add start tile
		freeTiles.add(start);
		
		// calculate free tiles
		if( additionalTiles > 0 ){
			
			// variables
			int x = start.getPosX();
			int y = start.getPosY();
			
			// add a the free tiles range
			for( int i = 0 ; i <= additionalTiles ; i++ ){
	            for( int i2 = 0 ; i2 <= additionalTiles-i ; i2++ ){
	                if ( x - i2 >= 0                       && y - i >= 0                       && freeTiles.indexOf(Game.getMap().getTile(x-i2, y-i)) == -1 ) freeTiles.add( Game.getMap().getTile(x-i2, y-i) );
		            if ( x - i2 >= 0                       && y + i < Game.getMap().getSizeY() && freeTiles.indexOf(Game.getMap().getTile(x-i2, y+i)) == -1 ) freeTiles.add( Game.getMap().getTile(x-i2, y+i) );
	                if ( x + i2 < Game.getMap().getSizeX() && y - i >= 0                       && freeTiles.indexOf(Game.getMap().getTile(x+i2, y-i)) == -1 ) freeTiles.add( Game.getMap().getTile(x+i2, y-i) );
	                if ( x + i2 < Game.getMap().getSizeX() && y + i < Game.getMap().getSizeY() && freeTiles.indexOf(Game.getMap().getTile(x+i2, y+i)) == -1 ) freeTiles.add( Game.getMap().getTile(x+i2, y+i) );
	            }
	        }
			
			// drop not move able fields
			Set<Tile> set = moveTiles.keySet();
			for( Tile tile : set ){
				if( unit.sheet().getMoveType().getMoveCost( tile.sheet() ) == -1 ) moveTiles.remove(tile);
			}
		}

		// calculate normal move
		for( Tile tile : freeTiles ){
			run( tile , 0 , true );
		}
		
		// remove tile where own units are, we can move through
		// these tiles, but not directly onto them
		for( Tile tile : moveTiles.keySet() ){
			
			Unit unit  =  tile.getUnit();
			
			// mostly only own units left in moveTiles,
			// but we must ignore hidden enemy units
			if( unit != null && unit.getOwner() == Move.unit.getOwner() ){
				
				if( Move.unit == unit ) getMoveObj(tile).setMoveable(false);
				
				// if the own unit cannot load the moving unit,
				// drop tile from move array
				if( !unit.sheet().canLoad( Move.unit.sheet() ) ) getMoveObj(tile).setMoveable(false);
			}
		}
		
		// add start tile to way
		moveWay.add(start);
	}

	/**
	 * Adds a tile to the move way.
	 */
    public static void toMoveWay( Tile tile ){
    	        
        // PROCESS IT'S POSITION WITH THE MOVING WAY
        if ( tile == start ) clearTo(start);                            // IS THE INPUT THE STARTPOINT
        else if ( !moveTiles.containsKey(tile) ) return;                // IS THE INPUT NOT IN THE FOCUS
        else if ( moveWay.get( moveWay.size() - 1 ) == tile ) return;   // IS THE INPUT FIELD THE SAME AS THE LAST IN MOVE
        else if ( moveWay.indexOf(tile) != -1 ) clearTo( tile );        // IS THE INPUT ALLREADY IN THE MOVING WAY
        else {

            // INPUT IS NEXT TO THE LAST FIELD OF THE MOVING WAY
            if ( hasNeighborInList(tile) ){

                // CHECK IF THE WAY CROSS ITSELF
            	Tile crossed = crossWay(tile);
                if( crossed != null ) clearTo(crossed);

                if ( getMinorFuel() + unit.sheet().getMoveType().getMoveCost( tile.sheet() ) <= unit.sheet().getMoveRange() ) moveWay.add(tile);
                else findAlternativeWay(tile);     // IF THE UNIT HAVEN'T ENOUGH MOVEPOINTS
            }
            else findAlternativeWay(tile);
        }
    }

	 

	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */

	/**
	 * Runs recursively to setting up the tile map.
	 */
	private static void run( Tile tile , int points , boolean start ) {

		// variables
		int x = tile.getPosX();
		int y = tile.getPosY();
		int movecost = 0;
		
		if( !start ){
			
			// variables
	        movecost = unit.sheet().getMoveType().getMoveCost( tile.sheet() );
	        
	        // can you move onto this tile?
	        if( !checkTile( tile, points, movecost ) ) return;
	        else{ 
	        	MoveObject mObj = getMoveObj(tile);
	        	
	        	// add tile to move array and set needed fuel to move onto it
	        	if( mObj.getFuel() == -1 || points + movecost < mObj.getFuel() ) mObj.setFuel( points + movecost );
	        }
		}
        
        // check neighbor tiles
		int left = points+movecost;
        if ( x > 0 )                           run( Game.getMap().getTile(x-1, y  ), left , false );
        if ( x < Game.getMap().getSizeX() -1 ) run( Game.getMap().getTile(x+1, y  ), left , false );
        if ( y < Game.getMap().getSizeY() -1 ) run( Game.getMap().getTile(x  , y+1), left , false );
        if ( y > 0 )                           run( Game.getMap().getTile(x  , y-1), left , false );
        
    }
	
	 /** 
	  * Can the unit move onto this Tile?
	  */
    private static boolean checkTile( Tile tile , int neededFuel , int cost ) {
        
    	if( cost == -1 ) return false;
    	
    	Unit unit = tile.getUnit();
    	
    	if( neededFuel + cost <= Move.unit.sheet().getMoveRange() ){
    		if( unit == null ) return true;
    		if( Fog.inFog(tile) ) return true;
    		if( unit.getOwner() == Move.unit.getOwner() ) return true;
    		if( unit.isHidden() && !Fog.isVisible(unit) ) return true;
    	}
    	return false;
    }

	/**
	 * Get fuel consumption to move the
	 * move way. This method drops fuel
	 * consumption from the free tiles.
	 */
    private static int getMinorFuel( ){
    	
    	// +1 because of tile at position zero,
    	// the start tile
    	if( moveWay.size() <= additionalTiles +1 ) return 0;
    	
    	return getFuel( additionalTiles +1);
    }

	/**
	 * Returns the fuel consumption of the move way
	 * from a given start position.
	 */
    private static int getFuel( int startPos ){
		
		int fuel = 0;
		for( int i = startPos ; i < moveWay.size() ; i++ ){
			fuel += unit.sheet().getMoveType().getMoveCost( moveWay.get(i).sheet() );
		}
		
		return fuel;
	}

	/**
	 * Returns a moveObject from tile map, if not exist 
	 * it will create a new one.
	 */
    private static MoveObject getMoveObj( Tile tile ){
    	
    	if( !moveTiles.containsKey(tile) ) moveTiles.put(tile, new MoveObject() );
    	return moveTiles.get(tile);
    }

	/**
	 * Clears the move way to a given tile.
	 */
    private static void clearTo( Tile tile ){
    	
    	if( moveWay.indexOf(tile) == -1 ){
    		System.err.println("Moving way doesn'T contain the field to that I cut the last tile from it... ( bad english XD )");
    		return;
    	}
    	
    	// cut all tiles from way until the parameter tile
    	// is the last in the way list
    	while( moveWay.get( moveWay.size() -1 ) != tile ){
    		moveWay.remove( moveWay.size() -1 );
    	}
    }

	/**
	 * Is a neighbor of a given tile in the move
	 * way?
	 */
    private static boolean hasNeighborInList( Tile tile ){
    	
    	int x = tile.getPosX();
		int y = tile.getPosY();
		
    	if ( x > 0                            && moveWay.indexOf( Game.getMap().getTile(x-1, y  ) ) != -1 ) return true;                    
        if ( x < Game.getMap().getSizeX() -1  && moveWay.indexOf( Game.getMap().getTile(x+1, y  ) ) != -1 ) return true;
        if ( y < Game.getMap().getSizeY() -1  && moveWay.indexOf( Game.getMap().getTile(x  , y+1) ) != -1 ) return true;
        if ( y > 0                            && moveWay.indexOf( Game.getMap().getTile(x  , y-1) ) != -1 ) return true;
    	return false;
    }

	/**
	 * Crosses the neighbors of a tile the move way ?
	 * If yes returns the earliest tile of the move way
	 * which crosses the neighbors of the given tile.
	 */
    private static Tile crossWay( Tile tile ){
		
		// variables
		int x = tile.getPosX();
		int y = tile.getPosY();
		Tile t1 = null;
		Tile t2 = null;
		Tile t3 = null;
		Tile t4 = null;
		Tile inList = null;
		
		// get neighbor tiles
		if ( x > 0                           ) t1 = ( Game.getMap().getTile(x-1, y  ) );                    
	    if ( x < Game.getMap().getSizeX() -1 ) t2 = ( Game.getMap().getTile(x+1, y  ) );
	    if ( y < Game.getMap().getSizeY() -1 ) t3 = ( Game.getMap().getTile(x  , y+1) );
	    if ( y > 0                           ) t4 = ( Game.getMap().getTile(x  , y-1) );
	    
	    // set the crossed tile, that is nearest to the
	    // start of the moving way
		if( t1 != null && moveWay.indexOf(t1) != -1 ) inList = t1;
		if( t2 != null && moveWay.indexOf(t2) != -1 && ( inList == null || moveWay.indexOf(t2) < moveWay.indexOf(inList) ) ) inList = t2;
		if( t3 != null && moveWay.indexOf(t3) != -1 && ( inList == null || moveWay.indexOf(t3) < moveWay.indexOf(inList) ) ) inList = t3;
		if( t4 != null && moveWay.indexOf(t4) != -1 && ( inList == null || moveWay.indexOf(t4) < moveWay.indexOf(inList) ) ) inList = t4;
		
		return inList;
	}

	/**
	 * Find a correct way to move onto this tile.
	 */
	private static void findAlternativeWay( Tile tile ){
		
		clearTo(start);
		
        // TRY TO FIND A WAY
		boolean found = alternativeRun( start, tile , true );

		// YOU SHOUL'D FIND EVERYTIME A WAY, BUT IF NOT WRITE ERROR MESSAGE 
        if( !found ) System.err.println("Move cannot find a possible move way to tile "+tile);
	}

	/**
	 * Runs recursively the move tile in the move map
	 * to find a possible way.
	 */
	private static boolean alternativeRun( Tile tile, Tile target, boolean start ){

		// variables
		int x = tile.getPosX();
		int y = tile.getPosY();
		
		if( !start ){
			
	        // don't cross yourself and check tile
	        if ( moveWay.contains(tile) ) return false;
	        if( !checkTile(tile, getMinorFuel() , unit.sheet().getMoveType().getMoveCost( tile.sheet() ) ) ) return false;
	
	        moveWay.add(tile);
	
	        // IF THE FIELD IS THE TARGET
	        if ( tile == target ) return true;
		}

        // TRY TO FIND A WAY IN EVERY DIRECTION
		boolean found = false;
        if ( x > 0 )                                     { found = alternativeRun( Game.getMap().getTile(x-1, y  ) , target , false ); }
        if ( y > 0 && !found )                           { found = alternativeRun( Game.getMap().getTile(x  , y-1) , target , false ); }
        if ( x < Game.getMap().getSizeX() - 1 && !found ){ found = alternativeRun( Game.getMap().getTile(x+1, y  ) , target , false ); }
        if ( y < Game.getMap().getSizeY() - 1 && !found ){ found = alternativeRun( Game.getMap().getTile(x  , y+1) , target , false ); }
        
        // IF THIS ROUTE DIDN'T CORRECT REMOVE FIELD FROM ARRAY
        if ( !found  ) moveWay.remove( moveWay.size() -1 );
        return found;
    }
	
	
	
	/*
	 * 
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

	/**
	 * Prints out the move map as picture on console.
	 */
	public static void printMoveTiles(){
		System.out.println("Move Tiles :");
		for( int i = 0; i < 10 ; i++ ){
			for( int j = 0 ; j < 10 ; j++ ){
				if( moveTiles.containsKey( Game.getMap().getTile(i, j) ) ) System.out.print("X || ");
				else System.out.print("  || ");
    		}
			System.out.println();
    	}
		System.out.println();
	}

	/**
	 * Prints out the move way.
	 */
	public static void printMoveWay(){
		System.out.println("Move Way :");
		for( Tile tile : moveWay ){
			System.out.print(tile+" || ");
		}
		System.out.println();
	}
    
	
	
}

