package com.system.data.sheets;

/**
 * 
 * @author Tapsi [BcMk]
 */
public class Weapon_Sheed extends Sheet{

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
	private int		fireMode;		// 0 direct , 1 indirect , 2 indirect+move, 3 indirect + counter direct
	private int		rangePenalty;
	private boolean[]   attackable;
	
	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Weapon_Sheed(){
		
		fireMode = 0;
		maxRange = 1;
		minRange = 1;
		attackable = new boolean[6];
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

	public boolean canAttack( Unit_Sheed sh ){
		
		// get level and check it
		int lv = sh.getLevel();
		if( lv < 0 || lv >= attackable.length ) return false;
			
		// return value
		if( attackable[lv] ) return true;
		else return false;
	}
	
	public void setAttack( int lv , boolean value ){
		
		// get level and check it
		if( lv < 0 || lv >= attackable.length ) return;
		
		attackable[lv] = value;
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

