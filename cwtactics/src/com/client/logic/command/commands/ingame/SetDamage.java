/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.object.Unit;

/**
 *
 * @author alexanderradom
 */
public class SetDamage implements Command {

	/*
	 * 
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private Unit unit;
	private int damage;
	
	

	/*
	 * 
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
    public SetDamage( Unit unit , int damage){
    	this.unit = unit;
    	this.damage = damage;
    }
	
	
	
	/*
	 * 
	 * WORK METHODS
	 * ************
	 * 
	 */

    public void doCommand(){
    	
    	// change health of the unit
    	unit.setHealth( unit.getHealth() - damage );
    	
    	//TODO destroy if health <= 0
    }

    
    
    /*
     *
     * OUTPUT METHODS
     * **************
     * 
     */
    
    public String toString(){
    	return "SETDAMAGE-"+unit.getID()+"-"+damage;
    }
}
