package com.cwt.system.jslix.tools;

import java.io.FileNotFoundException;
import java.util.Scanner;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

public class JSON_Parser extends XML_Parser{

	/** The XML Header for the XML converted file */
	public final String HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	/** The JSON parser used to parse JSON files for values */
	private JSONObject parser;
	/** The Scanner used to convert files into Strings */
	private Scanner scanner;
	/** The JSON script within the system */
	private String script;
	
	/** This class sets up a JSON parser ready for parsing using the parse command */
	public JSON_Parser(){
		super();
		script = "";
	}
	
	public JSON_Parser( String filename ){
		this();
		parse( filename );
	}
	
	//TODO: Split this off into a class that can read both XML and JSON files.
	public void parse( String filename ){
		try {
			scanner = new Scanner( finder.getFile(filename) );
			script = "";
			while(scanner.hasNext())
				script = script + scanner.nextLine() + "\n";
			parser = new JSONObject( script );
			
			//Changes the JSON into an XML file in one pass
			parseData(formatXML(XML.toString( parser , 
				filename.substring(filename.lastIndexOf("/")+1, filename.indexOf(".")))));
			
		} catch (FileNotFoundException e) {
			System.err.println(e);
		} catch (JSONException e) {
			System.err.println(e);
		}
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
	
	/**
	 * This class takes a solid String of unformatted XML code and converts it
	 * into proper formatted XML code readable by the XML_Parser class.
	 * @param data A solid block of unreadable XML code from JSONObject
	 * @return A properly formatted XML code
	 */
	private String formatXML( String data ){
		XML_Writer writer = new XML_Writer();
		String temp = "";
		while(data.length() > 0){
			temp = data.substring(0, data.indexOf(">"));
			if(temp.matches("</.*"))
				writer.endXMLTag();
			else if(temp.charAt(0) == '<'){	
				temp = temp.substring(1);
				writer.addXMLTag(temp.matches("\\d.*") ? convertRomanNumeral(temp) : temp);
			}else
				writer.addAttribute("data", temp.substring(0, data.indexOf("<")), true);
			data = data.substring(data.indexOf(">")+1);
		}
		return writer.getRawXML();
	}
	
	/**
	 * This function takes normal numbers and converts them into Roman numerals. It's main
	 * purpose is to help keep the integrity of the XML data to stay well formed. 
	 * @param data Numerical data in String format
	 * @return The Roman numeral value of the data
	 */
	private String convertRomanNumeral( String intData ){
		int num = Integer.valueOf(intData);
		intData = "";//Reused this as temporary.
		while(num > 0){
			if(num >= 1000-100){
				if(num < 1000){
					intData = intData + "C";
					num += 100;
				}
				intData = intData + "M";
				num -= 1000;
			}else if(num >= 500-100){
				if(num < 500){
					intData = intData + "C";
					num += 100;
				}
				intData = intData + "D";
				num -= 500;
			}else if(num >= 100-10){
				if(num < 100){
					intData = intData + "X";
					num += 10;
				}
				intData = intData + "C";
				num -= 100;
			}else if(num >= 50-10){
				if(num < 50){
					intData = intData + "X";
					num += 10;
				}
				intData = intData + "L";
				num -= 50;
			}else if(num >= 10-1){
				if(num < 10){
					intData = intData + "I";
					num += 1;
				}
				intData = intData + "X";
				num -= 10;
			}else if(num >= 5-1){
				if(num < 5){
					intData = intData + "I";
					num += 1;
				}
				intData = intData + "V";
				num -= 5;
			}else{
				intData = intData + "I";
				num -= 1;
			}
		}
		return intData;
	}
	
	public static void main(String[] args){
		JSON_Parser parse = new JSON_Parser();
		parse.parse("map/test.json");
		//parse.get();
		//System.out.println( parse.getScript() );	
	}
}
