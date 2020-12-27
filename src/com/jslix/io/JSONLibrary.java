package com.jslix.io;

import java.io.FileNotFoundException;
import java.util.Scanner;

import org.json.simple.JSONObject;
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
	
	/**
	 * This initializes the JsonLibrary
	 */
	public JSONLibrary() {
		finder = new FileFind();
		parser = new JSONParser();
	}
	
	/**
	 * This takes in data and gets a JSONObject out of it
	 * @param data The JSON formed data
	 * @return A JSONObject Hashmap containing the data
	 */
	public JSONObject getJSONObject( String data ) {
		try {
			return (JSONObject)parser.parse(data);
		}catch(ParseException pe) {
	        System.out.println("position: " + pe.getPosition());
	        System.out.println(pe);
	        return new JSONObject();
	    }
	}
	
	/**
	 * A shortcut for getting a JSON Object from a filename
	 * @param filename The name of the file to get the json from
	 * @return A JSONObject Hashmap containing the data
	 */
	public JSONObject getJSONFile( String filename ) {
		return getJSONObject( getScript(filename) );
	}
	
	/**
	 * This saves a JSON to a file, just in case that is needed
	 * @param filename The filename to save the json to
	 * @param json The JSON Object to save
	 */
	public void saveJSONObjectToFile( String filename, JSONObject json ) {
		finder.createFile(finder.getRootPath(), filename, json.toJSONString(), false);
	}
	
	/**
     * This is used to get an JSON script from a file provided. 
     * It will work for any document formed in JSON.
     * @param filename The path to the JSON document
     * @return The JSON raw data within a JSON script
     */
    public String getScript( String filename ){
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

}
