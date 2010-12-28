package com.client.menu.logic.buttons;

import com.client.model.object.Game;
import com.cwt.model.mapObjects.Tile;
import com.cwt.model.mapObjects.Unit;
import com.system.data.sheets.Weapon_Sheed;

/**
 * Holds a target tile and unit
 * for an attack.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class TargetButton extends Button{

	/*
	 * VARIABLES
	 * *********
	 */

	private Unit unit;
	private Tile tile;
	private Weapon_Sheed sh;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public TargetButton(ButtonType type, Unit unit, Weapon_Sheed sh ) {
		super(type, unit.sheet());
		this.unit = unit;
		this.tile = Game.getMap().findTile(unit);
		this.sh = sh;
	}
	
	

	/*
	 * ACCESS METHODS
	 * **************
	 */
	
	/**
	 * Returns the tile of the target.
	 */
	public Tile getTile(){
		return tile;
	}
	
	/**
	 * Returns the target unit.
	 */
	public Unit getUnit(){
		return unit;
	}
	
	/**
	 * Returns the attack weapon.
	 */
	public Weapon_Sheed getWeapon(){
		return sh;
	}

	
}

