package com.system.data;

import java.util.ArrayList;
import java.util.HashMap;

import com.system.data.sheets.Move_Sheet;
import com.system.data.sheets.Rank_Sheet;
import com.system.data.sheets.Sheet;
import com.system.data.sheets.Tile_Sheet;
import com.system.data.sheets.Unit_Sheed;
import com.system.data.sheets.Weather_Sheet;

public class Data {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	// Data sheets
	private static ArrayList<Unit_Sheed>	unitTable;
	private static ArrayList<Tile_Sheet> 	tileTable;
	private static ArrayList<Weather_Sheet>	weatherTable;
	private static ArrayList<Rank_Sheet> 	rankTable;
	private static ArrayList<Sheet> 		ressourceTable;
	private static ArrayList<Sheet> 		entryTable;
	private static ArrayList<Move_Sheet>	moveTable;
	
	// ID number table, contains all id numbers for string ID's
	private static HashMap<String,Integer>	idTable;
	
	// Tag number table, contains all tag numbers for string tag ID's
	private static HashMap<String,Integer>	tagTable;

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
		
		rankTable	= new ArrayList<Rank_Sheet>();
		weatherTable = new ArrayList<Weather_Sheet>();
		ressourceTable = new ArrayList<Sheet>();
		moveTable	= new ArrayList<Move_Sheet>();
		entryTable	= new ArrayList<Sheet>();
		tileTable	= new ArrayList<Tile_Sheet>();
		unitTable 	= new ArrayList<Unit_Sheed>();
		idTable		= new HashMap<String, Integer>();
		tagTable	= new HashMap<String, Integer>();
	}
	
	
	
	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	public static void addUnitSheet( String ID , Unit_Sheed sh ){
		unitTable.add(sh);
		sh.setName(ID);
		idTable.put(ID, unitTable.size() - 1 );
	}
	
	public static Unit_Sheed getUnitSheet( int ID ){
		if( ID < 0 || ID >= unitTable.size() ) return null;
		else return unitTable.get(ID);
	}
	
	public static void addTileSheet( String ID , Tile_Sheet sh ){
		tileTable.add(sh);
		sh.setName(ID);
		idTable.put(ID, tileTable.size() - 1 );
	}
	
	public static Tile_Sheet getTileSheet( int ID ){
		if( ID < 0 || ID >= tileTable.size() ) return null;
		else return tileTable.get(ID);
	}
	
	public static void addWeatherSheet( String ID , Weather_Sheet sh ){
		weatherTable.add(sh);
		sh.setName(ID);
		idTable.put(ID, weatherTable.size() - 1 );
	}
	
	public static Weather_Sheet getWeatherSheet( int ID ){
		if( ID < 0 || ID >= weatherTable.size() ) return null;
		else return weatherTable.get(ID);
	}
	
	public static void addRankSheet( String ID , Rank_Sheet sh ){
		rankTable.add(sh);
		sh.setName(ID);
		idTable.put(ID, rankTable.size() - 1 );
	}
	
	public static Rank_Sheet getRankSheet( int ID ){
		if( ID < 0 || ID >= rankTable.size() ) return null;
		else return rankTable.get(ID);
	}

	public static void addRessourceSheet( String ID , Sheet sh ){
		ressourceTable.add(sh);
		sh.setName(ID);
		idTable.put(ID, ressourceTable.size() - 1 );
	}
	
	public static Sheet getRessourceSheet( int ID ){
		if( ID < 0 || ID >= ressourceTable.size() ) return null;
		else return ressourceTable.get(ID);
	}
	
	public static void addMoveSheet( String ID , Move_Sheet sh ){
		moveTable.add(sh);
		sh.setName(ID);
		idTable.put(ID, moveTable.size() - 1 );
	}
	
	public static Move_Sheet getMoveSheet( int ID ){
		if( ID < 0 || ID >= moveTable.size() ) return null;
		else return moveTable.get(ID);
	}

	public static void addEntrySheet( String ID , Sheet sh ){
		entryTable.add(sh);
		sh.setName(ID);
		idTable.put(ID, entryTable.size() - 1 );
	}
	
	public static Sheet getEntrySheet( int ID ){
		if( ID < 0 || ID >= entryTable.size() ) return null;
		else return entryTable.get(ID);
	}
	
	public static ArrayList<Sheet> getRessourceTable(){
		return ressourceTable;
	}
	
	public static ArrayList<Weather_Sheet> getWeatherTable(){
		return weatherTable;
	}
	
	public static ArrayList<Tile_Sheet> getTileTable(){
		return tileTable;
	}


	
	
	/*
	 *
	 * ID METHODS
	 * **********
	 * 
	 */

	/**
	 * Exist an integer ID for a given String ID ?
	 */
	public static boolean existIntegerID( String ID ){
		if( idTable.containsKey(ID) ) return true;
		else return false;
	}
	
	/**
	 * Returns the internal identical number for
	 * a String ID.
	 * 
	 * @param ID
	 */
	public static Integer getIntegerID( String ID ){

		if( !existIntegerID(ID) ){
			System.err.println("ID "+ID+" not found in the data core...");
			return -1; 
		}
		else return idTable.get(ID); 
	}
	
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
	 * 
	 * GAME INFORMATION METHODS
	 * ************************
	 * 
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

