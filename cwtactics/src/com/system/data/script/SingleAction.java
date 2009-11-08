package com.system.data.script;

import com.client.logic.command.CommandList;
import com.client.logic.command.commands.ingame.DecreaseFuel;
import com.client.logic.command.commands.ingame.GiveFunds;
import com.client.logic.command.commands.ingame.PayRepairCost;
import com.client.logic.command.commands.ingame.RepairUnit;
import com.client.logic.command.commands.ingame.ResupplyUnit;
import com.client.logic.command.commands.ingame.SetDamage;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.ID;
import com.system.ID.TriggerAction;
import com.system.ID.TriggerAction_Obj;



public class SingleAction {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private ID.TriggerAction		action;
	private ID.TriggerAction_Obj 	obj;
	private int value;
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public SingleAction( TriggerAction action, TriggerAction_Obj obj , int value ) {
		
		this.action = action;
		this.obj 	= obj;
		this.value 	= value;
	}
	

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	public void doAction(){
		
		Unit unit 		= Trigger_Object.getUnit1();
		Unit unit2 		= Trigger_Object.getUnit2();
		Tile field 		= Trigger_Object.getField1();
		Tile field2 	= Trigger_Object.getField2();
		
		switch( action ){
		
			// Destroy the unit which are involved by the trigger 
			case DESTROY_UNIT :
				switch( obj ){
					case UNIT :
						CommandList.addToFirstPosition( new SetDamage( unit , unit.getHealth() )  );
						break;
					case ENEMY_UNIT :
						CommandList.addToFirstPosition( new SetDamage( unit2 , unit2.getHealth() )  );
						break;
				}
				break;
				
			// Property gives funds
			case GIVE_FUNDS :
				switch( obj ){
					case FIELD :
						CommandList.addToFirstPosition( new GiveFunds( field.sheet().getFundsTable() , field ) );
						break;
					case ENEMY_FIELD :
						CommandList.addToFirstPosition( new GiveFunds( field2.sheet().getFundsTable() , field2 ) );
						break;
				}
				break;
			
			// Field supplies an unit
			case RESUPPLY_UNIT :
				switch( obj ){
					case UNIT :
						CommandList.addToFirstPosition( new ResupplyUnit() );
						break;
				}
				break;
			
			// Field heals an unit
			case PAY_REPAIR :
			switch( obj ){
				case UNIT :
					CommandList.addToFirstPosition( new PayRepairCost( field.sheet().getRepairCost( unit.sheet() , 20 )  , unit ) );
					break;
			}
			break;
		
			// Field heals an unit
			case HEAL_UNIT :
				switch( obj ){
					case UNIT :
						CommandList.addToFirstPosition( new RepairUnit( unit , 20 ) );
						break;
				}
				break;
				
				
			// Field heals an unit
			case DECREASE_FUEL :
				switch( obj ){
					case UNIT :
						CommandList.addToFirstPosition( new DecreaseFuel( unit , 1) );
						break;
				}
				break;
					
			default:
				System.err.println("Wrong Trigger action given , the id "+action+" is unknown..");
				break;
		}
	}

	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */

	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

}

