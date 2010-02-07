package com.client.library;

import com.client.model.object.Game;
import com.client.model.object.Map;
import com.client.model.object.Player;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.Database;
import com.system.data.sheets.Unit_Sheed;

public class CustomWars_Decoder {
	
	public static Unit decodeUnit( String str ){
		return Map.getUnit( Integer.parseInt(str));
	}
	
	public static Tile decodeTile( String str ){
		int x = Integer.parseInt(str.split("-")[0] );
		int y = Integer.parseInt(str.split("-")[1] );
		return Game.getMap().getTile( x,y );
	}
	
	public static Player decodePlayer( String str ){
		return Game.getPlayer( Integer.parseInt(str));
	}
	
	public static Unit_Sheed decodeUnitSheet( String str ){
		return Database.getUnitSheet(str);
	}

}
