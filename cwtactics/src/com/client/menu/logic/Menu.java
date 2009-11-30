package com.client.menu.logic;

import java.util.ArrayList;

import com.client.menu.logic.buttons.Button;
import com.client.menu.logic.buttons.Button.ButtonType;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.Data;
import com.system.data.sheets.Unit_Sheed;

public class Menu {

	/*
	 *
	 * ENUMERATIONS
	 * ************
	 * 
	 */
	
	public enum MenuType{
		MAP_MENU,OPTIONS_MENU,SAVE_MENU,GAME_MENU,								// MAP MENUS
		BUILD_MENU,																// PROPERTY MENUS
		UNIT_ROOTMENU,UNIT_ATTACKMENU,UNLOAD_TARGETS_MENU,UNLOAD_UNITS_MENU		// UNIT MENUS
	}
	
	
	
	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private static ArrayList<Button> buttons;
	private static int pointer;
	private static Tile tile; // from which tile is the menu called from ?
	private static MenuType menuType;
	
	

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
	public static void clearList(){
		buttons.clear();
		setPointer(0);
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
	
	/**
	 * Returns the current selected button.
	 */
	public static Button getSelected(){
		if( buttons.size() == 0 ) return null;
		return buttons.get(pointer);
	}

	/**
	 * Increases the pointer if possible.
	 */
	public static void increasePointer(){
		if( pointer < buttons.size() -1 ) pointer++;
	}
	
	/**
	 * Decreases the pointer if possible.
	 */
	public static void decreasePointer(){
		if( pointer > 0 ) pointer--;
	}
	
	/**
	 * Sets the pointer if possible.
	 */
	public static void setPointer( int value ){
		pointer = value;
	}
	
	public static MenuType getType(){
		return menuType;
	}
	
	public static void setMenuType( MenuType menuType ){
		Menu.menuType = menuType;
	}
	
	public static void setTile( Tile tile ){
		Menu.tile = tile;
	}
	
	public static Tile getTile(){
		return tile;
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
		setMenuType( MenuType.MAP_MENU );
		
		// add buttons
		addButton( new Button( Button.ButtonType.NORMAL ,  Data.getEntrySheet( Data.getIntegerID("ENDTURN")) ) );
		
		// complete menu
		completeList();
	}
	
	public static void createUnitMenu( Unit unit , Tile tile ){
		
		// clear menu
		clearList();
		setMenuType( MenuType.UNIT_ROOTMENU );
		
		// add buttons
		if( tile.sheet().isCapturable() && unit.sheet().getCaptureValue() > 0  &&
			tile.getOwner() != unit.getOwner() ) addButton( new Button( Button.ButtonType.NORMAL , Data.getEntrySheet( Data.getIntegerID("CONQUER")) ) );
		addButton( new Button( Button.ButtonType.NORMAL , Data.getEntrySheet( Data.getIntegerID("WAIT")) ) );
		
		// complete menu
		completeList();
	}

	public static void createBuildMenu( Tile tile ){
		
		// clear menu
		clearList();
		setMenuType( MenuType.BUILD_MENU );
		
		setTile(tile);
		
		// add buttons
		for( Unit_Sheed sh : tile.sheet().getBuildList() ){
			addButton( new Button( ButtonType.NORMAL , sh )  );
		}
		
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
			System.out.print( b.getSheet().getName()+" , " );
		}
		
		// make new line
		System.out.println();
	}
	


}

