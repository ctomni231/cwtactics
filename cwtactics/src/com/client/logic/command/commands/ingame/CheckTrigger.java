package com.client.logic.command.commands.ingame;

import com.client.model.object.Tile;
import com.system.ID.Trigger;
import com.system.data.script.ScriptFactory;
import com.system.data.script.Trigger_Object;

public class CheckTrigger {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private Trigger trigger;
	private Tile tile1;
	private Tile tile2;

	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public CheckTrigger( Tile t1 , Tile t2 , Trigger trigg ){
		
		trigger = trigg;
		tile1 = t1;
		tile2 = t2;
	}

	
	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	public void doCommand(){
		
		// set tile1 and tile2 to the trigger call object
		Trigger_Object.triggerCall(tile1, tile2);
		
		// check all scripts for a trigger
		ScriptFactory.checkAll(trigger);
	}
	
	
	/*
	 * CHECK TRIGGER COMMANDS WILL NOT SENDED OVER NETWORK
	 */
	
}

