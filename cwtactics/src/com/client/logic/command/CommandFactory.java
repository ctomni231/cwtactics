package com.client.logic.command;

import com.client.logic.command.Command.Commands;
import com.client.model.object.*;
import com.system.data.sheets.*;
import com.system.log.Logger;

/**
 * Factory class that handles all possible 
 * commands, creates them and convert it 
 * also into a format, that is possible to 
 * send over network.
 * 
 * @author tapsi
 * @version 16.1.10, #1
 */
public class CommandFactory {

	
	/*
	 * BUILD METHODS
	 * *************
	 */

	public static String buildUnit( Tile tile , Unit_Sheed sheet , Player player ){
		return Commands.BUILD_UNIT.toString()+":"+tile.getPosX()+","+tile.getPosY()+","+sheet.getID()+","+player.getID();
	}
	
	public static String captureBuilding( Tile tile , Unit unit ){
		return Commands.CAPTURE_BUILDING.toString()+":"+tile.getPosX()+","+tile.getPosY()+","+unit.getID();
	}
	
	public static String changeResource( boolean pay , Player player , int[] values ){
		String str = Commands.CHANGE_RESOURCE.toString()+":";
		if( pay ) str = str + "1";
		else str = str + "0";
		str = str + "," + player.getID();
		for( int value : values ){
			str = str + "," + value; 
		}
		return str;
	}
	
	public static String changeWeather( Weather_Sheet sheet , int days ){
		return Commands.CHANGE_WEATHER.toString()+":"+sheet.getID()+","+days;
	}
	
	public static String decreaseAmmo( Unit unit , Weapon_Sheed sheet ){
		return Commands.DECREASE_AMMO.toString()+":"+unit.getID()+","+sheet.getID();
	}
	
	public static String decreaseFuel( Unit unit , int amount ){
		return Commands.DECREASE_FUEL.toString()+":"+unit.getID()+","+amount;
	}
	
	public static String defeatPlayer( Player player ){
		return Commands.DEFEAT_PLAYER.toString()+":"+player.getID();
	}
	
	public static String tileSetUnit( Tile tile , Unit unit ){
		String str = Commands.TILE_SET_UNIT.toString()+":"+tile.getPosX()+","+tile.getPosY();
		if( unit != null ) str += ","+unit.getID();
		return str;
	}
	
	public static String hideUnit( Unit unit , boolean hide ){
		String str = Commands.HIDE_UNIT.toString()+":"+unit.getID();
		if( hide ) str += ",1";
		else str += ",0";
		return str;
	}
	
	public static String loadUnit( Unit apc , Unit load , boolean loading ){
		String str = Commands.LOAD_UNIT.toString()+":"+apc.getID()+","+load.getID();
		if( loading ) str += ",1";
		else str += ",0";
		return str;
	}
	
	public static String processFog(){
		return Commands.PROCESS_FOG.toString()+":";
	}
	
	public static String repairUnit( Unit unit , int amount ){
		return Commands.REPAIR_UNIT.toString()+":"+unit.getID()+","+amount;
	}
	
	// TODO 
	public static String resupplyUnit( Unit unit ){
		return Commands.RESUPPLY_UNIT.toString()+":";
	}
	
	public static String setDamage( Unit unit , int amount ){
		return Commands.SET_DAMAGE.toString()+":"+unit.getID()+","+amount;
	}
	
	public static String startMoveAnimation(){
		return Commands.START_MOVE_ANIMATION.toString()+":";
	}
	
	public static String waitAnimation(  ){
		return Commands.WAIT_ANIMATION.toString()+":";
	}
	
	public static String tryRepair( Tile tile , Unit unit , int amount ){
		return Commands.TRY_REPAIR.toString()+":"+tile.getPosX()+","+tile.getPosY()+","+unit.getID()+","+amount;
	}
	
	public static String turnEnd(){
		return Commands.TURN_END.toString()+":";
	}
	
	public static String unitAttack( Unit attacker , Unit defender , int damage , Weapon_Sheed weapon ){
		return Commands.UNIT_ATTACK.toString()+":"+attacker.getID()+","+defender.getID()+","+weapon.getID()+","+damage;
	}
	
	public static String unitCanAct( Unit unit , boolean canAct ){
		String str = Commands.UNIT_CAN_ACT.toString()+":"+unit.getID();
		if( canAct ) str += ",1";
		else str += ",0";
		return str;
	}

	
	
	/*
	 * NETWORK METHODS
	 * ***************
	 */
	
	public static void doCommand( String string ){
		
		// get variables
		int pos = string.indexOf(":");
		if( pos == -1 ) Logger.critical("Can't decode string '"+string+"' , it has not a correct syntax");
		String command = string.substring( 0, pos );  
		String values = string.substring( pos+1 );
		
		// find the correct command
		for( Command.Commands cmd : Command.Commands.values() ){
			if( command.equals(cmd.toString()) ){ cmd.doCommand(values.split(",")); return; }
		}
		
		// error state, but not critical
		Logger.warn("Unknown command id ==> "+command );
	}
	
}
