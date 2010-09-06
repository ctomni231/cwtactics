package com.system.data;

import com.system.error.Add_Exception;
import com.system.log.Logger;

/**
 * Safe dynamic database for usage with a possible wide 
 * array of unknown and faulty input data.
 */
public class Dynamic_Database {
	
	// VARIABLES
	/////////////
	
	private static Category_Database<String, String, Object> database;
	
	
	// CONSTRUCTOR
	///////////////
	
	static{
		database = new Category_Database<String, String, Object>();
	}
	
	
	// PUBLIC METHODS
	//////////////////
	
	public static void addCategory( String cat ){
		try{ database.addCategory(cat); }
		catch( NullPointerException e ){ Logger.warn("Category is null !"); }
		catch( Add_Exception e ){ Logger.warn("Category allready exist !"); }
	}

	public static void addObject( String cat , String key , Object obj ){
		try{ database.addObject(cat, key, obj); }
		catch( NullPointerException e ){ Logger.warn("Category or key is null ! ( C:"+cat+" | K:"+key+" )"); }
		catch( Add_Exception e ){ Logger.warn("Contains allready key "+key+" !"); }
	}
	
}
