package com.system.data.sheets;

/**
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Sheet {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private String 	lang_name;
	private String id;

	
	
	/*
	 * ACCESSING METHODS
	 * *****************
	 */

	/**
	 * Returns the name of the object type
	 */
	public String getName() {
		return lang_name;
	}

	/**
	 * Sets the name of the object type
	 */
	public void setName(String langName) {
		lang_name = langName;
	}
	
	/**
	 * Returns the ID code of this sheet.
	 */
	public String getID() {
		return id;
	}
	
	/**
	 * Sets the ID code of this sheet.
	 */
	public void setID(String id) {
		this.id = id;
	}
	
}

