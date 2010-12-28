package com.system.data.sheets;

import java.util.ArrayList;
import java.util.HashMap;

import com.client.model.object.Game;
import com.cwt.model.mapObjects.Map;
import com.cwt.model.mapObjects.Tile;
import com.cwt.model.mapObjects.Unit;
import com.system.log.Logger;

/**
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Unit_Sheed extends ObjectSheet {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private HashMap<Sheet, Integer> fuelResupplyCost;
	private HashMap<Sheet, Integer> ammoResupplyCost;
	
	private Move_Sheet moveType;
	private int 	moveRange;
	private int 	captureValue;
	private int 	weight;
	private int 	fuel;
	private int		ammo;
	private int		canLoad;
	private int		unitLevel;
	
	private boolean canHide;
	
	private ArrayList<Weapon_Sheed> weapons;
	private ArrayList<Unit_Sheed>	loads;
	private ArrayList<Tile_Sheet> unloadPlaces;
	
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************ 
	 */
	
	public Unit_Sheed(){

		fuelResupplyCost = new HashMap<Sheet, Integer>();
		ammoResupplyCost = new HashMap<Sheet, Integer>();
		
		weapons	 = new ArrayList<Weapon_Sheed>();
		loads	 = new ArrayList<Unit_Sheed>();
		unloadPlaces = new ArrayList<Tile_Sheet>();
		
		// memory saving operations
		// reduce size for units that hasen't 
		// loads, supply targets ...
		weapons.trimToSize();
		loads.trimToSize();
		unloadPlaces.trimToSize();
	}
	
	

	/*
	 * ACCESS METHODS
	 * **************
	 */
	
	/**
	 * Returns the movetype 
	 */
	public Move_Sheet getMoveType() {
		return moveType;
	}

	/**
	 * Sets the movetype
	 */
	public void setMoveType( Move_Sheet moveType) {
		this.moveType = moveType;
	}

	/**
	 * Returns the move range
	 */
	public int getMoveRange() {
		return moveRange;
	}

	/**
	 * Sets the move range
	 */
	public void setMoveRange(int moveRange) {
		this.moveRange = moveRange;
	}

	/**
	 * Returns the capture value that 
	 * the unit can do
	 */
	public int getCaptureValue() {
		return captureValue;
	}

	/**
	 * Sets the capture value 
	 */
	public void setCaptureValue(int captureValue) {
		this.captureValue = captureValue;
	}

	/**
	 * Returns the weight of the unit 
	 */
	public int getWeight() {
		return weight;
	}

	/**
	 * Sets the weight of the unit
	 */
	public void setWeight(int weight) {
		this.weight = weight;
	}

	/**
	 * Returns the amount of maximal fuel
	 */
	public int getFuel() {
		return fuel;
	}

	/**
	 * Sets the maximum amount of fuel
	 */
	public void setFuel(int fuel) {
		this.fuel = fuel;
	}

	/**
	 * Returns the maximal amount of ammo
	 */
	public int getAmmo() {
		return ammo;
	}

	/**
	 * Sets the maximal amount of ammo
	 */
	public void setAmmo(int ammo) {
		this.ammo = ammo;
	}

	/**
	 * Returns how much weight the unit can load. only for transport units
	 */
	public int canLoadWeight() {
		return canLoad;
	}

	/**
	 * Sets how much weight the unit can load. only for transport units
	 */
	public void setLoadWeight(int canLoad) {
		this.canLoad = canLoad;
	}

	/**
	 * Returns the number of weapons of the unit 
	 */
	public int getNumberOfWeapons(){
		return weapons.size();
	}

	/**
	 * Adds a weapon to the unit
	 */
	public void addWeapon( Weapon_Sheed sh ){
		weapons.add(sh);
	}

	/**
	 * Returns the weapon by a given ID
	 */
	public Weapon_Sheed getWeapon( int ID ){
		if( ID < 0 || ID >= weapons.size() ){ Logger.warn("Unit "+super.getName()+" has not a weapon with ID "+ID); return null; }
		return weapons.get(ID);
	}

	/**
	 * Returns the list of type that the unit can load
	 */
	public ArrayList<Weapon_Sheed> getAllWeapons(){
		return weapons;
	}
	
	/**
	 * Adds a type of an unit that the transport unit can load
	 */
	public void addLoadType( Unit_Sheed sh ){
		if( sh == null || loads.indexOf(sh) != -1 ){ Logger.warn("Cannot add sheet for "+super.getName()+" loads, because sheed is null or allready in loads"); return; }
		else loads.add(sh);
	}

	/**
	 * Returns the list of type that the unit can load
	 */
	public ArrayList<Unit_Sheed> getAllPossibleLoads(){
		return loads;
	}

	/**
	 * Can the unit load a unit type ?
	 */
	public boolean canLoad( Unit_Sheed sh ){
		if( sh == null || loads.indexOf(sh) == -1 ) return false;
		else return true;
	}
	
	/**
	 * Returns a list of tiles where the unit can unloaded.
	 */
	public ArrayList<Tile> getUnloadPlaces( Tile tile , Unit apc ){
		
		ArrayList<Tile> list = new ArrayList<Tile>();
		Map map = Game.getMap();
		Move_Sheet mv = getMoveType();
		Tile n = map.getTile( tile.getPosX() , tile.getPosY() - 1 );
		Tile e = map.getTile( tile.getPosX() + 1 , tile.getPosY() );
		Tile s = map.getTile( tile.getPosX() , tile.getPosY() + 1 );
		Tile w = map.getTile( tile.getPosX() - 1 , tile.getPosY() );
		
		// CHECK UNLOAD TILES
		if( n != null && (n.getUnit() == null || n.getUnit() == apc ) && mv.getMoveCost( n.sheet() ) != -1 ) list.add( n );
		if( e != null && (e.getUnit() == null || e.getUnit() == apc ) && mv.getMoveCost( e.sheet() ) != -1 ) list.add( e );
		if( s != null && (s.getUnit() == null || s.getUnit() == apc ) && mv.getMoveCost( s.sheet() ) != -1 ) list.add( s );
		if( w != null && (w.getUnit() == null || w.getUnit() == apc ) && mv.getMoveCost( w.sheet() ) != -1 ) list.add( w );
		
		return list;
	}

	/**
	 * Can an transport unit unload on a given tile.
	 */
	public boolean canUnitUnloaded( Tile tile , Unit apc ){
		
		// IF THE TRANSPORT CAN ONLY UNLOAD ON SPECIAL TILES
		// AND THIS TILES ISN'T IN THE LIST, THEN RETURN FALSE
		if( unloadPlaces.size() > 0 && !unloadPlaces.contains(tile.sheet())) return false;
		
		if( getUnloadPlaces(tile,apc).size() > 0 ) return true;
		else return false;
	}
	
	/**
	 * Add a unload only on condition
	 * to the list.
	 */
	public void addUnloadTile( Tile_Sheet sh ){
		unloadPlaces.add(sh);
	}
	
	
	
	/*
	 * COST METHODS
	 * ************
	 */
	
	/**
	 * Sets the cost of re-supply one unit
	 * ammo
	 */
	public void setAmmoCost( Sheet resID , int value ){		
		
		if( resID == null ){ System.err.println("Ressource "+resID+" doesn'T exist in the database"); return; }
		if( ammoResupplyCost.containsKey(resID) ) ammoResupplyCost.remove(resID);
		ammoResupplyCost.put( resID , value);
	}
	
	/**
	 * Returns the cost of re-supply one unit 
	 * of ammo 
	 */
	public int getAmmoCost( Sheet resID ){
		if( resID == null || !ammoResupplyCost.containsKey(resID) ){ System.err.println("Ressource "+resID+" doesn'T exist in the database"); return -1; }
		else return ammoResupplyCost.get(resID);
	}
	
	/**
	 * Sets the amount of cost to re-supply
	 * one gallon of fuel
	 */
	public void setFuelCost( Sheet resID , int value ){		
		
		if( resID == null ){ System.err.println("Ressource "+resID+" doesn'T exist in the database"); return; }
		if( fuelResupplyCost.containsKey(resID) ) fuelResupplyCost.remove(resID);
		fuelResupplyCost.put( resID , value);
	}
	
	/**
	 * Returns the fuel supply cost 
	 * for one gallon
	 */
	public int getFuelCost( Sheet resID ){
		if( resID == null || !fuelResupplyCost.containsKey(resID) ){ System.err.println("Ressource "+resID+" doesn'T exist in the database"); return -1; }
		else return fuelResupplyCost.get(resID);
	}

	/**
	 * Returns the level of the unit.
	 */
	public int getLevel(){
		return unitLevel;
	}

	/**
	 * Sets the level of the unit.
	 */
	public void setLevel( int level ){
		unitLevel = level;
	}

	/**
	 * Can this unit hide itself?
	 */
	public boolean canHide(){
		return canHide;
	}

	/**
	 * Sets the stealth ability.
	 */
	public void setCanHide( int value ){
		if( value == 1 ) setCanHide(true);
		else setCanHide(false);
	}

	/**
	 * Sets the stealth ability.
	 */
	public void setCanHide( boolean value ){
		canHide = value;
	}
}

