package com.system.data.sheets;

import java.util.ArrayList;

import com.client.model.object.Player;
import com.system.data.Data;

public class Tile_Sheet extends ObjectSheet{

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private static final int repairExtra = 50;		// halves the repair price
	
	private int capturePoints;
	private ArrayList<Unit_Sheed> builds;
	private ArrayList<Unit_Sheed> repairs;
	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Tile_Sheet(){
		
		capturePoints = -1;
		builds = new ArrayList<Unit_Sheed>();
		repairs = new ArrayList<Unit_Sheed>();
		
		builds.trimToSize();
		repairs.trimToSize();
	}
	
	

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
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
		
		int length = Data.getRessourceTable().size();
		int[] cost = new int[ length ];
		
		for( int i = 0 ; i < length ; i++ ){
			cost[i] = ( sh.getCost( Data.getRessourceTable().get(i) ) * health * repairExtra ) / 10000; 
		}
		
		return cost;
	}
	
	/**
	 * get repair cost for repairing an unit with 
	 * a given health.
	 */
	public int[] getFundsTable(){
		
		int length = Data.getRessourceTable().size();
		int[] cost = new int[ length ];
		
		for( int i = 0 ; i < length ; i++ ){
			cost[i] = getFunds( Data.getRessourceTable().get(i) );
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

