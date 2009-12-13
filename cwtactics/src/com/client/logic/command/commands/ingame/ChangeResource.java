package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Player;
import com.client.model.object.Tile;


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

	public ChangeResource( int[] values , Tile property , boolean pay ) {
		this.values = values;
		this.player = property.getOwner();
		if( pay ) this.multi = -1;
		else this.multi = 1;
	}
	
	public ChangeResource( int[] values , Tile property ) {
		this(values,property,false);
	}
	


	/*
	 * WORK METHODS
	 * ************
	 */

	public void doCommand(){
		
		for( int i = 0; i < values.length ; i++ ){
			
			// pay every cost from players resource pool
			player.changeResource(i, multi * values[i]);
		}
	}

	
	
	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
 
	public String toString(){
		return "GIVEFUNDS-";
	}
}

