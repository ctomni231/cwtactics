package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.logic.command.MessageServer;
import com.client.model.object.Player;
import com.client.model.object.Tile;
import com.client.model.object.Unit;

public class TryRepair implements Command {

	private Tile tile;
	private int amount;
	
	public TryRepair( Tile tile , int amount ){
		this.tile = tile;
		this.amount = amount;
	}
	
	public void doCommand() {
		
		// variables
		Unit unit = tile.getUnit();
		Player player = unit.getOwner();
		int[] cost = tile.sheet().getRepairCost( unit.sheet() , amount );
		
		// can player pay this amount of money ?
		for( int i = 0 ; i < cost.length ; i++ ){
			
			// if you can't pay that resource, skip repair
			if( player.getResourceValue(i) - cost[i] < 0 ) return; 
		}
		
		// increase health and decrease resources of player
		MessageServer.sendLocalToFirstPos( new RepairUnit(unit, amount) );
		MessageServer.sendLocalToFirstPos( new ChangeResource(cost, tile, true) );
	}

}

