package com.client.model.object;

import java.util.ArrayList;

import com.client.library.CustomWars_Library;
import com.system.data.sheets.Unit_Sheed;

/**
 * Holds an unit.
 * 
 * @author tapsi
 * @version 30.01.2010, #2
 */
public class Unit {

	/*
	 * VARIABLES
	 * *********
	 */

	private int		health;
	private Player	owner;
	private Unit_Sheed sheet;
	private int		experience;
	private int		rank;
	private int		fuel;
	private int		ammo;
	private boolean isHidden;
	private boolean canAct;
	private ArrayList<Unit> loads;
		
	
	
	/*
	 * CONSTRUCTORS
	 * ************ 
	 */

	public Unit( Unit_Sheed type , Player owner ){
		
		this.sheet	= type;
		this.owner	= owner;
		health		= CustomWars_Library.MAX_HEALTH;
		experience	= 0;
		rank		= 0;
		canAct		= true;
		
		ammo 		= type.getAmmo();
		fuel		= type.getFuel();
		
		loads		= new ArrayList<Unit>();
		loads.trimToSize();
	}

	
	
	/*
	 * ACCESS METHODS
	 * ************** 
	 */
	
	public int getHealth() {
		return health;
	}

	public void setHealth(int health) {
		if( health < 0 ) health = 0;
		if ( health > CustomWars_Library.MAX_HEALTH ) health = CustomWars_Library.MAX_HEALTH; 
		this.health = health;
	}

	public Player getOwner() {
		return owner;
	}

	public void setOwner(Player owner) {
		this.owner = owner;
	}

	public int getExperience() {
		return experience;
	}

	public void setExperience(int experience) {
		this.experience = experience;
	}

	public int getRank() {
		return rank;
	}

	public void setRank(int rank) {
		this.rank = rank;
	}
	
	public Unit_Sheed sheet(){
		return sheet;
	}

	public int getFuel() {
		return fuel;
	}

	public void setFuel(int fuel) {
		if( fuel < 0 ) fuel = 0;
		if ( fuel > sheet().getFuel() ) fuel = sheet().getFuel(); 
		this.fuel = fuel;
	}
	
	public int getAmmo() {
		return ammo;
	}

	public void setAmmo(int ammo) {
		if( ammo < 0 ) ammo = 0;
		if ( ammo > sheet().getAmmo() ) ammo = sheet().getAmmo(); 
		this.ammo = ammo;
	}
	
	public boolean isHidden() {
		return isHidden;
	}

	public void setHidden(boolean isHidden) {
		this.isHidden = isHidden;
	}
	
	public ArrayList<Unit> getLoadedUnits(){
		return loads;
	}
	
	public boolean hasLoads(){
		if( getNumberOfLoads() > 0 ) return true;
		else return false;
	}
	
	public int getNumberOfLoads(){
		return loads.size();
	}
	
	public Unit getLoad( int pos ){
		return ( pos >= 0 || pos < getNumberOfLoads() )? loads.get(pos) : null;
	}
	
	public void addLoad( Unit unit ){
		if( unit != null && !hasLoad(unit) ) loads.add(unit);
	}
	
	public void removeLoad( Unit unit ){
		if( unit != null && hasLoad(unit) ) loads.remove(unit);
	}
	
	public boolean hasLoad( Unit unit ){
		return ( loads.contains(unit) )? true : false;
	}
	
	public boolean canAct(){
		return canAct;
	}
	
	public void canAct( boolean value ){
		canAct = value;
	}
	
	

	/*
	 * OUTPUT METHODS
	 * **************
	 */
	
    @Override
	public String toString(){
		String s = "UNIT TYPE:"+sheet.getID()+" - HP:"+getHealth()+" - EXP:"+getExperience()+" - RANK:"+getRank();
		for( Unit load : getLoadedUnits() ) s += "\n   LOADED "+load;
		return s;
	}

}

