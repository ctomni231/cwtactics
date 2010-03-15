package com.client.model;

import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.DynamicMemory;
import com.system.data.sheets.Weapon_Sheed;
import com.system.log.Logger;
import com.system.network.MessageServer;
import com.system.network.coder.MessageEncoder;
import com.system.meowShell.Script_Database;

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
		MessageServer.send("unitAttack="+MessageEncoder.encode(attacker)+","+MessageEncoder.encode(defender)+","+MessageEncoder.encode(attackerWeapon)+","+MessageEncoder.encode(attack));
		if( defenderWeapon != null && defender.getHealth() - attack > 0 ){
			MessageServer.send("unitAttack="+MessageEncoder.encode(defender)+","+MessageEncoder.encode(attacker)+","+MessageEncoder.encode(defenderWeapon)+","+MessageEncoder.encode(counter));
		}
	}
	
	/**
	 * Check all effects for this fighting 
	 * situation.
	 */
	private static void defenderEffects(){

		DynamicMemory.setTile(defenderTile);
		DynamicMemory.setUnit(defender);
		Script_Database.checkAll("UNIT_ATTACK");
		Script_Database.checkAll("UNIT_COUNTERATTACK");
		DynamicMemory.setTile(attackerTile);
		DynamicMemory.setUnit(attacker);
		Script_Database.checkAll("UNIT_DEFEND");
		DynamicMemory.reset();
	}
	
	/**
	 * Check all effects for this fighting 
	 * situation.
	 */
	private static void attackerEffects(){
		
		DynamicMemory.setTile(attackerTile);
		DynamicMemory.setUnit(attacker);
		Script_Database.checkAll("UNIT_ATTACK");
		DynamicMemory.setTile(defenderTile);
		DynamicMemory.setUnit(defender);
		Script_Database.checkAll("UNIT_DEFEND");
		DynamicMemory.reset();
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

