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

public class JSON_Writer {

	/** The JSON file */
	private File file;
	/** The JSON writer */
	private JSONObject obj;

	LinkedHashMap<String, String> map = new LinkedHashMap<String, String>();
	String listKey;
	LinkedList<String> list = new LinkedList<String>();

	/**
	 * This class sets up a JSON parser ready for parsing using the parse
	 * command
	 */
	public JSON_Writer() {
		obj = new JSONObject();
	}

	public JSON_Writer(String filename) {
		this();
		setFileData(filename);
	}

	public final void setFileData(File file) throws IOException {
		setFileData(file.getCanonicalPath(), file.getName());
	}

	public final void setFileData(String path, String filename) {
		if (!filename.endsWith(".xml")) {
			filename += ".xml";
		}
		this.file = new File(path + File.separator + filename);
	}

	public final void setFileData(String filename) {
		if (!filename.endsWith(".xml")) {
			filename += ".xml";
		}
		setFileData(".", filename);
	}

	public void addPair(String key, String value) {
		obj.put(key, value);
	}

	public void addList(String key, String[] value) {
		LinkedList<String> l1 = new LinkedList<String>();
		for (String item : value) {
			l1.add(item);
		}
		obj.put(key, l1);
	}

	public void addList(String key, LinkedList<String> values) {
		obj.put(key, values);
	}

	public void startList(String key) {
		this.listKey = key;
		this.list = new LinkedList<String>();
	}

	public void addValueToList(String value) {
		this.list.add(value);
	}

	public void finishList() {
		this.addList(this.listKey, (LinkedList<String>) (this.list.clone()));
		this.listKey = null;
		this.list = null;
	}

	public void addMap(Map map) {
		obj.putAll(map);
	}

	public void startMap() {
		this.map = new LinkedHashMap<String, String>();
	}

	public void addValueToMap(String key, String value) {
		this.map.put(key, value);
	}

	public void finishMap() {
		this.addMap((LinkedHashMap<String, String>) (this.map.clone()));
		this.map = null;
	}

	public void print() {
		System.out.println(obj);
	}

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

}
