package com.system.data.sheets;

public class Sheet {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private String 	lang_name;
	private String id;

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
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
	
	public String getID() {
		return id;
	}

	public void setID(String id) {
		this.id = id;
	}
	
}

