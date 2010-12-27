package com.customwarsTactics.model.mapObjects;

import com.client.model.object.Game;
import com.client.model.object.Team;
import java.util.ArrayList;
import com.system.data.Engine_Database;

/**
 * Holds a player of a game round.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Player {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private String name;
	private ArrayList<Unit> units;
	private ArrayList<Tile> properties;
	private Team team;
	private int[] resourcePool;
	
	

	/*
	 * CONSTRUCTORS
	 * ************ 
	 */
	
	public Player( String name , Team team ){
		
		this.name	= name;
		this.team	= team;
		units		= new ArrayList<Unit>();
		properties	= new ArrayList<Tile>();
		resourcePool = new int[ Engine_Database.getRessourceTable().size() ];
		
		units.trimToSize();
		properties.trimToSize();
	}
	
	

	/*
	 * ACCESS METHODS
	 * ************** 
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
	
	public boolean hasUnit( Unit unit ){
		return ( units.contains(unit) )? true : false;
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
	
	public boolean hasProperty( Tile tile ){
		return ( properties.contains(tile) )? true : false;
	}
	
	public void changeResource( int resID , int value ){
		resourcePool[resID] += value;
	}
	
	public void setResource( int resID , int value ){
		if( value < 0 ) return;
		resourcePool[resID] = value;
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
	
}

