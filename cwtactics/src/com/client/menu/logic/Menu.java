package com.client.menu.logic;

import java.util.ArrayList;

import com.client.menu.logic.buttons.Button;
import com.client.menu.logic.buttons.IconButton;
import com.system.data.Data;

public class Menu {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private static ArrayList<Button> buttons;
	
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	static{
		buttons = new ArrayList<Button>();
	}
	

	
	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	/**
	 * Clears the button list.
	 */
	private static void clearList(){
		buttons.clear();
	}

	/**
	 * Adds a button to the list.
	 */
	private static void addButton( Button b ){
		buttons.add(b);
	}
	
	/**
	 * Closes the building process. 
	 */
	private static void completeList(){
		
		// trim the size of the list to save memory
		buttons.trimToSize();
	}
	
	/**
	 * Returns the list of buttons.
	 */
	public static ArrayList<Button> getList(){
		return buttons;
	}
	
	

	/*
	 *
	 * MENU METHODS
	 * ************
	 * 
	 */
	
	/**
	 * Creates a map menu with
	 * standard options like options,
	 * end turn... 
	 */
	public static void createMapMenu(){
		
		// clear menu
		clearList();
		
		// add buttons
		addButton( new IconButton( Data.getEntrySheet( Data.getIntegerID("ENDTURN")) , "Player" ) );
		
		// complete menu
		completeList();
	}
	
	
	
	/*
	 * 
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
	
	public static void print(){
		
		// print head
		System.out.print("MENU ==> ");
		
		// print all buttons
		for( Button b : Menu.getList() ){
			System.out.print( b.getMainText()+" , " );
		}
		
		// make new line
		System.out.println();
	}
	


}

