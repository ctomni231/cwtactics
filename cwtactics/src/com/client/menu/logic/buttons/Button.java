package com.client.menu.logic.buttons;

import com.client.menu.GUI.tools.PixAnimate;
import com.system.data.sheets.Sheet;

public class Button{

	/*
	 *
	 * ENUMERATIONS
	 * ************
	 * 
	 */
	
	public enum ButtonType{
		NORMAL
	}
	
	
	
	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private ButtonType type;
	private String headInformation;
	private Sheet sheet;
	
	
	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Button(ButtonType type, String headInformation, Sheet sheet ) {
		this.type = type;
		this.headInformation = headInformation;
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
	  * Returns a single String with a full
	  * information about the button.
	  */ 
	public String getMainText(){
		return sheet.getName();
	}

	/**
	  * Returns a single String with a short
	  * information about the button.
	  */
	public String getHeadText(){
		return headInformation;
	}

	
	/**
	  * Returns a String with type information
	  * about the button.
	  */
	public Sheet getSheet(){
		return sheet;
	}

	/**
	  * Returns the Icon of the button.
	  */
	public PixAnimate getIcon(){
		// we need to clear out how to access 
		// your MapDraw with images like here, 
		// e.g. return image with LTANK
		return null;
	}

}
