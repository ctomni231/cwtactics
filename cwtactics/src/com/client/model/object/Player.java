package com.client.model.object;

import java.util.ArrayList;
import com.system.data.Data;

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
	private Team team;
	private int[] resourcePool;
	
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Player( String name , Team team ){
		
		this.name	= name;
		this.team	= team;
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
		return Game.getPlayerID(this);
	}
	
	public Team getTeam(){
		return team;
	}
	
	public boolean isAlive(){
		if( team.isInTeam(this) ) return true;
		else return false;
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

