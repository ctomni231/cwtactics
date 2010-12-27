package com.system.data.sheets;

import java.util.ArrayList;

import com.customwarsTactics.model.mapObjects.Player;
import com.system.data.Engine_Database;

/**
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Tile_Sheet extends ObjectSheet{

	/*
	 * VARIABLES
	 * *********
	 */
	
	private static final int repairExtra = 50;		// halves the repair price
	
	private int capturePoints;
	private ArrayList<Unit_Sheed> builds;
	private ArrayList<Unit_Sheed> repairs;
	
	
	/*
	 * CONSTRUCTORS
	 * ************ 
	 */
	
	public Tile_Sheet(){
		
		capturePoints = -1;
		builds = new ArrayList<Unit_Sheed>();
		repairs = new ArrayList<Unit_Sheed>();
		
		builds.trimToSize();
		repairs.trimToSize();
	}
	
	

	/*
	 * ACCESS METHODS
	 * **************
	 */

	/**
	 * Returns the amount of capture points the property have
	 */
	public int getCapturePoints() {
		return capturePoints;
	}

	/**
	 * Sets the amount of capture points that the property have
	 */
	public void setCapturePoints(int capturePoints) {
		this.capturePoints = capturePoints;
	}

	/**
	 * Adds an unit type to the build list
	 */
	public void addBuildType( Unit_Sheed sh ){
		if( sh == null || builds.indexOf(sh) != -1 ){ System.err.println("Cannot add to building sheme"); return; }
		builds.add(sh);
	}

	/**
	 * Returns the full list of build able unit types
	 */
	public ArrayList<Unit_Sheed> getBuildList(){
		return builds;
	}
	
	public ArrayList<Unit_Sheed> getRepairList(){
		return repairs;
	}
	
	/**
	 * Can the tile build something?
	 */
	public boolean canBuild(){
		if(  builds.size() > 0 ) return true;
		return false;
	}
	
	/**
	 * Is the tile capture able ?
	 */
	public boolean isCapturable(){
		if( getCapturePoints() != -1 ) return true;
		return false;
	}

	/**
	 * Can a unit type builded by the property
	 */	
	public boolean canBuild( Unit_Sheed sh ){
		if( sh != null && builds.indexOf(sh) != -1 ) return true;
		return false;
	}
	
	/**
	 * Can a unit type repaired by the property
	 */	
	public boolean canRepair( Unit_Sheed sh ){
		if( sh != null && repairs.indexOf(sh) != -1 ) return true;
		return false;
	}
	
	/**
	 * get repair cost for repairing an unit with 
	 * a given health.
	 */
	public int[] getRepairCost( Unit_Sheed sh , int health ){
		
		int[] cost = new int[ Engine_Database.getRessourceTable().size() ];
		for( Sheet i : Engine_Database.getRessourceTable() ){
			cost[ Engine_Database.getResourceNumber(i) ] = ( sh.getCost( i ) * health * repairExtra ) / 10000; 
		}
		
		return cost;
	}
	
	/**
	 * Can a player pay a given cost array?
	 */
	public boolean canPay( int[] cost , Player player ){
		
		for( int i = 0 ; i < cost.length ; i++ ){
			if( player.getResourceValue(i) < cost[i] ) return false;
		}
		
		return true;
	}

	

}

