package com.cwt.system.jslix.tools;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

/**
 * JSON_Parser
 *
 * Simple JSON parser class. This class converts JSON files into XML
 * to make parsing of JSON files consistent.
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
	/** The JSON parser used to parse JSON files for values */
	private JSONObject parser;
	/** The Scanner used to convert files into Strings */
	private Scanner scanner;
	/** The JSON script within the system */
	private String script;

	/**
	 * This class sets up a JSON parser ready for parsing
	 */
	public JSON_Parser() {
		super();
		script = "";
	}

	/**
	 * This class sets up a JSON parser ready for parsing. It parses the
	 * JSON document using the filename provided
	 * @param filename The file path to the JSON file
	 */
	public JSON_Parser(String filename) {
		this();
		parse(filename);
	}
	
	/**
	 * This function parses a JSON document using the filename provided. It
	 * also provides support for parsing XML files.
	 * 
	 * @param filename The file path to the JSON file
	 */
	public void parse(String filename) {
		if(filename.endsWith(".xml") || filename.endsWith(".jnlp"))
			super.parse(filename);
		else{
			try {
				script = "";
				
				//Concats the file suffix to be the first tag
				String temp = new File(filename).getName();
				temp = temp.substring(0, temp.lastIndexOf("."));
				
				scanner = new Scanner(finder.getFile(filename));
				while (scanner.hasNext())
					script = script + scanner.nextLine() + "\n";
				parser = new JSONObject(getScript());
				
				// Changes the JSON into an XML file in one pass
				parseData(formatXML(XML.toString(parser, temp)));
			} catch (FileNotFoundException e) {
				System.err.println(e);
			} catch (JSONException e) {
				System.err.println(e);
			}
		}		
	}

	/**
	 * This function was made to return the raw script of the JSON file
	 * 
	 * @return The raw script of the JSON file
	 */
	public String getScript() {
		return script;
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
				writer.addXMLTag(temp.matches("\\d.*") ? RomanNumeral
						.convertToRomanNumeral(temp) : temp);
			}else
				writer.addAttribute("data",
						temp.substring(0, data.indexOf("<")), true);
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
