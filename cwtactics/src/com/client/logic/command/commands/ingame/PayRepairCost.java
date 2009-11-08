package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Player;
import com.client.model.object.Unit;

public class PayRepairCost implements Command {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	protected int[] cost;
	protected Player player;
	
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public PayRepairCost( int[] cost , Unit unit ){
		this( cost , unit.getOwner() );
	}
	
	public PayRepairCost( int[] cost , Player player ){
		this.cost = cost;
		this.player = player;
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
			player.changeResource(i, -cost[i]);
		}
	}
	
	
	
	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
 
	public String toString(){
		return "PAYREPAIR-";
	}
}

