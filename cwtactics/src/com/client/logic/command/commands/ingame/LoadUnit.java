package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;

public class LoadUnit implements Command {

	/*
	 * VARIABLES
	 * *********
	 */

	private Unit apc;
	private Unit load;
	private boolean loading;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public LoadUnit( Unit apc , Unit load , boolean loading ){
		this.apc = apc;
		this.load = load;
		this.loading = loading;
	}

	
	
	/*
	 * WORK METHODS
	 * ************ 
	 */

	public void doCommand(){
		
		if( loading ) 	apc.addLoad( load );
		else 			apc.removeLoad(load);
	}
}

