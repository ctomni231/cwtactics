package com.client.model;

import com.client.logic.command.CommandFactory;
import com.client.logic.command.MessageServer;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.script.ScriptFactory;
import com.system.data.script.Trigger_Object;
import com.system.data.script.ScriptLogic;
import com.system.data.sheets.Weapon_Sheed;
import com.system.log.Logger;

/**
 * Controls a battle between two units.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Fight {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private static Weapon_Sheed attackWeapon;
	private static Weapon_Sheed defenderWeapon;
	private static Tile attackerTile;
	private static Tile defenderTile;
	private static Unit attacker;
	private static Unit defender;
	private static int penalty;

	
	
	/*
	 * ACCESSING METHODS
	 * *****************
	 */
	
	/**
	 * Returns the attacking unit.
	 */
	public static Unit getAttacker(){
		return attacker;
	}
	
	/**
	 * Returns the defending unit.
	 */
	public static Unit getDefender(){
		return defender;
	}
	
	

	/*
	 * WORK METHODS
	 * ************ 
	 */
	
	/**
	 * Setup a battle.
	 */
	public static void battle( Tile attackerTile , Unit attacker , Weapon_Sheed attackerWeapon , Tile defenderTile , Unit defender ){
		
		// VARIABLES
		Fight.attackerTile = attackerTile;
		Fight.defenderTile = defenderTile;
		Fight.attacker = attacker;
		Fight.defender = defender;
		Fight.attackWeapon = attackerWeapon;
		Fight.defenderWeapon = getConterWeapon();

		// CHECK EFFECTS, ATTACKER
		penalty = 0;
		attackerEffects();
		int attack = penalty * attacker.getHealth() / 100;
		
		// EXCHANGE ATTACKER AND DEFENDER
		Fight.attackerTile = defenderTile;
		Fight.defenderTile = attackerTile;
		Fight.attacker = defender;
		Fight.defender = attacker;
		
		// CHECK EFFECTS, DEFENDER
		penalty = 0;
		defenderEffects();
		int counter = penalty * defender.getHealth() / 100;

		// SEND COMMANDS
		MessageServer.send( CommandFactory.unitAttack( attacker, defender ,attack , attackerWeapon ) );
		if( defenderWeapon != null ) MessageServer.send( CommandFactory.unitAttack( defender, attacker ,counter , defenderWeapon ) );
	}
	
	/**
	 * Check all effects for this fighting 
	 * situation.
	 */
	private static void defenderEffects(){
		
		Trigger_Object.triggerCall( defenderTile , defender );
		ScriptFactory.checkAll( ScriptLogic.Trigger.UNIT_ATTACK);
		ScriptFactory.checkAll( ScriptLogic.Trigger.UNIT_COUNTERATTACK);
		Trigger_Object.triggerCall( attackerTile , attacker );
		ScriptFactory.checkAll( ScriptLogic.Trigger.UNIT_DEFEND);
	}
	
	/**
	 * Check all effects for this fighting 
	 * situation.
	 */
	private static void attackerEffects(){
		
		Trigger_Object.triggerCall( attackerTile , attacker );
		ScriptFactory.checkAll( ScriptLogic.Trigger.UNIT_ATTACK);
		Trigger_Object.triggerCall( defenderTile , defender );
		ScriptFactory.checkAll( ScriptLogic.Trigger.UNIT_DEFEND);
	}

	/**
	 * Returns a weapon with that the defender can 
	 * counter the attacker.
	 */
	public static Weapon_Sheed getConterWeapon( ){
		
		// check status of fight, return if no fight exist
		if( !checkStatus() ){
			Logger.warn("No fight exist, but logic wants to get a conter weapon for a fight.");
			return null;
		}
		
		// if attacked by indirect unit, don't counter
		if( attackWeapon.getFireMode() > 0 ) return null;
		
		// check every weapon
		for( Weapon_Sheed defenseWeapon : defender.sheet().getAllWeapons() ){
			
			// counter only possible if weapon is direct, can attack attacker and if you have enough ammo
			if( ( defenseWeapon.getFireMode() == 0 || defenseWeapon.getFireMode() == 3 ) && defenseWeapon.canAttack( attacker.sheet() ) && defender.getAmmo() - defenseWeapon.getUseAmmo() >= 0 ) return defenseWeapon;
		}
		
		return null;
	}
	
	/**
	 * Resets the status of the fight to null.
	 */
	public static void resetStatus(){
		
		attacker = null;
		defender = null;
		attackWeapon = null;
		defenderWeapon = null;
		attackerTile = null;
		defenderTile = null;
	}
	
	/**
	 * Is the fight correctly set up?
	 */
	public static boolean checkStatus(){
		
		if( attacker == null || defender == null || attackerTile == null || defenderTile == null || attackWeapon == null ) return false;
		else return true;
	}
	
	/**
	 * Change the attacker damage 
	 */
	public static void changeAttackValue( int value ){
		penalty += value;
	}
	
	public static Weapon_Sheed getAttackerWeapon(){
		return attackWeapon;
	}
	
	public static Weapon_Sheed getDefenderWeapon(){
		return defenderWeapon;
	}
	
	
	
	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

}

