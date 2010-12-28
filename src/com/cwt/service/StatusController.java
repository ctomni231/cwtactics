package com.cwt.service;

import com.cwt.logic.states.Status_Interface;
import com.client.logic.status.Status_Menu;
import com.client.logic.status.Status_ShowMove;
import com.client.logic.status.Status_ShowRange;
import com.client.logic.status.Status_Wait;
import com.client.menu.GUI.MapDraw;
import com.system.log.Logger;

/**
 * Class Status holds the current status of the GameRound
 * logic
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 *
 */
public class StatusController {

	/*
	 * ENUMERATIONS
	 * ************
	 */
	
	// the different states
	public enum Mode{ 
		
		// enumerations
		WAIT			( new Status_Wait() ),
		SHOW_RANGE		( new Status_ShowRange() ),
		SHOW_MOVE		( new Status_ShowMove() ),
		MENU			( new Status_Menu() );
		
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
	 * VARIABLES
	 * *********
	 */
	
	private static Mode status;

	
	
	/*
	 * ACCESS METHODS
	 * ************** 
	 */
	
	/**
	 * Returns the current status.
	 */
	public static Mode getStatus(){
		return status;
	}
	
	/**
	 * Sets a new status for update logic
	 */
	public static void setStatus( Mode status ){
		
		// CHECK STATUS
		if( status == null || status.getObject() == null ){
			Logger.warn("The given status is not correct!");
			return;
		}
		
		StatusController.status = status;
	}

	
	
	/*
	 * WORK METHODS
	 * ************
	 */

	/**
	 * Update logic for a given status.
	 */
	public static void update(int timePassed , MapDraw map ){

		// do update method
		status.getObject().update(timePassed , map );
	}

}

