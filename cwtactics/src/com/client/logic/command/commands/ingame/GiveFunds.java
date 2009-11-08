package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Tile;


public class GiveFunds extends PayRepairCost implements Command {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	


	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */

	public GiveFunds( int[] cost , Tile property ) {
		super(cost, property.getOwner() );
	}
	


	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */

	public void doCommand(){
		
		for( int i = 0; i < cost.length ; i++ ){
			
			// pay every cost from players resource pool
			player.changeResource(i, +cost[i]);
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

