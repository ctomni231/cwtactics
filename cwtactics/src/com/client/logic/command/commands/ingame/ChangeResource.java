package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Player;
import com.system.data.Data;
import com.system.log.Logger;

/**
 * Command to change the resources of 
 * a player by a given array of cost/funds.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class ChangeResource implements Command {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private int[] values;
	private Player player;
	
	// if -1 , the values will be handled as expenses
	// if 1  , it will be handled as income
	private int multi;			
	


	/*
	 * CONSTRUCTORS
	 * ************
	 */

	public ChangeResource( int[] values , Player player , boolean pay ) {
		this.values = values;
		this.player = player;
		if( pay ) this.multi = -1;
		else this.multi = 1;
	}
	
	public ChangeResource( int[] values , Player player ) {
		this(values,player,false);
	}
	


	/*
	 * WORK METHODS
	 * ************
	 */

	public void doCommand(){
		
		for( int i = 0; i < values.length ; i++ ){
			
			// pay every cost from players resource pool
			player.changeResource(i, multi * values[i]);
			
			Logger.log( "Player "+player.getName()+" got "+(multi * values[i])+" of "+Data.getRessourceTable().get(i).getName() );
		}
	}

}

