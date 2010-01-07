package com.client.model;

import com.client.logic.command.MessageServer;
import com.client.logic.command.commands.ingame.BattleDamage;
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
	private static int penalty;

	
	
	/*
	 * ACCESSING METHODS
	 * *****************
	 */
	
	public static Unit getAttacker(){
		return attacker;
	}
	
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
		
		// prepare battle
		Fight.attackerTile = attackerTile;
		Fight.defenderTile = defenderTile;
		Fight.attacker = attacker;
		Fight.defender = defender;
		Fight.attackWeapon = attackerWeapon;
		Fight.defenderWeapon = getConterWeapon();

		// check effects attacker
		penalty = 0;
		attackerEffects();
		int attack = penalty;
		
		// check effects defender
		penalty = 0;
		defenderEffects();
		int counter = penalty;

		// send command
		if( attack <= 0 ) attack = 0;
		if( counter <= 0 ) counter = 0;
		MessageServer.send( new BattleDamage( attackerTile, defenderTile ,attack ,counter ) );
		MessageServer.send( new DecreaseAmmo(attacker, attackWeapon) );
		if( defenderWeapon != null ) MessageServer.send( new DecreaseAmmo(defender, defenderWeapon) );
	}
	
	/**
	 * Check all effects for this fighting 
	 * situation.
	 */
	private static void defenderEffects(){
		
		Trigger_Object.triggerCall( defenderTile , attackerTile , defender , attacker );
		ScriptFactory.checkAll( ScriptLogic.Trigger.UNIT_ATTACK);
		ScriptFactory.checkAll( ScriptLogic.Trigger.UNIT_COUNTERATTACK);
		Trigger_Object.triggerCall( attackerTile , defenderTile , attacker , defender );
		ScriptFactory.checkAll( ScriptLogic.Trigger.UNIT_DEFEND);
	}
	
	/**
	 * Check all effects for this fighting 
	 * situation.
	 */
	private static void attackerEffects(){
		
		Trigger_Object.triggerCall( attackerTile , defenderTile , attacker , defender );
		ScriptFactory.checkAll( ScriptLogic.Trigger.UNIT_ATTACK);
		Trigger_Object.triggerCall( defenderTile , attackerTile , defender , attacker );
		ScriptFactory.checkAll( ScriptLogic.Trigger.UNIT_DEFEND);
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

