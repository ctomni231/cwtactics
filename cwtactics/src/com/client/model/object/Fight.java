package com.client.model.object;

import com.client.logic.command.CommandList;
import com.system.ID;
import com.system.data.script.ScriptFactory;
import com.system.data.script.Trigger_Object;
import com.system.data.sheets.Weapon_Sheed;

public class Fight {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private static Weapon_Sheed attackWeapon;
	private static Weapon_Sheed defenderWeapon;
	private static Tile attackerTile;
	private static Tile defenderTile;
	private static Unit attacker;
	private static Unit defender;
	private static int attackerPenalty;
	private static int defenderPenalty;

	

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	/**
	 * Setup a battle.
	 */
	public static void setupBattle( Tile attackerTile , Unit attacker , Weapon_Sheed attackerWeapon , Tile defenderTile , Unit defender ){
		
		Fight.attackerTile = attackerTile;
		Fight.defenderTile = defenderTile;
		Fight.attacker = attacker;
		Fight.defender = defender;
		Fight.attackWeapon = attackerWeapon;
		Fight.defenderWeapon = getConterWeapon();
		
		attackerPenalty = 0;
		defenderPenalty = 0;
	}
	
	/**
	 * Check all effects for this fighting 
	 * situation.
	 */
	public static void checkEffects(){
		
		// check status of fight, return if no fight exist
		if( !checkStatus() ){
			System.err.println("No fight exist, but logic wants to check effects for a fight.");
			return;
		}
		
		// check effects for the attacker
		Trigger_Object.triggerCall(attackerTile,defenderTile);
		ScriptFactory.checkAll( ID.Trigger.UNIT_ATTACK );
		
		// check effects for the defender
		Trigger_Object.triggerCall(defenderTile,attackerTile);
		ScriptFactory.checkAll( ID.Trigger.UNIT_DEFEND );
	}
	
	/**
	 * Starts the battle and inflicts damage to the to 
	 * members of the battle.
	 */
	public static void processBattle(){
		
		// check status of fight, return if no fight exist
		if( !checkStatus() ){
			System.err.println("No fight exist, but logic wants to start the a fight.");
			return;
		}
		
		// get damage variables
		int attack = attackWeapon.getDamage(defender.sheet()) + attackerPenalty;
		int counter;
		if( defenderWeapon != null ) counter = defenderWeapon.getDamage(attacker.sheet()) + defenderPenalty;
		else counter = 0;
		
		// set the damage on defender
		if( attack > 0 ) CommandList.addToEndPosition( null );
		
		// only counter if the defender alive damage from attacker
		if( counter > 0 && defender.getHealth() - attack > 0 ) CommandList.addToEndPosition( null );
	}

	/**
	 * Returns a weapon with that the defender can 
	 * counter the attacker.
	 */
	public static Weapon_Sheed getConterWeapon( ){
		
		// check status of fight, return if no fight exist
		if( !checkStatus() ){
			System.err.println("No fight exist, but logic wants to get a conter weapon for a fight.");
			return null;
		}
		
		// if attacked by indirect unit, don't counter
		if( attackWeapon.getFireMode() > 0 ) return null;
		
		// check every weapon
		for( Weapon_Sheed defenseWeapon : defender.sheet().getAllWeapons() ){
			
			// counter only possible if weapon is direct, can attack attacker and if you have enough ammo
			if( defenseWeapon.getFireMode() == 0 && defenseWeapon.getDamage( attacker.sheet() ) > 0 && defender.getAmmo() - defenseWeapon.getUseAmmo() >= 0 ) return defenseWeapon;
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
	private static boolean checkStatus(){
		
		if( attacker == null || defender == null || attackerTile == null || defenderTile == null || attackWeapon == null ) return false;
		else return true;
	}
	
	/**
	 * Change the attacker damage 
	 */
	public static void changeAttackerPenalty( int value ){
		attackerPenalty += value;
	}
	
	/**
	 * Change the defender counter damage
	 */
	public static void changeDefenderPenalty( int value ){
		defenderPenalty += value;
	}
	
	
	
	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

}

