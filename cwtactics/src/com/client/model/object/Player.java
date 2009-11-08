package com.client.model.object;

import java.util.ArrayList;
import java.util.HashMap;

import com.system.data.Data;
import com.system.data.sheets.Sheet;

public class Player {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private String name;
	private ArrayList<Unit> units;
	private ArrayList<Tile> properties;
	private int[] resourcePool;
	
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Player( String name ){
		
		this.name	= name;
		units		= new ArrayList<Unit>();
		properties	= new ArrayList<Tile>();
		resourcePool = new int[ Data.getRessourceTable().size() ];
		
		units.trimToSize();
		properties.trimToSize();
	}
	
	

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public ArrayList<Unit> getUnits() {
		return units;
	}
	
	public void setUnits(ArrayList<Unit> units) {
		this.units = units;
	}
	
	public void addUnit( Unit unit ){
		units.add( unit );
	}
	
	public void removeUnit( Unit unit ){
		units.remove(unit);
	}
	
	public ArrayList<Tile> getProperties() {
		return properties;
	}
	
	public void setProperties(ArrayList<Tile> properties) {
		this.properties = properties;
	}
	
	public void addProperty( Tile prop ){
		properties.add(prop);
	}
	
	public void removeProperty( Tile prop ){
		properties.remove(prop);
	}
	
	public void changeResource( int resID , int value ){
		resourcePool[resID] += value;
	}
	
	public int getResourceValue( int resID ){
		return resourcePool[resID];
	}
	
	public int getID(){
		return Game.getMap().getPlayerID(this);
	}
	
	
	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */

	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */

	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

}

