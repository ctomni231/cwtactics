package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.log.Logger;
import com.system.log.Logger.Level;

/**
 * Battle command between two unit.
 * 
 * @author Tapsi [BcMk]
 */
public class Battle implements Command{

	/*
	 * VARIABLES
	 * *********
	 */
	
	private int attack, counter;
	private Tile attackerTile, defenderTile;
	
	
	
	/*
	 * CONSTRUCTOR
	 * ***********
	 */
	
	public Battle( Tile attackerTile , Tile defenderTile , int attackDamage , int defenderDamage ){
		
		attack = attackDamage;
		counter = defenderDamage;
		this.attackerTile = attackerTile;
		this.defenderTile = defenderTile;
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doCommand() {
		
		// give damage to defender
		giveDamage( defenderTile , attack);
		
		// only counter if defender survived the attack 
		if( defenderTile.getUnit() != null ) giveDamage( attackerTile , counter);
	}
	
	/**
	 * Set damage on an unit and destroy it
	 * if it don't survive the attack.
	 */
	private void giveDamage( Tile tile , int damage ){
		
		Logger.write( ""+damage , Level.NORMAL );
		
		if( damage <= 0 ) return;
		
		// get variables
		Unit unit = tile.getUnit();
		
		// give damage
		unit.decreaseHealth(damage);
		
		// remove unit if destroyed
		if( unit.getHealth() == 0 ){
			
			//TODO show destroy animation
			
			unit.getOwner().removeUnit(unit);
			
			// remove unit from tile
			tile.setUnit(null);
		}
		
	}

}

