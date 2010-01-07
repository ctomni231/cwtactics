package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.Fight;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.sheets.Weapon_Sheed;

public class StartFight implements Command {

	private Unit attacker;
	private Unit defender;
	private Tile attackerTile;
	private Tile defenderTile;
	private Weapon_Sheed attackerWeapon;
	
	public StartFight(Unit attacker, Unit defender, Tile attackerTile, Tile defenderTile, Weapon_Sheed attackerWeapon) {
		super();
		this.attacker = attacker;
		this.defender = defender;
		this.attackerTile = attackerTile;
		this.defenderTile = defenderTile;
		this.attackerWeapon = attackerWeapon;
	}

	public void doCommand() {
		Fight.battle( attackerTile, attacker , attackerWeapon , defenderTile , defender );
	}

}
