package com.system.data.sheets;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Master class for unit and tile sheets
 */
public class ObjectSheet extends Sheet {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */

	private int vision;
	private ArrayList<Integer> tags;
	private HashMap<Sheet, Integer> cost;
	private HashMap<Unit_Sheed,Integer>	hiddenRanges;
	
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public ObjectSheet(){

		vision = -1;
		tags = new ArrayList<Integer>();
		cost = new HashMap<Sheet, Integer>();
		hiddenRanges = new HashMap<Unit_Sheed,Integer>();
	}
	
	

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	/**
	 * Returns the vision of this object 
	 */
	public int getVision() {
		return vision;
	}

	/**
	 * Sets the vision of this object
	 */
	public void setVision(int vision) {
		this.vision = vision;
	}

	/**
	 * Adds a tagID to this unit
	 */
	public void addTag( Integer tagID ){
		
		if( tagID == -1 || tags.indexOf(tagID) != -1 ){	System.err.println("Tag with id "+tagID+" allready in the unit tags or not correct"); return; }
		else tags.add(tagID);
	}

	/**
	 * Has the unit a given tag ?
	 */
	public boolean hasTag( Integer tagID ){
		
		if( tags.indexOf(tagID) != -1 ) return true;
		else return false;
	}

	/**
	 * Returns a list of tags, that the unit have
	 */
	public ArrayList<Integer> getTags(){
		return tags;
	}

	/**
	 * Adds a value for an unit type that can see this tile or unit ( hidden )
	 * in a given range.
	 */
	public void addDetectRange( Unit_Sheed sh , int value ){
		if( sh == null || value <= 1 || hiddenRanges.containsKey(sh) ){ System.err.println("Cannot add sheet for "+super.getName()+" special ranges, because sheed is null or allready in special ranges or value isn't correct"); return; }
		else hiddenRanges.put(sh,value);
	}
	
	/**
	 * Returns the range that is needed to see the tile
	 * or if it a unit, the unit at hidden status.
	 */
	public int getDetectingRange( Unit_Sheed sh ){
		if( hiddenRanges.containsKey(sh) ) return hiddenRanges.get(sh);
		else return 1;
	}
	
	
	
	/*
	 * 
	 * COST METHODS
	 * ************
	 * 
	 */

	/**
	 * Sets the cost of this unit
	 */
	public void setCost( Sheet resID , int value ){		
		
		if( resID == null ){ System.err.println("Ressource "+resID+" doesn'T exist in the database"); return; }
		if( cost.containsKey(resID) ) cost.remove(resID);
		cost.put( resID , value);
	}

	/**
	 * Returns the cost of this unit
	 */
	public int getCost( Sheet resID ){
		if( resID == null || !cost.containsKey(resID) ){ System.err.println("Ressource "+resID+" doesn'T exist in the database"); return -1; }
		else return cost.get(resID);
	}

	/**
	 * Sets the funds, given by this tile
	 */
	public void setFunds( Sheet resID , int value ){
		setCost(resID, value);
	}

	/**
	 * Returns the funds, given by this tile
	 */
	public int getFunds( Sheet resID ){
		return getCost(resID);
	}
}

