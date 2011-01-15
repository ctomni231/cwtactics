package com.client.menu.logic.buttons;

import com.system.data.sheets.Sheet;

/**
 * Class Button holds information
 * for a button instance in the menu.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Button{

	/*
	 * ENUMERATIONS
	 * ************
	 */
	
	/**
	 * Button types.
	 */
	public enum ButtonType{
		NORMAL,SUBMENU_BUTTON
	}
	
	
	
	/*
	 * VARIABLES
	 * *********
	 */
	
	private ButtonType type;
	private Sheet sheet;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************ 
	 */
	
	public Button(ButtonType type, Sheet sheet ) {
		this.type = type;
		this.sheet = sheet;
	}
	
	
	
	/*
	 * ACCESS METHODS
	 * **************
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
