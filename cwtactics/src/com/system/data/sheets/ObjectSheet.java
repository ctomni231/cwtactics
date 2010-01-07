package com.system.data.sheets;

import java.util.ArrayList;
import java.util.HashMap;

import com.system.data.Data;

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
	private HashMap<ObjectSheet,Integer>	hiddenRanges;
	private int needRange;
	private ArrayList<Unit_Sheed>	supplies;
	
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public ObjectSheet(){

		vision = -1;
		needRange = -1;
		tags = new ArrayList<Integer>();
		cost = new HashMap<Sheet, Integer>();
		hiddenRanges = new HashMap<ObjectSheet,Integer>();
		supplies = new ArrayList<Unit_Sheed>();
		
		supplies.trimToSize();
		tags.trimToSize();
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
	
	public int getNeedRange() {
		return needRange;
	}
	
	public void setNeedRange( int vision ){
		this.needRange = vision;
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
	public void addDetectRange( ObjectSheet sh , int value ){
		if( sh == null || value <= 1 || hiddenRanges.containsKey(sh) ){ System.err.println("Cannot add sheet for "+super.getName()+" special ranges, because sheed is null or allready in special ranges or value isn't correct"); return; }
		else hiddenRanges.put(sh,value);
	}
	
	/**
	 * Returns the range that is needed to see the object.
	 */
	public int getDetectingRange( ObjectSheet sh ){
		
		if( hiddenRanges.containsKey(sh) ) return hiddenRanges.get(sh);
		
		// all tiles are visible in any range, but hidden tiles like 
		// forest, are only visible in a given range or less. 
		else return needRange;
	}
	
	/**
	 * Returns the range that is needed to see the object
	 * in stealth mode.
	 */
	public int getStealthRange( ObjectSheet sh ){
		
		if( hiddenRanges.containsKey(sh) ) return hiddenRanges.get(sh);
		
		// all stealth units, not important how the situation is, are visible at 
		// a range of 1.
		else return 1;
	}
	
	/**
	 * Adds a type of an unit to the supply table
	 */
	public void addSupplyType( Unit_Sheed sh ){
		if( sh == null || supplies.indexOf(sh) != -1 ){ System.err.println("Cannot add sheed for "+super.getName()+" supplies, because sheed is null or allready in supplies"); return; }
		else supplies.add(sh);
	}
	
	/**
	 * Returns a list of type that can be supplied by the unit 
	 */
	public ArrayList<Unit_Sheed> getAllPossibleSupplyTargets(){
		return supplies;
	}
	
	/**
	 * Can a type of an unit supplied by this unit 
	 */
	public boolean canSupply( Unit_Sheed sh ){
		if( sh == null || supplies.indexOf(sh) == -1 ) return false;
		else return true;
	}
	
	/**
	 * get repair cost for repairing an unit with 
	 * a given health.
	 */
	public int[] getSupplyCost( Unit_Sheed sh , int amount ){
		
		//TODO search better configuration --> mod.xml settings for prices etc...
		
		int length = Data.getRessourceTable().size();
		int[] cost = new int[ length ];
		
		for( int i = 0 ; i < length ; i++ ){
			cost[i] = ( sh.getCost( Data.getRessourceTable().get(i) ) * amount * 2 ) / 10000; 
		}
		
		return cost;
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
		
		if( resID == null ){ System.err.println("Ressource "+resID+" doesn'T exist in the database"); return 0; } 
		if( !cost.containsKey(resID) ) return 0;
		else return cost.get(resID);
	}
	
	public int[] getCostTable(){
		int[] costTable = new int[ Data.getRessourceTable().size() ];
		for( Sheet i : cost.keySet() ){
			costTable[ Data.getRessourceTable().indexOf(i) ] = cost.get(i);
		}
		return costTable;
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

