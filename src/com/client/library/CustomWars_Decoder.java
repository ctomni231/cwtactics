package com.client.library;

import com.client.model.object.Game;
import com.customwarsTactics.model.mapObjects.Map;
import com.customwarsTactics.model.mapObjects.Player;
import com.customwarsTactics.model.mapObjects.Tile;
import com.customwarsTactics.model.mapObjects.Unit;
import com.system.data.Engine_Database;
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
		return Engine_Database.getUnitSheet(str);
	}

}
