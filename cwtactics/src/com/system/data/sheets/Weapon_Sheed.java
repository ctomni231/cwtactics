package com.system.data.sheets;

import java.util.HashMap;

public class Weapon_Sheed {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */

	private String 	name;
	private int		maxRange;
	private int 	minRange;
	private int		useAmmo;
	private int		fireMode;		// 0 direct , 1 indirect , 2 indirect+move
	private int		rangePenalty;
	private HashMap<Unit_Sheed, Integer>	damageTable;
	
	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Weapon_Sheed(){
		
		damageTable = new HashMap<Unit_Sheed, Integer>();
	}



	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	/**
	 * Returns the name of the weapon
	 */
	public String getName() {
		return name;
	}

	/**
	 * Sets the name of the weapon
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * Returns the maximal range of the weapon
	 */
	public int getMaxRange() {
		return maxRange;
	}
	
	/**
	 * Sets the maximal range of the weapon
	 */
	public void setMaxRange(int maxRange) {
		this.maxRange = maxRange;
	}

	/**
	 * Returns the minimal range of the weapon
	 */
	public int getMinRange() {
		return minRange;
	}

	/**
	 * Sets the minimal range if the weapon
	 */
	public void setMinRange(int minRange) {
		this.minRange = minRange;
	}
	
	/**
	 * Returns the amount of ammo that the weapon uses 
	 */
	public int getUseAmmo() {
		return useAmmo;
	}

	/**
	 * Sets the amount of ammo that the weapon use
	 */
	public void setUseAmmo(int useAmmo) {
		this.useAmmo = useAmmo;
	}

	/**
	 * Returns the fire mode
	 */
	public int getFireMode() {
		return fireMode;
	}

	/**
	 * Sets the fire mode
	 */
	public void setFireMode(int fireMode) {
		this.fireMode = fireMode;
	}

	/**
	 * Returns the penalty of the weapon for firing at longer range
	 */
	public int getRangePenalty() {
		return rangePenalty;
	}

	/**
	 * Sets the penalty for firing at longer range
	 */
	public void setRangePenalty(int rangePenalty) {
		this.rangePenalty = rangePenalty;
	}

	/**
	 * Sets the damage of the weapon for an unit ID
	 */
	public void setDamage( Unit_Sheed sh , int damage ){
		damageTable.put(sh, damage);
	}
	
	/**
	 * Returns the damage against an unit ID 
	 */
	public int getDamage( Unit_Sheed sh ){
		if(!damageTable.containsKey(sh) ) return -1;
		return damageTable.get(sh);
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

