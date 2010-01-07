package com.system.data.script;

import com.client.logic.command.MessageServer;
import com.client.logic.command.commands.ingame.ChangeResource;
import com.client.logic.command.commands.ingame.ResupplyUnit;
import com.client.logic.command.commands.ingame.SetDamage;
import com.client.logic.command.commands.ingame.TryRepair;
import com.client.model.Fight;
import com.client.model.Fog;
import com.system.data.script.ScriptLogic.ScriptKey;
import com.system.log.Logger;
import com.system.log.Logger.Level;

public class SingleAction {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private ScriptKey	action;
	private ScriptKey	obj;
	private int value;
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public SingleAction( ScriptKey obj , ScriptKey action, int value ) {
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
			
		switch( action ){
		
			case DESTROY :
				if( Trigger_Object.getUnit1() == null || obj != ScriptKey.UNIT ) break;
				MessageServer.send( new SetDamage( Trigger_Object.getUnit1() , 100 ));
				break;
				
			case SUPPLY :
				if( Trigger_Object.getUnit1() == null || obj != ScriptKey.UNIT ) break;
				//TODO fix command
				MessageServer.send( new ResupplyUnit() );
				break;
				
			case HEAL :
				if( Trigger_Object.getField1() == null || Trigger_Object.getUnit1() == null || obj != ScriptKey.UNIT ) break;
				MessageServer.send( new TryRepair( Trigger_Object.getField1() , value ));
				break;
				
			case GIVE_FUNDS :
				if( Trigger_Object.getField1() == null || obj != ScriptKey.TILE ) break;
				MessageServer.send( new ChangeResource( Trigger_Object.getField1().sheet().getFundsTable() , Trigger_Object.getField1().getOwner() , true ));
				break;
				
				//TODO MOVE MODEL
				
			case INCREASE_BY :
				switch(obj){
				
					case ATTACK :
						if( !Fight.checkStatus() ) break;
						Fight.changeAttackValue(value);
						break;
						
					// INCREASE DEFENSE IS DECREASING ATTACK POWER
					case DEFENSE :
						if( !Fight.checkStatus() ) break;
						Fight.changeAttackValue(-value);
						break;
						
					case FOG :
						Fog.changeSightAddon(value);
						break;
				}
				break;
				
			case INCREASE_BY_RANDOM :
				switch(obj){
				
					case ATTACK :
						if( !Fight.checkStatus() ) break;
						Fight.changeAttackValue((int) ( Math.random() * value ));
						break;
						
					// INCREASE DEFENSE IS DECREASING ATTACK POWER
					case DEFENSE :
						if( !Fight.checkStatus() ) break;
						Fight.changeAttackValue(-((int) ( Math.random() * value )));
						break;
						
					case FOG :
						Fog.changeSightAddon( (int) ( Math.random() * value ) );
						break;
				}
				break;
				
			case DECREASE_BY :
				switch(obj){
				
					case ATTACK :
						if( !Fight.checkStatus() ) break;
						Fight.changeAttackValue(-value);
						break;
						
					// INCREASE DEFENSE IS DECREASING ATTACK POWER
					case DEFENSE :
						if( !Fight.checkStatus() ) break;
						Fight.changeAttackValue(value);
						break;
						
					case FOG :
						Fog.changeSightAddon(-value);
						break;
				}
				break;
				
			case DECREASE_BY_RANDOM :
				switch(obj){
				
					case ATTACK :
						if( !Fight.checkStatus() ) break;
						Fight.changeAttackValue(-((int) ( Math.random() * value )));
						break;
						
					// INCREASE DEFENSE IS DECREASING ATTACK POWER
					case DEFENSE :
						if( !Fight.checkStatus() ) break;
						Fight.changeAttackValue( (int) ( Math.random() * value ));
						break;
						
					case FOG :
						Fog.changeSightAddon( -((int) ( Math.random() * value )) );
						break;
				}
				break;
				
			case SET_TO :
				switch(obj){
				
					case FOG :
						Fog.setSightAddon(value);
						break;
				}
				break;
				
			case SET_TO_RANDOM :
				switch(obj){
				
					case FOG :
						Fog.setSightAddon( ((int) Math.random() * value) );
						break;
				}
				break;
		
			default:
				Logger.write("Wrong action ==> "+obj.toString()+" "+action.toString()+" "+value+" is unknown.." , Level.WARN );
				break;
		}
	}

}

