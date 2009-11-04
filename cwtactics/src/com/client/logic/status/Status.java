package com.client.logic.status;

/**
 * 
 * Class Status holds the current status of the GameRound
 * logic
 * 
 * @author Tapsi
 * @version r1
 *
 */
public class Status {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	// the different states
	public enum Mode{ WAIT,SHOW_RANGE,SHOW_MOVING_RANGE,MENU };
	
	// the current sate
	private static Mode status;

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	/**
	 * returns the current status
	 * 
	 */
	public static Mode getStatus(){
		return status;
	}
	
	/**
	 * Sets a new status for update logic
	 * 
	 * @param aStatus
	 */
	public static void setStatus( Mode aStatus ){
		status = aStatus;
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

