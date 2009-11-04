package com.system.data.sheets;

public class Sheet {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private String 	lang_name;

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
	
}

