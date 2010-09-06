package com.client.model.object;

import java.util.ArrayList;

import com.client.library.CustomWars_Library;
import com.system.data.sheets.Unit_Sheed;
import com.system.dynamicClass.DynamicClass;
import com.system.dynamicClass.DynamicObject;

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

	/*
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
		*/
	
	private static DynamicClass dynClass; 
	private DynamicObject obj;
	
	static{
		dynClass = new DynamicClass();
		dynClass.addAttribut("health", Integer.class);
		dynClass.addAttribut("experience", Integer.class);
		dynClass.addAttribut("rank", Integer.class);
		dynClass.addAttribut("fuel", Integer.class);
		dynClass.addAttribut("ammo", Integer.class);
		dynClass.addAttribut("owner", Object.class);
		dynClass.addAttribut("sheet", Object.class);
		dynClass.addAttribut("isHidden", Boolean.class);
		dynClass.addAttribut("canAct", Boolean.class);
		dynClass.addAttribut("loads", ArrayList.class);
	}
	
	
	/*
	 * CONSTRUCTORS
	 * ************ 
	 */

	public Unit( Unit_Sheed type , Player owner ){
		
		/*
		this.sheet	= type;
		this.owner	= owner;
		health		= CustomWars_Library.MAX_HEALTH;
		experience	= 0;
		rank		= 0;
		canAct		= true;
		
		ammo 		= type.getAmmo();
		fuel		= type.getFuel();
		
		loads		= new ArrayList<Unit>();
		loads.trimToSize();*/
		
		obj = new DynamicObject(dynClass);
		obj.setAttribut("sheet", type);
		setOwner(owner);
		setHealth(99);
		setRank(0);
		setExperience(0);
		canAct(true);
		setAmmo( type.getAmmo() );
		setFuel( type.getFuel() );
		setHidden(false);
		obj.setAttribut("loads", new ArrayList<Object>());
	}

	
	
	/*
	 * ACCESS METHODS
	 * ************** 
	 */
	
	public int getHealth() {
		return obj.getAttribut("health", Integer.class);
		//return health;
	}

	public void setHealth(int health) {
		if( health < 0 ) health = 0;
		if ( health > CustomWars_Library.MAX_HEALTH ) health = CustomWars_Library.MAX_HEALTH; 
		//this.health = health;
		obj.setAttribut("health", health);
	}

	public Player getOwner() {
		//return owner;
		return (Player) obj.getAttribut("owner", Object.class);
	}

	public void setOwner(Player owner) {
		//this.owner = owner;
		obj.setAttribut("owner", owner);
	}

	public int getExperience() {
		//return experience;
		return obj.getAttribut("experience", Integer.class);
	}

	public void setExperience(int experience) {
		//this.experience = experience;
		obj.setAttribut("experience", experience );
	}

	public int getRank() {
		// return rank;
		return obj.getAttribut("rank", Integer.class);
	}

	public void setRank(int rank) {
		//this.rank = rank;
		obj.setAttribut("rank", rank);
	}
	
	public Unit_Sheed sheet(){
		//return sheet;
		return (Unit_Sheed) obj.getAttribut("sheet", Object.class);
	}

	public int getFuel() {
		//return fuel;
		return obj.getAttribut("fuel", Integer.class);
	}

	public void setFuel(int fuel) {
		if( fuel < 0 ) fuel = 0;
		if ( fuel > sheet().getFuel() ) fuel = sheet().getFuel(); 
		//this.fuel = fuel;
		obj.setAttribut("fuel", fuel);
	}
	
	public int getAmmo() {
		//return ammo;
		return obj.getAttribut("ammo", Integer.class);
	}

	public void setAmmo(int ammo) {
		if( ammo < 0 ) ammo = 0;
		if ( ammo > sheet().getAmmo() ) ammo = sheet().getAmmo(); 
		//this.ammo = ammo;
		obj.setAttribut("ammo", ammo);
	}
	
	public boolean isHidden() {
		//return isHidden;
		return obj.getAttribut("isHidden", Boolean.class);
	}

	public void setHidden(boolean isHidden) {
		//this.isHidden = isHidden;
		obj.setAttribut("isHidden", isHidden);
	}
	
	public ArrayList<Unit> getLoadedUnits(){
		return ( obj.getAttribut("loads", ArrayList.class));
	}
	
	public boolean hasLoads(){
		if( getNumberOfLoads() > 0 ) return true;
		else return false;
	}
	
	public int getNumberOfLoads(){
		//return loads.size();
		return ( obj.getAttribut("loads", ArrayList.class)).size();
	}
	
	public Unit getLoad( int pos ){
		//return ( pos >= 0 || pos < getNumberOfLoads() )? loads.get(pos) : null;
		return (Unit) ( obj.getAttribut("loads", ArrayList.class)).get(pos);
	}
	
	public void addLoad( Unit unit ){
		//if( unit != null && !hasLoad(unit) ) loads.add(unit);
		( obj.getAttribut("loads", ArrayList.class)).add(unit);
	}
	
	public void removeLoad( Unit unit ){
		//if( unit != null && hasLoad(unit) ) loads.remove(unit);
		( obj.getAttribut("loads", ArrayList.class)).remove(unit);
	}
	
	public boolean hasLoad( Unit unit ){
		//return ( loads.contains(unit) )? true : false;
		return ( obj.getAttribut("loads", ArrayList.class)).contains(unit);
	}
	
	public boolean canAct(){
		//return canAct;
		return obj.getAttribut("canAct", Boolean.class);
	}
	
	public void canAct( boolean value ){
		//canAct = value;
		obj.setAttribut("canAct", value);
	}
	
	

	/*
	 * OUTPUT METHODS
	 * **************
	 */
	
    @Override
	public String toString(){
		String s = "UNIT TYPE:"+sheet().getID()+" - HP:"+getHealth()+" - EXP:"+getExperience()+" - RANK:"+getRank();
		for( Unit load : getLoadedUnits() ) s += "\n   LOADED "+load;
		return s;
	}

}

