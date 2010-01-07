package com.client.menu.logic.buttons;

import com.system.data.sheets.Sheet;

public class Button{

	/*
	 *
	 * ENUMERATIONS
	 * ************
	 * 
	 */
	
	public enum ButtonType{
		NORMAL,SUBMENU_BUTTON
	}
	
	
	
	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private ButtonType type;
	private Sheet sheet;
	
	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Button(ButtonType type, Sheet sheet ) {
		this.type = type;
		this.sheet = sheet;
	}
	
	
	
	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	/**
	 * Returns the type of the button.
	 */
	public ButtonType getType(){
		return type;
	}
	
	/**
	  * Returns a String with type information
	  * about the button.
	  */
	public Sheet getSheet(){
		return sheet;
	}


}
