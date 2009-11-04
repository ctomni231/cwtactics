package com.system.data.sheets;

import java.util.ArrayList;

public class Tile_Sheet extends ObjectSheet{

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private int capturePoints;
	private ArrayList<Unit_Sheed> builds;

	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Tile_Sheet(){
		
		capturePoints = -1;
		builds = new ArrayList<Unit_Sheed>();
		
		builds.trimToSize();
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
	 * Can a unit type builded by the property
	 */	
	public boolean canBuild( Unit_Sheed sh ){
		if( sh != null && builds.indexOf(sh) != -1 ) return true;
		return false;
	}
	

}

