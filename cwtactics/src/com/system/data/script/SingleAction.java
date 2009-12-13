package com.system.data.script;

import com.client.model.Fight;
import com.client.model.Fog;
import com.client.model.Move;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.script.ScriptLogic.TriggerAction;
import com.system.data.script.ScriptLogic.TriggerAction_Obj;

public class SingleAction {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private TriggerAction		action;
	private TriggerAction_Obj 	obj;
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
		
		Unit unit;
		Tile field;
		
		if( obj == TriggerAction_Obj.UNIT || obj == TriggerAction_Obj.UNIT2){
			unit = Trigger_Object.getUnit1();
			field = Trigger_Object.getField1();
		}
		else{
			unit = Trigger_Object.getUnit2();
			field = Trigger_Object.getField2();
		}			
			
			
		switch( action ){
		
			// Destroy the unit which are involved by the trigger 
			case DESTROY_UNIT :
				//TODO add script effect
				break;
				
			// Property gives funds
			case GIVE_FUNDS :
				//TODO add script effect
				break;
			
			// Field supplies an unit
			case RESUPPLY_UNIT :
				//TODO add script effect
				break;
			
			// Field heals an unit
			case PAY_REPAIR :
				//TODO add script effect
				break;
		
			// Field heals an unit
			case HEAL_UNIT :
				//TODO add script effect
				break;
				
			// Field heals an unit
			case DECREASE_FUEL :
				//TODO add script effect
				break;
				
			case INCREASE_ATTACK :
				if( field == Trigger_Object.getField1() ) Fight.changeAttackerPenalty(value);
				else Fight.changeDefenderPenalty(value);
				break;
				
			case DECREASE_ATTACK :
				if( field == Trigger_Object.getField1() ) Fight.changeAttackerPenalty(-value);
				else Fight.changeDefenderPenalty(-value);
				break;
				
			case INCREASE_DEFENSE :
				if( field == Trigger_Object.getField1() ) Fight.changeDefenderPenalty(-value);
				else Fight.changeAttackerPenalty(-value);
				break;
				
			case DECREASE_DEFENSE :
				if( field == Trigger_Object.getField1() ) Fight.changeDefenderPenalty(value);
				else Fight.changeAttackerPenalty(value);
				break;
				
			case INCREASE_ATTACK_BY_RANDOM :
				value = ((int) Math.random() * value );
				if( value == 0 ) return;
				if( field == Trigger_Object.getField1() ) Fight.changeAttackerPenalty(value);
				else Fight.changeDefenderPenalty(value);
				break;
				
			case DECREASE_ATTACK_BY_RANDOM :
				value = ((int) Math.random() * value );
				if( value == 0 ) return;
				if( field == Trigger_Object.getField1() ) Fight.changeAttackerPenalty(-value);
				else Fight.changeDefenderPenalty(-value);
				break;
				
			case INCREASE_DEFENSE_BY_RANDOM :
				value = ((int) Math.random() * value );
				if( value == 0 ) return;
				if( field == Trigger_Object.getField1() ) Fight.changeDefenderPenalty(-value);
				else Fight.changeAttackerPenalty(-value);
				break;
				
			case DECREASE_DEFENSE_BY_RANDOM :
				value = ((int) Math.random() * value );
				if( value == 0 ) return;
				if( field == Trigger_Object.getField1() ) Fight.changeDefenderPenalty(value);
				else Fight.changeAttackerPenalty(value);
				break;
				
			case INCREASE_SIGHT :
				Fog.changeSightAddon(value);
				break;
				
			case DECREASE_SIGHT :
				Fog.changeSightAddon(-value);
				break;
				
			case SET_SIGHT :
				Fog.setSightAddon(value);
				break;
				
			case INCREASE_MOVEPOINTS :
				Move.changeMovePoints(value);
				break;
				
			case DECREASE_MOVEPOINTS :
				Move.changeMovePoints(-value);
				break;
				
			case INCREASE_MOVECOST :
				Move.changeCost(value);
				break;
				
			case DECREASE_MOVECOST :
				Move.changeCost(-value);
				break;
				
			case SET_MOVECOST :
				Move.setCost(value);
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
	
	public String toString(){
		return " SA:: OBJECT:"+obj+" - ACTION:"+action+" VALUE:"+value;
	}

}

