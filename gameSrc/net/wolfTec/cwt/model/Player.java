package net.wolfTec.cwt.model;

import net.wolfTec.cwt.Constants;

public class Player {

	public int	        id	               = -1;
	public int	        team	             = Constants.INACTIVE_ID;
	public String	      name;
	public int	        power	             = 0;
	public int	        powerUsed	         = 0;
	public int	        gold	             = 0;
	public int	        manpower	         = Integer.MAX_VALUE;
	public int	        numberOfUnits	     = 0;
	public int	        numberOfProperties	= 0;
	public CoType	      mainCo	           = null;
	public CoType	      sideCo	           = null;
	public CoPowerLevel	activePower	       = CoPowerLevel.OFF;
	public ArmyType	    army;
	public boolean	    turnOwnerVisible	 = false;
	public boolean	    clientVisible	     = false;
	public boolean	    clientControlled	 = false;

	/**
	 * Modifies the power level of a **player** by a given **value**.
	 *
	 * @param player
	 * @param value
	 */
	public void setPower(int value) {
		power += value;

		// check left bound
		if (power < 0) {
			power = 0;
		}
	}

}
