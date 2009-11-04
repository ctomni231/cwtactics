package com.system.data.sheets;

public class Rank_Sheet extends Sheet {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private int exp;
	

	
	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	/**
	 * Returns the needed experience points to get this rank 
	 */
	public int getExp() {
		return exp;
	}

	/**
	 * Sets the needed experience points for this rank
	 */
	public void setExp(int exp) {
		this.exp = exp;
	}
	
	
}

