package com.client.model;

import com.client.logic.command.MessageServer;
import com.client.logic.command.commands.ingame.Battle;
import com.client.logic.command.commands.ingame.DecreaseAmmo;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.script.ScriptFactory;
import com.system.data.script.Trigger_Object;
import com.system.data.script.ScriptLogic;
import com.system.data.sheets.Weapon_Sheed;

/**
 * 
 * @author Tapsi [BcMk]
 */
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
	private static void checkEffects(){
		
		// check effects for the attacker ( local )
		Trigger_Object.triggerCall( attackerTile , defenderTile , attacker , defender );
		ScriptFactory.checkAll( ScriptLogic.Trigger.UNIT_ATTACK);
		
	}
	
	/**
	 * Starts the battle and inflicts damage to the to 
	 * members of the battle.
	 */
	public static void processBattle(){
		
		//TODO little bit refactoring
		
		// check status of fight, return if no fight exist
		if( !checkStatus() ){
			System.err.println("No fight exist, but logic wants to start the a fight.");
			return;
		}

		// check effects 
		checkEffects();
		
		// get damage variables
		int attack = getAttackDamage();
		int counter = getDefenderDamage();
		
		// send command
		MessageServer.send( new Battle( attackerTile, defenderTile ,attack ,counter ) );
		MessageServer.send( new DecreaseAmmo(attacker, attackWeapon) );
		if( defenderWeapon != null ) MessageServer.send( new DecreaseAmmo(defender, defenderWeapon) );
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

	/**
	 * Returns attacker damage.
	 */
	public static int getAttackDamage(){
		 // you get all data from scripts, return script value
		 return attackerPenalty;
	}

	/**
	 * Returns counter damage from defender.
	 */
	public static int getDefenderDamage(){
		// you get all data from scripts, return script value
		if( defenderWeapon != null ) return defenderPenalty;
		return 0;
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

