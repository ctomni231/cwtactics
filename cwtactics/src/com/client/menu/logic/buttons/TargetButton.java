package com.client.menu.logic.buttons;

import com.client.model.object.Game;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.sheets.Weapon_Sheed;

public class TargetButton extends Button{

	/*
	 * VARIABLES
	 * *********
	 */

	private Unit unit;
	private Weapon_Sheed sh;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public TargetButton(ButtonType type, Unit unit, Weapon_Sheed sh ) {
		super(type, unit.sheet());
		this.unit = unit;
		this.sh = sh;
	}
	
	

	/*
	 * ACCESSING METHODS
	 * *****************
	 */
	
	public Tile getTile(){
		return Game.getMap().findTile(unit);
	}
	
	public Unit getUnit(){
		return unit;
	}
	
	public Weapon_Sheed getWeapon(){
		return sh;
	}

	
}

