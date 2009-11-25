package com.client.menu.logic.buttons;

import com.client.menu.GUI.tools.PixAnimate;
import com.system.data.sheets.Sheet;

public interface Button{

	/**
	  * Returns a single String with a full
	  * information about the button.
	  */
	// Like Buy Entry --> Light tank 
	public String getMainText();

	/**
	  * Returns a single String with a short
	  * information about the button.
	  */
	// Like Buy Entry --> Tank 
	public String getHeadText();

	
	/**
	  * Returns a String with type information
	  * about the button.
	  */
	// Like Buy Entry --> LTANK
	public Sheet getSheet();

	/**
	  * Returns the Icon of the button.
	  */
	// Like Buy Entry --> Animated imageclass , hope it is Pixanimate,
	// from unit type LTANK 
	public PixAnimate getIcon();

}
