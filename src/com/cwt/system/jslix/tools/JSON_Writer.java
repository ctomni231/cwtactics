package com.cwt.system.jslix.tools;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.security.AccessControlException;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.Map;

import org.json.simple.JSONObject;

/**
 * JSON_Writer.java
 * 
 * This tool will allos for the creation of JSON files that are compliant with
 * the format used in this project.
 * 
 * @author Cesar Ramirez
 * @license Look into "LICENSE" file for further information
 * @version 12.1.13
 */
public class JSON_Writer {

	/** The JSON file */
	private File file;
	/** The JSON writer */
	private JSONObject obj;

	LinkedHashMap map = new LinkedHashMap();
	LinkedList list = new LinkedList();

	/**
	 * This class sets up a JSON parser ready for parsing using the parse
	 * command
	 */
	public JSON_Writer() {
		obj = new JSONObject();
	}

	/**
	 * @param filename
	 */
	public JSON_Writer(String filename) {
		this();
		setFileData(filename);
	}

	/**
	 * @param file
	 * @throws IOException
	 */
	public final void setFileData(File file) throws IOException {
		setFileData(file.getCanonicalPath(), file.getName());
	}

	/**
	 * @param path
	 * @param filename
	 */
	public final void setFileData(String path, String filename) {
		if (!filename.endsWith(".xml")) {
			filename += ".xml";
		}
		this.file = new File(path + File.separator + filename);
	}

	/**
	 * @param filename
	 */
	public final void setFileData(String filename) {
		if (!filename.endsWith(".xml")) {
			filename += ".xml";
		}
		setFileData(".", filename);
	}

	/**
	 * @param key
	 * @param value
	 */
	public void addPair(String key, String value) {
		obj.put(key, value);
	}

	/**
	 * @param key
	 * @param value
	 */
	public void addPair(String key, LinkedHashMap value) {
		obj.put(key, value);
	}

	/**
	 * @param key
	 * @param value
	 */
	public void addPair(String key, LinkedList value) {
		obj.put(key, value);
	}
	
	/**
	 * @param key
	 * @param value
	 */
	public void addPair(String key, int value) {
		obj.put(key, value);
	}
	
	/**
	 * @param key
	 * @param value
	 */
	public void addPair(String key, Object value) {
		obj.put(key, value.toString());
	}

	/**
	 * @param key
	 * @param value
	 */
	public void addList(String key, String[] value) {
		LinkedList l1 = new LinkedList();
		for (String item : value) {
			l1.add(item);
		}
		obj.put(key, l1);
	}

	/**
	 * @param key
	 * @param values
	 */
	public void addList(String key, LinkedList values) {
		obj.put(key, values);
	}

	/**
	 * @param key
	 */
	public void startList() {
		this.list = new LinkedList();
	}

	/**
	 * @param value
	 */
	public void addValueToList(String value) {
		this.list.add(value);
	}

	/**
	 * @param value
	 */
	public void addValueToList(LinkedHashMap value) {
		this.list.add(value);
	}

	/**
	 * @param value
	 */
	public void addValueToList(LinkedList value) {
		this.list.add(value);
	}

	/**
	 * 
	 */
	public LinkedList finishList() {
		LinkedList tmp = (LinkedList) (this.list.clone());
		this.list = null;
		return tmp;
	}

	/**
	 * @param map
	 */
	public void addMap(Map map) {
		obj.putAll(map);
	}

	/**
	 * 
	 */
	public void startMap() {
		this.map = new LinkedHashMap();
	}

	/**
	 * @param key
	 * @param value
	 */
	public void addValueToMap(String key, String value) {
		this.map.put(key, value);
	}

	/**
	 * @param key
	 * @param value
	 */
	public void addValueToMap(String key, LinkedHashMap value) {
		this.map.put(key, value);
	}

	/**
	 * @param key
	 * @param value
	 */
	public void addValueToMap(String key, LinkedList value) {
		this.map.put(key, value);
	}

	/**
	 * 
	 */
	public LinkedHashMap finishMap() {
		LinkedHashMap tmp = (LinkedHashMap) (this.map.clone());
		this.map = null;
		return tmp;
	}

	/**
	 * 
	 */
	public void print() {
		System.out.println(obj);
	}

	/**
	 * @param path
	 * @param filename
	 * @param data
	 * @param overwrite
	 * @return
	 */
	private boolean createFile(String path, String filename, String data,
			boolean overwrite) {

		setFileData(path, filename);

		try {
			if (file.mkdirs())
				System.out.println("Directories Created! " + path);
			else
				System.out.println("Directories Failed! " + path);

			if (file.createNewFile())
				System.out.println("File Created! " + path + filename);
			else {
				System.out.println("File Exists!"
						+ (overwrite ? "Overwriting!" : "") + path + filename);
				if (!overwrite)
					return false;
			}

			FileWriter newWrite = new FileWriter(file);
			BufferedWriter out = new BufferedWriter(newWrite);
			out.write(data);
			out.close();

		} catch (IOException e) {
			System.err.println("File IOException! " + path + filename);
			return false;
		} catch (AccessControlException e) {
			System.err.println("Applet Active, can't Access! " + path
					+ filename);
			return false;
		}

		return true;
	}

	public static void main(String[] args) {
		JSON_Writer writer = new JSON_Writer("map" + File.separator
				+ "testmap_copy.json");
		writer.addPair("mapWidth", 10);
		writer.addPair("mapHeight", 10);
		writer.addPair("filler", "PLIN");

		writer.startMap();
		writer.addValueToMap("3", "MNTN");
		writer.addValueToMap("4", "MNTN");
		LinkedHashMap tmp1 = writer.finishMap();

		writer.startMap();
		writer.addValueToMap("7", "FRST");
		writer.addValueToMap("8", "FRST");
		writer.addValueToMap("9", "FRST");
		LinkedHashMap tmp2 = writer.finishMap();

		writer.startMap();
		writer.addValueToMap("2", "MNTN");
		LinkedHashMap tmp3 = writer.finishMap();

		writer.startMap();
		writer.addValueToMap("2", "HQ");
		LinkedHashMap tmp4 = writer.finishMap();

		writer.startMap();
		writer.addValueToMap("5", "FRST");
		LinkedHashMap tmp5 = writer.finishMap();

		writer.startMap();
		writer.addValueToMap("1", tmp1);
		writer.addValueToMap("2", tmp2);
		
		writer.addPair("data", writer.finishMap());

		writer.print();

	}
}
