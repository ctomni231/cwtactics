package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;

public class PayRessuplyCost extends PayRepairCost implements Command {

	public PayRessuplyCost(int[] cost, Unit unit) {
		super(cost, unit);
	}

	
	
	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
  
	public String toString(){
		return "PAYRESUPPLY-";
	}
}

