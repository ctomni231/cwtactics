package com.cwt.system.jslix.tools;

import java.io.FileNotFoundException;
import java.util.Scanner;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JSON_Parser {

	/** The JSON parser used to parse JSON files for values */
	private JSONObject parser;
	/** The Scanner used to convert files into Strings */
	private Scanner scanner;
	/** The file finder used to find files within the system */
	private FileFind finder;
	/** The JSON script within the system */
	private String script;
	
	/** This class sets up a JSON parser ready for parsing using the parse command */
	public JSON_Parser(){
		finder = new FileFind();
		script = "";
	}
	
	public JSON_Parser( String filename ){
		this();
		parse( filename );
	}
	
	public final void parse( String filename ){
		try {
			scanner = new Scanner( finder.getFile(filename) );
			script = "";
			while(scanner.hasNext())
				script = script + scanner.nextLine() + "\n";
			parser = new JSONObject( script );
		} catch (FileNotFoundException e) {
			System.err.println(e);
		} catch (JSONException e) {
			System.err.println(e);
		}
	}
	
	public void parseDocument(JSONArray array){
		
	}
	
	public void get(){
		for(int i = 0; i < parser.length(); i++){
			try {
				System.out.println(parser.names().getString(i));
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
	}
	
	/**
	 * This function was made to return the raw script of the JSON file
	 * @return The raw script of the JSON file
	 */
	public String getScript(){
		return script;
	}
	
	public static void main(String[] args){
		JSON_Parser parse = new JSON_Parser();
		parse.parse("map/test.json");
		parse.get();
		//System.out.println( parse.getScript() );	
	}
}
