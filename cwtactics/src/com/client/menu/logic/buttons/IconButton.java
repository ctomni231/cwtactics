package com.client.menu.logic.buttons;

import com.client.menu.GUI.tools.PixAnimate;
import com.system.data.sheets.Sheet;

public class IconButton implements Button {


	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private Sheet typeSheet;
	private String head;
	
	
	
	/*
	 *
	 * CONSTRUCTOR
	 * ***********
	 * 
	 */
	
	public IconButton( Sheet sh , String head ){
		this.typeSheet = sh;
		this.head = head;
	}
	
	
	
	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	public Sheet getSheet() {
		return typeSheet;
	}

	public String getHeadText() {
		return head;
	}
	
	public String getMainText() {
		return typeSheet.getName();
	}

	public PixAnimate getIcon() {
		//TODO --> Return image
		return null;
	}
	
	 

}

