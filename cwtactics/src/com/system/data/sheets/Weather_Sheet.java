package com.system.data.sheets;

public class Weather_Sheet extends Sheet {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private int chance;
	
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Weather_Sheet(){
		super();
	}

	
	
	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	/**
	 * Returns the chance of the weather
	 */
	public int getChance() {
		return chance;
	}
	

	/**
	 * Sets the chance of the weather
	 */
	public void setChance(int chance) {
		this.chance = chance;
	}


}

