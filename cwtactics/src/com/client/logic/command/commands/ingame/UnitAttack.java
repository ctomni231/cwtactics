package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.logic.command.MessageServer;
import com.client.model.object.Unit;
import com.system.data.sheets.Weapon_Sheed;

/**
 * Battle command between two unit.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class UnitAttack implements Command{

	/*
	 * VARIABLES
	 * *********
	 */
	
	private int attack;
	private Unit defender;
	private Unit attacker;
	private Weapon_Sheed weapon;
	
	
	
	/*
	 * CONSTRUCTOR
	 * ***********
	 */
	
	public UnitAttack( Unit attacker , Unit defender , int attackDamage , Weapon_Sheed weapon ){
		
		this.attack = attackDamage;
		this.weapon = weapon;
		this.defender = defender;
		this.attacker = attacker;

		// NO NEGATIVE DAMAGE
		if( attack < 0 ) attack = 0;
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doCommand() {
		MessageServer.sendLocalToFirstPos( new SetDamage( defender , attack) );
		MessageServer.sendLocalToFirstPos( new DecreaseAmmo( attacker , weapon ) );
	}

}

