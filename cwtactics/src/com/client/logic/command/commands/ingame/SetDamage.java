/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Game;
import com.client.model.object.Tile;
import com.client.model.object.Unit;

/**
 * Command to inflict a value of damage
 * to it.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class SetDamage implements Command {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private Unit unit;
	private int damage;
	
	

	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
    public SetDamage( Unit unit , int damage){
    	this.unit = unit;
    	this.damage = damage;
    }
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */

    public void doCommand(){
    	
    	if( damage <= 0 ) return;
		
		// GIVE DAMAGE
		unit.decreaseHealth(damage);
		
		// REMOVE UNIT IF HEALTH IS 0
		if( unit.getHealth() == 0 ){
			
			Tile tile = Game.getMap().findTile(unit);
			
			//TODO show destroy animation
			
			// REMOVE UNIT INSTANCE FROM GAME INSTANCES
			unit.getOwner().removeUnit(unit);
			tile.setUnit(null);
		}
    }

}
