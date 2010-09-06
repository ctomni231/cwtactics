package com.system.data;

import com.client.model.object.Tile;
import com.client.model.object.Unit;

public class DynamicMemory {

	private static Tile tile;
	private static Unit unit;
		
	public static Unit getUnit(){
		return unit;
	}
	
	public static Tile getTile(){
		return tile;
	}
	
	public static void setUnit( Unit obj ){
		unit = obj;
	}
	
	public static void setTile( Tile obj ){
		tile = obj;
	}
	
	public static void reset(){
		tile = null;
		unit = null;
	}
	
}
