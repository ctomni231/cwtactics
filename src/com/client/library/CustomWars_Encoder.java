package com.client.library;

import com.cwt.model.mapObjects.Player;
import com.cwt.model.mapObjects.Unit;
import com.cwt.model.mapObjects.Tile;
import com.client.model.object.*;
import com.system.data.sheets.Unit_Sheed;

public class CustomWars_Encoder {

	public static String encodeUnit( Unit unit ){
		return unit.getClass().getName()+":"+CustomWars_Library.getUnitID(unit);
	}
	
	public static String encodeTile( Tile tile ){
		return tile.getClass().getName()+":"+tile.getPosX()+"-"+tile.getPosY();
	}
	
	public static String encodePlayer( Player player ){
		return player.getClass().getName()+":"+player.getID();
	}
	
	public static String encodeUnitSheet( Unit_Sheed sh ){
		return sh.getClass().getName()+":"+sh.getID();
	}
}
