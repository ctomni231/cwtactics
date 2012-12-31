package com.cwt.system.jslix.tools;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

public class JSON_Writer extends XML_Parser {

	/** The XML Header for the XML converted file */
	public final String HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	/** The JSON parser used to parse JSON files for values */
	private JSONObject parser;
	/** The Scanner used to convert files into Strings */
	private Scanner scanner;
	/** The JSON script within the system */
	private String script;

	/**
	 * This class sets up a JSON parser ready for parsing using the parse
	 * command
	 */
	public JSON_Writer() {
		super();
		script = "";
	}

	public JSON_Writer(String filename) {
		this();
		parse(filename);
	}

	// TODO: Split this off into a class that can read both XML and JSON files.
	public void parse(String filename) {
		try {
			scanner = new Scanner(finder.getFile(filename));
			script = "";
			while (scanner.hasNext())
				script = script + scanner.nextLine() + "\n";
			parser = new JSONObject(script);

			// Changes the JSON into an XML file in one pass
			parseData(formatXML(XML.toString(parser,
					(new File(filename)).getName())));

		} catch (FileNotFoundException e) {
			System.err.println(e);
		} catch (JSONException e) {
			System.err.println(e);
		}
	}

	public void get() {
		for (int i = 0; i < parser.length(); i++) {
			try {
				System.out.println(parser.names().getString(i));
			} catch (JSONException e) {
				e.printStackTrace();
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
			} else
				writer.addAttribute("data",
						temp.substring(0, data.indexOf("<")), true);
			data = data.substring(data.indexOf(">") + 1);
		}
		System.out.println(writer.getRawXML());
		return writer.getRawXML();
	}

	public static void main(String[] args) {
		JSON_Writer parse = new JSON_Writer();
		parse.parse("map/test.json");
		//parse.get();
		//System.out.println(parse.getScript());
	}
}
