package com.jslix.io;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import org.json.simple.JSONObject;
import org.json.simple.parser.ContainerFactory;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 * JSON_Library
 *
 * This is a class created for both reading and writing JSON 
 * files.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.26.20
 */
public class JSONLibrary {
	
	/** The class used for the organization of files */
	private FileFind finder;
	/** The class used for parsing the JSON */
	private JSONParser parser;
	/** The container factory for this object */
	private ContainerFactory factory;
	/** This stores the last map object worked on */
	private Map stored;
	
	/**
	 * This initializes the JsonLibrary
	 */
	public JSONLibrary() {
		finder = new FileFind();
		parser = new JSONParser();
		factory = new ContainerFactory() {
	         @Override
	         public Map createObjectContainer() {
	            return new LinkedHashMap<>();
	         }
	         @Override
	         public List creatArrayContainer() {
	            return new LinkedList<>();
	         }
	     };
	}
	
	/**
	 * Takes in a filename and creates a Map out of it
	 * @param filename The JSON formed data file
	 * @return A Map containing the data
	 */
	public Map getJSONMap( String filename ) {
		return getJSONMapFromRaw( getRaw(filename) );
	}
	
	/**
	 * Takes in raw data and creates a Map out of it
	 * @param filename The JSON formed data
	 * @return A Map containing the data
	 */
	public Map getJSONMapFromRaw( String data ) {
		try {
			stored = (Map)parser.parse(data, factory);
		}catch(ParseException pe) {
	        System.out.println("position: " + pe.getPosition());
	        System.out.println(pe);
	        stored = null;
	    }
		return stored;
	}
	
	/**
	 * Gets the stored Map. Created when getJSONMap and 
	 * getJSONMapFromRaw is called. Otherwise, returns null
	 * @return A map representing the JSON data
	 */
	public Map getStored() {
		return stored;
	}
	
	/**
	 * Write in an array to get an Object representing the key, or a list of
	 * keys for a HashMap
	 * java.lang.String For strings
	 * java.util.LinkedList For Arrays
	 * @param keyList The list of keys to reach a JSON file
	 * @return An Object representing the key, or a list of keys for a HashMap
	 */
	public Object get( String[] keyList) {
		return get(keyList, stored);
	}
	
	/**
	 * Write in an array to get an Object representing the key, or a list of 
	 * keys for a HashMap
	 * java.lang.String For strings
	 * java.util.LinkedList For Arrays
	 * @param keyList The list of keys to reach a JSON file
	 * @param map The map to use for searching
	 * @return An Object representing the key, or a list of keys for a HashMap
	 */
	public Object get( String[] keyList, Map map) {
		
		// Why is Java so... verbose?
		ArrayList<String> cool = new ArrayList<String>();
		for(String key : keyList)
			cool.add(key);
		return getData(cool, map);
	}
	
	//--------------------------
	// JSON Self-Help Functions
	//--------------------------
	// Because sometimes you just want to manipulate things yourself
	
	/**
	 * A shortcut for getting a JSON Object from a filename
	 * @param filename The name of the file to get the json from
	 * @return A JSONObject Hashmap containing the data
	 */
	public JSONObject getJSONObject( String filename ) {
		return getJSONObjectFromRaw( getRaw(filename) );
	}
	
	/**
	 * This takes in data and gets a JSONObject out of it
	 * @param data The JSON formed data
	 * @return A JSONObject Hashmap containing the data
	 */
	public JSONObject getJSONObjectFromRaw( String data ) {
		try {
			return (JSONObject)parser.parse(data);
		}catch(ParseException pe) {
	        System.out.println("position: " + pe.getPosition());
	        System.out.println(pe);
	        return new JSONObject();
	    }
	}
	
	/**
     * This is used to get an JSON raw script from a file provided. 
     * It will work for any document formed in JSON.
     * @param filename The path to the JSON document
     * @return The JSON raw data within a JSON script
     */
    public String getRaw( String filename ){
    	String script = "";
		try {
			Scanner scanner = new Scanner(finder.getFile(filename));
			while (scanner.hasNext())
				script += scanner.nextLine() + "\n";
		} catch (FileNotFoundException e) {
			System.err.println(e);
		}
		return script;
    }
    
    /**
	 * This saves a JSON to a file, just in case that is needed
	 * @param filename The filename to save the json to
	 * @param json The JSON Object to save
	 */
	public void saveJSONFile( String filename, JSONObject json ) {
		saveJSONFile(filename, json.toJSONString() );
	}
	
	 /**
	 * This saves a JSON to a file, just in case that is needed
	 * @param raw The raw json from the file
	 * @param json The JSON Object to save
	 */
	public void saveJSONFile( String filename, String raw ) {
		finder.createFile(finder.getRootPath(), filename, raw, false);
	}
	
	/**
     * Used for printing out all data from stored JSON. Human readable
     * @param filename The JSON file path and name
     */
	public void outputAllFromRaw() {
		Map map = stored;
		map.forEach((k,v) -> output(k,v,""));
	}
    
    /**
     * Used for printing out all data from JSON formed text. Human readable
     * @param filename The JSON file path and name
     */
    public void outputAllFromRaw(String data) {
    	Map map = (Map)getJSONMapFromRaw(data);
		map.forEach((k,v) -> output(k,v,""));
    }
    
    /**
     * Used for printing out all data from a JSON file. Human readable
     * @param filename The JSON file path and name
     */
    public void outputAll(String filename) {
		Map map = (Map)getJSONMap(filename);
		map.forEach((k,v) -> output(k,v,""));
	}
    
    /**
     * This is a helper function for the outputAll functionality
     * @param key The Key of the JSON file
     * @param value The Value of the JSON file
     */
    private void output(Object key, Object value, String prefix) {
		
		if(value.getClass().getName() == "java.util.LinkedHashMap") {
			System.out.println(prefix + "<Key :> " + key + " <" + value.getClass().getName() + " Values :> <<<BEGIN>>>");
			Map temp = (Map)value;
			String tstr = prefix + "\t";
			temp.forEach((k,v) -> output(k, v, tstr));
			System.out.println(prefix + "<Key :> " + key + " <" + value.getClass().getName() + " Values :> <<<END>>>");
		}else
			System.out.println(prefix + "<Key :> " + key + " <" + value.getClass().getName() + " Value :> " + value );
	}
    
    private Object getData(ArrayList<String> keylist, Object value) {
    	
    	// Is a map to start out with
    	if(value.getClass().getName() == "java.util.LinkedHashMap") {
    		Map temp = (Map)value;
        	
        	// If it is empty, you are probably looking for keys instead
        	if(keylist.isEmpty())
        		return temp.keySet();
        	
        	// If not, pop one off the Array of keys
        	String tstr = keylist.remove(0);
        	Object data = temp.get(tstr);
        	
        	// If it is another map, do a recursion until we find the key
        	return getData(keylist, data);
    	}else
    		return value;
    	
    }

}
