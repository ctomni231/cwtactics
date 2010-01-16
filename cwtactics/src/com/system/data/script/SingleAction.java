package com.system.data.script;

import com.client.logic.command.CommandFactory;
import com.client.logic.command.MessageServer;
import com.client.model.Fight;
import com.client.model.Fog;
import com.client.model.object.Player;
import com.system.data.script.ScriptLogic.ScriptKey;
import com.system.log.Logger;

/**
 * Action class.
 *  
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class SingleAction {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private ScriptKey	action;
	private ScriptKey	obj;
	private int value;
	
	

	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public SingleAction( ScriptKey obj , ScriptKey action, int value ) {
		this.action = action;
		this.obj 	= obj;
		this.value 	= value;
	}
	


	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doAction(){
			
		switch( action ){
		
			case DESTROY :
				if( Trigger_Object.getUnit() == null || obj != ScriptKey.UNIT ) break;
				MessageServer.send( CommandFactory.setDamage( Trigger_Object.getUnit() , 99 ));
				break;
				
			case SUPPLY :
				if( Trigger_Object.getUnit() == null || obj != ScriptKey.UNIT ) break;
				//TODO fix command
				MessageServer.send( null );
				break;
				
			case HEAL :
				if( Trigger_Object.getTile() == null || Trigger_Object.getUnit() == null || obj != ScriptKey.UNIT ) break;
				MessageServer.send( CommandFactory.tryRepair( Trigger_Object.getTile() , Trigger_Object.getUnit() , value ));
				break;
				
			case GIVE_FUNDS :
				if( Trigger_Object.getTile() == null || obj != ScriptKey.TILE ) break;
				MessageServer.send( CommandFactory.changeResource( false , Trigger_Object.getTile().getOwner() , Trigger_Object.getTile().sheet().getFundsTable() ));
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
						Fog.changeSight(value);
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
						Fog.changeSight( (int) ( Math.random() * value ) );
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
						Fog.changeSight(-value);
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
						Fog.changeSight( -((int) ( Math.random() * value )) );
						break;
				}
				break;
				
			case SET_TO :
				switch(obj){
				
					case FOG :
						Fog.setSight(value);
						break;
				}
				break;
				
			case SET_TO_RANDOM :
				switch(obj){
				
					case FOG :
						Fog.setSight( ((int) Math.random() * value) );
						break;
				}
				break;
				
			case DEFEAT_OWNER :
				if( Trigger_Object.getTile() != null ){
					MessageServer.send( CommandFactory.defeatPlayer( Trigger_Object.getTile().getOwner() ));
				}
				break;
		
			default:
				Logger.warn("Wrong action ==> "+obj.toString()+" "+action.toString()+" "+value+" is unknown.." );
				break;
		}
	}

}

