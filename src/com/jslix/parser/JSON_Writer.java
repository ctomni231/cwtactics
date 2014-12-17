package com.jslix.parser;

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
	 * This constructor sets up a JSON object. command
	 */
	public JSON_Writer() {
		obj = new JSONObject();
	}

	/**
	 * This constructor sets up a JSON object as well as a file where the output
	 * will be written.
	 * 
	 * @param filename
	 *            name of the json file to be written. This method will call
	 *            setFileData and so the extension can be omitted.
	 */
	public JSON_Writer(String filename) {
		this();
		setFileData(filename);
	}

	/**
	 * @param file
	 *            File where the output will be written.
	 * @throws IOException
	 *             in case there is a problem creating or accessing the file.
	 */
	public final void setFileData(File file) throws IOException {
		setFileData(file.getCanonicalPath(), file.getName());
	}

	/**
	 * @param path
	 *            String representing the path to a directory
	 * @param filename
	 *            name of the file in such directory.
	 */
	public final void setFileData(String path, String filename) {
		if (!filename.endsWith(".json")) {
			filename += ".json";
		}
		this.file = new File(path + File.separator + filename);
	}

	/**
	 * @param filename
	 *            string representing the filepath to a file.
	 */
	public final void setFileData(String filename) {
		if (!filename.endsWith(".json")) {
			filename += ".json";
		}
		setFileData(".", filename);
	}

	/**
	 * Add a key, value pair to the root of the JSON object.
	 * 
	 * @param key
	 * @param value
	 */
	public void addPair(String key, int value) {
		obj.put(key, value);
	}

	/**
	 * Add a key, value pair to the root of the JSON object.
	 * 
	 * @param key
	 * @param value
	 */
	public void addPair(String key, String value) {
		obj.put(key, value);
	}

	/**
	 * Add a key, value pair to the root of the JSON object. In this case, the
	 * value is a hash-map (represented as a LinkedHashMap).
	 * 
	 * @param key
	 * @param value
	 */
	public void addPair(String key, LinkedHashMap value) {
		obj.put(key, value);
	}

	/**
	 * Add a key, value pair to the root of the JSON object. In this case, the
	 * value is itself an array(represented as a list).
	 * 
	 * @param key
	 * @param value
	 */
	public void addPair(String key, LinkedList value) {
		obj.put(key, value);
	}

	/**
	 * Add a key, value pair to the root of the JSON object. In this case, the
	 * value is itself an array.
	 * 
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
	 * Initialize a list inside this object, you can use this method to create
	 * lists that later can be nested into any part of the JSON object. After
	 * this method is called, you can add elements by using the addValueToList()
	 * methods. Once done, use the finishList() to conclude the list creation
	 * operation.
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
	 * @param value
	 */
	public void addValueToList(int value) {
		this.list.add(value);
	}

	/**
	 * Once you are done using the List embedded into this object, you can call
	 * this method to retrieve it. This method will also unbind the list from
	 * this object and it will return a shallow copy of it. You can use this
	 * copy to keep working on this list even after calling this method.
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
	 * Initialize a hashmap inside this object, you can use this method to
	 * create hashmap that later can be nested into any part of the JSON object.
	 * After this method is called, you can add elements by using the
	 * addValueToMap() methods. Once done, use the finishMap() to conclude the
	 * creation operation.
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
	 * @param key
	 * @param value
	 */
	public void addValueToMap(String key, int value) {
		this.map.put(key, value);
	}

	/**
	 * Once you are done using the HashMap embedded into this object, you can
	 * call this method to retrieve it. This method will also unbind the map
	 * from this object and it will return a shallow copy of it. You can use
	 * this copy to keep working on this hashmap(adding, removing elements) even
	 * after calling this method.
	 */

	public LinkedHashMap finishMap() {
		LinkedHashMap tmp = (LinkedHashMap) (this.map.clone());
		this.map = null;
		return tmp;
	}

	/**
	 * Print to stdout a string in JSON format of the current object.
	 */
	public void print() {
		System.out.println(toString());
	}

	/**
	 * Return a string in JSON format of the current object.
	 */
	public String toString() {
		return obj.toString();
	}

	/**
	 * This method will write the JSON string(unformatted) into a file specified
	 * by the given parameters. If the output file was specified already, this
	 * method will override those parameters, in that case you can call
	 * createFile(boolean overwrite).
	 * 
	 * @param path
	 *            to the directory where the file is stored.
	 * @param filename
	 *            name of the file. Extension can be omitted.
	 * @param overwrite
	 *            if the file already exists, overwrite it?
	 * @return true if the write operation concluded successfully, false
	 *         otherwise.
	 */
	private boolean createFile(String path, String filename, boolean overwrite) {

		setFileData(path, filename);

		try {
			if (file.getParentFile().mkdirs())
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
			out.write(obj.toString());
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

	/**
	 * This method will write the JSON string(unformatted) into a file specified
	 * by the given parameters. In order for this method to work, you need to
	 * either have specified the output file already, or use 
	 * createFile(String path, String filename, boolean overwrite).
	 * 
	 * @param overwrite
	 *            if the file already exists, overwrite it?
	 * @return true if the write operation concluded successfully, false
	 *         otherwise.
	 */
	private boolean createFile(boolean overwrite) {
		return createFile(file.getParent(), file.getName(), overwrite);
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
		writer.addValueToMap("5", tmp3);
		writer.addValueToMap("6", tmp4);
		writer.addValueToMap("9", tmp5);

		writer.addPair("data", writer.finishMap());

		writer.startMap();
		writer.addValueToMap("x", 0);
		writer.addValueToMap("y", 0);
		writer.addValueToMap("ammo", 1);
		writer.addValueToMap("fuel", 10);
		writer.addValueToMap("hp", 30);
		writer.addValueToMap("type", "INFT_OS");
		writer.addValueToMap("owner", 0);
		LinkedHashMap p1u1 = writer.finishMap();

		writer.startMap();
		writer.addValueToMap("x", 1);
		writer.addValueToMap("y", 1);
		writer.addValueToMap("ammo", -1);
		writer.addValueToMap("fuel", 40);
		writer.addValueToMap("hp", 50);
		writer.addValueToMap("type", "INFT_OS");
		writer.addValueToMap("owner", 0);
		LinkedHashMap p1u2 = writer.finishMap();

		writer.startList();
		writer.addValueToList(p1u1);
		writer.addValueToList(p1u2);
		LinkedList p1units = writer.finishList();

		writer.startMap();
		writer.addValueToMap("name", "P1");
		writer.addValueToMap("gold", 2000);
		writer.addValueToMap("team", 1);
		writer.addValueToMap("units", p1units);
		LinkedHashMap p1 = writer.finishMap();

		writer.startMap();
		writer.addValueToMap("x", 3);
		writer.addValueToMap("y", 4);
		writer.addValueToMap("ammo", 1);
		writer.addValueToMap("fuel", 10);
		writer.addValueToMap("hp", 30);
		writer.addValueToMap("type", "INFT_OS");
		writer.addValueToMap("owner", 1);
		LinkedHashMap p2u1 = writer.finishMap();

		writer.startList();
		writer.addValueToList(p2u1);
		LinkedList p2units = writer.finishList();

		writer.startMap();
		writer.addValueToMap("name", "P2");
		writer.addValueToMap("gold", 12000);
		writer.addValueToMap("team", 2);
		writer.addValueToMap("units", p2units);
		LinkedHashMap p2 = writer.finishMap();

		writer.startList();
		writer.addValueToList(p1);
		writer.addValueToList(p2);
		writer.addPair("players", writer.finishList());

		writer.createFile(true);

	}
}
