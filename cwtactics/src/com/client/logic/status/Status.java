package com.client.logic.status;

import com.client.menu.GUI.MapDraw;
import com.sun.org.apache.regexp.internal.recompile;

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
	 * ENUMERATIONS
	 * ************
	 * 
	 */
	
	// the different states
	public enum Mode{ 
		
		// enumerations
		WAIT			( new Status_Wait() ),
		SHOW_RANGE		( new Status_ShowRange() ),
		SHOW_MOVE		( new Status_ShowMove() ),
		SHOW_TARGETS	( new Status_ShowTargets() ),
		MENU			(null);
		
		// variable
		private Status_Interface stat;
		
		// constructor
		Mode( Status_Interface stat ){
			this.stat = stat;
		}
		
		// getter
		public Status_Interface getObject(){
			return stat;
		}
	}
	
	
	
	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
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
	 */
	public static void setStatus( Mode status ){
		
		// check status
		if( status == null || status.getObject() == null ){
			System.err.println("STATUS IS NOT CORRECT!");
			return;
		}
		
		Status.status = status;
	}

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */

	/**
	 * Update logic for a given status.
	 */
	public static void update(int timePassed , MapDraw map ){
		
		// do update method
		status.getObject().update(timePassed , map);
	}

}

