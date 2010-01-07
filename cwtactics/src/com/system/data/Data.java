package com.system.data;

import java.util.ArrayList;
import java.util.HashMap;

import com.system.data.sheets.Move_Sheet;
import com.system.data.sheets.Rank_Sheet;
import com.system.data.sheets.Sheet;
import com.system.data.sheets.Tile_Sheet;
import com.system.data.sheets.Unit_Sheed;
import com.system.data.sheets.Weapon_Sheed;
import com.system.data.sheets.Weather_Sheet;
import com.system.log.Logger;
import com.system.log.Logger.Level;

public class Data {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private static HashMap<String,Sheet> dataCore;
	// Tag number table, contains all tag numbers for string tag ID's
	private static HashMap<String,Integer>	tagTable;
	private static ArrayList<Sheet> resourceTable;
	private static ArrayList<Weather_Sheet> weatherTable;

	// modification information
	private static String name;
	private static String author;
	private static String version; 
	private static String language;
	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */

	static{
		
		dataCore	= new HashMap<String, Sheet>(200);
		tagTable	= new HashMap<String, Integer>(50);
		
		resourceTable = new ArrayList<Sheet>();
		weatherTable = new ArrayList<Weather_Sheet>();
		
		resourceTable.trimToSize();
		weatherTable.trimToSize();
	}
	
	
	
	/*
	 * ACCESSING METHODS
	 * *****************
	 */
	
	public static void addSheet( String ID , Sheet sh ){
		dataCore.put(ID, sh);
		sh.setID(ID);
	}
	
	public static void addResourceSheet( String ID , Sheet sh ){
		addSheet(ID, sh);
		resourceTable.add(sh);
	}
	
	public static void addWeatherSheet( String ID , Sheet sh ){
		addSheet(ID, sh);
		weatherTable.add( (Weather_Sheet) sh );
	}
	
	public static Sheet getSheet( String ID ){
		if( existID(ID) ) return dataCore.get(ID);
		else return null;
	}
	
	public static boolean existID( String ID ){
		if( dataCore.containsKey(ID) ) return true;
		else return false;
	}
	
	public static Unit_Sheed getUnitSheet( String ID ){
		if( existID(ID) ) return (Unit_Sheed) getSheet(ID);
		Logger.write("UnitSheet '"+ID+"' doesn't exist!", Level.WARN);
		return null;
	}
	
	public static Tile_Sheet getTileSheet( String ID ){
		if( existID(ID) ) return (Tile_Sheet) getSheet(ID);
		Logger.write("TileSheet '"+ID+"' doesn't exist!", Level.WARN);
		return null;
	}
	
	public static Weather_Sheet getWeatherSheet( String ID ){
		if( existID(ID) ) return (Weather_Sheet) getSheet(ID);
		Logger.write("WeatherSheet '"+ID+"' doesn't exist!", Level.WARN);
		return null;
	}
	
	public static Rank_Sheet getRankSheet( String ID ){
		if( existID(ID) ) return (Rank_Sheet) getSheet(ID);
		Logger.write("RankSheet '"+ID+"' doesn't exist!", Level.WARN);
		return null;
	}
	
	public static Sheet getRessourceSheet( String ID ){
		if( existID(ID) ) return (Sheet) getSheet(ID);
		Logger.write("ResourceSheet '"+ID+"' doesn't exist!", Level.WARN);
		return null;
	}
	
	public static Move_Sheet getMoveSheet( String ID ){
		if( existID(ID) ) return (Move_Sheet) getSheet(ID);
		Logger.write("MoveSheet '"+ID+"' doesn't exist!", Level.WARN);
		return null;
	}

	public static Sheet getEntrySheet( String ID ){
		if( existID(ID) ) return (Sheet) getSheet(ID);
		Logger.write("EntrySheet '"+ID+"' doesn't exist!", Level.WARN);
		return null;
	}
	
	public static Sheet getAmorSheet( String ID ){
		if( existID(ID) ) return (Sheet) getSheet(ID);
		Logger.write("AmorSheet '"+ID+"' doesn't exist!", Level.WARN);
		return null;
	}
	
	public static Weapon_Sheed getWeaponSheet( String ID ){
		if( existID(ID) ) return (Weapon_Sheed) getSheet(ID);
		Logger.write("WeaponSheet '"+ID+"' doesn't exist!", Level.WARN);
		return null;
	}
	
	public static ArrayList<Sheet> getRessourceTable(){
		return resourceTable;
	}
	
	public static ArrayList<Weather_Sheet> getWeatherTable(){
		return weatherTable;
	}
	
	/*
	public static ArrayList<Tile_Sheet> getTileTable(){
		return tileTable;
	}*/

	
	
	/*
	 * TAG METHODS
	 * ***********
	 */
	
	/**
	 * Returns the internal identical number for
	 * a String ID. If the tag isn't in the database
	 * this method will add it.
	 * 
	 * @param ID
	 */
	public static Integer getIntegerTagID( String ID ){
		
		if( !existTagID(ID) ){
			tagTable.put( ID, tagTable.size() );
			return getIntegerTagID(ID);
		}
		else return tagTable.get(ID); 
	}
	
	/**
	 * Exist an integer Tag ID for a given String Tag ID ?
	 */
	public static boolean existTagID( String ID ) {
		
		if( tagTable.containsKey(ID) ) return true;
		else return false;
	}
	
	
	
	/*
	 * GAME INFORMATION METHODS
	 * ************************
	 */
	
	public static String getName() {
		return name;
	}

	public static void setName(String name) {
		Data.name = name;
	}
	
	public static String getAuthor() {
		return author;
	}

	public static void setAuthor(String author) {
		Data.author = author;
	}

	public static String getVersion() {
		return version;
	}

	public static void setVersion(String version) {
		Data.version = version;
	}

	public static String getLanguage() {
		return language;
	}

	public static void setLanguage(String language) {
		Data.language = language;
	}
	
	
	
}

