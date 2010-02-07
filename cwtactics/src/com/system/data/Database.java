package com.system.data;

import java.util.Collection;

import com.system.data.sheets.Move_Sheet;
import com.system.data.sheets.Rank_Sheet;
import com.system.data.sheets.Sheet;
import com.system.data.sheets.Tile_Sheet;
import com.system.data.sheets.Unit_Sheed;
import com.system.data.sheets.Weapon_Sheed;
import com.system.data.sheets.Weather_Sheet;
import com.system.log.Logger;

/**
 * Holds all modification data.
 */
public class Database {

	/*
	 * VARIABLES
	 * *********
	 */
	
	public enum Category{
		SHEETS,UNIT_SHEETS,TILE_SHEETS,WEATHER_SHEETS,WEAPON_SHEETS,RESOURCE_SHEETS,
		MOVE_SHEETS,RANK_SHEETS,ENTRIES
	}
	
	private static Category_Database<Category,String,Sheet> database;
	private static IdenticalNumber_List<String> tagList;
	private static IdenticalNumber_List<Sheet> resources;
	private static IdenticalNumber_List<Weather_Sheet> weather;
	

	// modification information
	private static String name;
	private static String author;
	private static String version; 
	private static String language;
    private static String tileset;
	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */

	static{
		database = new Category_Database<Category, String, Sheet>();
		tagList = new IdenticalNumber_List<String>();
		resources = new IdenticalNumber_List<Sheet>();
		weather = new IdenticalNumber_List<Weather_Sheet>();
		
		// add categories
		for( Category en : Category.values() ) database.addCategory(en);
	}
	
	
	
	/*
	 * ACCESSING METHODS
	 * *****************
	 */
	
	public static void addSheet( Category cat , String ID , Sheet sh ){
		database.addObject( cat , ID, sh );
		sh.setID(ID);
		if( cat == Category.WEATHER_SHEETS ) weather.addElement( (Weather_Sheet) sh );
		if( cat == Category.RESOURCE_SHEETS ) resources.addElement( sh );
	}
	
	public static Sheet getSheet( String ID ){
		return database.getObject(ID);
	}
	
	public static Sheet getSheet( Category cat , String ID ){
		return database.getObject(cat, ID);
	}
	
	public static boolean existID( String ID ){
		return ( getSheet(ID) != null )? true : false;
	}
	
	public static Unit_Sheed getUnitSheet( String ID ){
		return ( database.getObject( Category.UNIT_SHEETS , ID) != null )? (Unit_Sheed) getSheet( Category.UNIT_SHEETS , ID ) : null;
	}
	
	public static Tile_Sheet getTileSheet( String ID ){
		return ( database.getObject( Category.TILE_SHEETS , ID) != null )? (Tile_Sheet) getSheet( Category.TILE_SHEETS , ID ) : null;
	}
	
	public static Weather_Sheet getWeatherSheet( String ID ){
		return ( database.getObject( Category.WEATHER_SHEETS , ID) != null )? (Weather_Sheet) getSheet( Category.WEATHER_SHEETS , ID ) : null;
	}
	
	public static Rank_Sheet getRankSheet( String ID ){
		return ( database.getObject( Category.RANK_SHEETS , ID) != null )? (Rank_Sheet) getSheet( Category.RANK_SHEETS , ID ) : null;
	}
	
	public static Sheet getRessourceSheet( String ID ){
		return ( database.getObject( Category.RESOURCE_SHEETS , ID) != null )? getSheet( Category.RESOURCE_SHEETS , ID ) : null;
	}
	
	public static Move_Sheet getMoveSheet( String ID ){
		return ( database.getObject( Category.MOVE_SHEETS , ID) != null )? (Move_Sheet) getSheet( Category.MOVE_SHEETS , ID ) : null;
	}

	public static Sheet getEntrySheet( String ID ){
		return ( database.getObject( Category.ENTRIES , ID) != null )? getSheet( Category.ENTRIES , ID ) : null;
	}
	
	public static Weapon_Sheed getWeaponSheet( String ID ){
		return ( database.getObject( Category.WEAPON_SHEETS , ID) != null )? (Weapon_Sheed) getSheet( Category.WEAPON_SHEETS , ID ) : null;
	}
	
	public static Collection<Sheet> getRessourceTable(){
		return database.getCategoryValueList( Category.RESOURCE_SHEETS );
	}
	
	public static Collection<Sheet> getWeatherTable(){
		return database.getCategoryValueList( Category.WEATHER_SHEETS );
	}
	
	public static int getWeatherNumber( Weather_Sheet sh ){
		return weather.getIdentical(sh);
	}
	
	public static int getResourceNumber( Sheet sh ){
		return resources.getIdentical(sh);
	}
	
	public static Weather_Sheet getWeatherSheet( int i ){
		return weather.getKeyForID(i);
	}
	
	public static Sheet getResourceSheet( int i ){
		return resources.getKeyForID(i);
	}
	 
	
	
	
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
		try{ 
			if( !existTagID(ID) ) tagList.addElement(ID);
			return tagList.getIdentical(ID);
		}
		catch( NullPointerException e ){ Logger.warn("Nullpointer exception"); return -1; }
	}
	
	/**
	 * Exist an integer Tag ID for a given String Tag ID ?
	 */
	public static boolean existTagID( String ID ) {
		try{ return ( tagList.contains(ID) )? true : false; }
		catch( NullPointerException e ){ Logger.warn("Nullpointer exception"); return false;	}
	}
	
	
	
	/*
	 * GAME INFORMATION METHODS
	 * ************************
	 */
	
	public static String getName() {
		return name;
	}

	public static void setName(String name) {
		Database.name = name;
	}
	
	public static String getAuthor() {
		return author;
	}

	public static void setAuthor(String author) {
		Database.author = author;
	}

	public static String getVersion() {
		return version;
	}

	public static void setVersion(String version) {
		Database.version = version;
	}

	public static String getLanguage() {
		return language;
	}

	public static void setLanguage(String language) {
		Database.language = language;
	}
	
	public static String getTileSet() {
		return tileset;
	}

	public static void setTileSet(String tileset) {
		Database.tileset = tileset;
	}
	
}

