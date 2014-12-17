package com.jslix.parser;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.jslix.tools.RomanNumeral;

/**
 * JSON_Parser
 *
 * Simple JSON parser class. This class converts JSON files into XML
 * to make parsing of JSON files consistent. It is also fully capable
 * of parsing XML files making it a combination parser.
 *
 * @author <ul><li>Carr, Crecen</li>
 *             <li>Radom, Alexander</li>
 *             <li>Ramirez-Sanchez, Cesar</li></ul>
 * @license Look into "LICENSE" file for further information
 * @version 12.31.12
 */
public class JSON_Parser extends XML_Parser {

	/** The XML Header for the XML converted file */
	public final String HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	/** The XML data attribute Tag for attributes */
	public final String DATA = "data";
	/** The JSON parser used to parse JSON files for values */
	private JSONObject parser;
	/** The Scanner used to convert files into Strings */
	private Scanner scanner;
	/** The JSON script within the system */
	private String script;
	/** Holds the prefix of the file name */
	private String prefix;

	/**
	 * This class sets up a JSON parser ready for parsing. It is capable of parsing
	 * both JSON and XML files.
	 */
	public JSON_Parser() {
		super();
		script = "";
		prefix = "";
	}

	/**
	 * This class sets up a JSON parser ready for parsing. It parses the
	 * JSON document using the filename provided. It is also capable of
	 * parsing XML files
	 * @param filename The file path to the JSON (or XML) file
	 */
	public JSON_Parser(String filename) {
		this();
		parse(filename);
	}
	
	/**
	 * This function parses a JSON document using the filename provided. It
	 * also provides support for parsing XML files.
	 * 
	 * @param filename The file path to the JSON (or XML) file
	 */
	public void parse(String filename) {		
		try {
				
			//Scans all data within the file
			scanner = new Scanner(finder.getFile(filename));
			script = "";
			while (scanner.hasNext())
				script += (scanner.nextLine() + "\n");
			
			//Makes the file suffix to be the first tag
			prefix = new File(filename).getName();
			prefix = prefix.substring(0, prefix.lastIndexOf("."));
				
			if(filename.endsWith(".json") || filename.endsWith(".JSON")){
				// Changes the JSON into an XML file in one pass
				parser = new JSONObject(getScript());
				parseData(formatXML(XML.toString(parser, prefix)));
			}else
				super.parse(filename);	
		} catch (FileNotFoundException e) {
			System.err.println(e);
		} catch (JSONException e) {
			System.err.println(e);
		}
	}

	/**
	 * This function was made to return the raw script of the JSON (or XML) file
	 * 
	 * @return The raw script of the JSON (or XML) file
	 */
	public String getScript() {
		return script;
	}
	
	/**
	 * This function gets the prefix of the file name. It is used by the JSON
	 * Parser to label the first tag. 
	 * @return The file prefix for this file
	 */
	public String getPrefix(){
		return prefix;
	}

	/**
	 * This class takes a solid String of unformatted XML code and converts it
	 * into proper formatted XML code readable by the XML_Parser class.
	 * 
	 * @param data
	 *            A solid block of unreadable XML code from JSONObject
	 * @return A properly formatted XML code
	 */
	private String formatXML(String data) {
		XML_Writer writer = new XML_Writer();
		String temp = "";
		while (data.length() > 0) {
			temp = data.substring(0, data.indexOf(">"));
			if (temp.matches("</.*"))
				writer.endXMLTag();
			else if (temp.charAt(0) == '<') {
				temp = temp.substring(1);
				writer.addXMLTag(temp.matches("\\d.*") ? 
						RomanNumeral.convert(Integer.valueOf(temp)) : temp);
			}else
				writer.addAttribute(DATA, temp.substring(0, data.indexOf("<")), true);
			data = data.substring(data.indexOf(">") + 1);
		}
		return writer.getRawXML();
	}

	/**
	 * The testing function for XML
	 * @param args N/A
	 */
	public static void main(String[] args) {
		JSON_Parser parse = new JSON_Parser();
		parse.parse("map/valid_test.json");
		//System.out.println(parse.getScript());
	}
}
