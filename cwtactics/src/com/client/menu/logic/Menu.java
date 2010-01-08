package com.client.menu.logic;

import java.util.ArrayList;

import com.client.menu.logic.buttons.BuildButton;
import com.client.menu.logic.buttons.Button;
import com.client.menu.logic.buttons.TargetButton;
import com.client.menu.logic.buttons.UnloadUnitButton;
import com.client.menu.logic.buttons.UnloadUnitTargetButton;
import com.client.menu.logic.buttons.Button.ButtonType;
import com.client.model.Range;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.Data;
import com.system.data.sheets.Unit_Sheed;
import com.system.data.sheets.Weapon_Sheed;
import com.system.log.Logger;

/**
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Menu {

	/*
	 * ENUMERATIONS
	 * ************
	 */
	
	public enum MenuType{
		
		// MAP MENU
		MAP_MENU,
		OPTIONS_MENU,
		SAVE_MENU,
		GAME_MENU,								
		
		// PROPERTY MENU
		PROPERTY_MENU,																		
		
		// UNIT MENUS
		UNIT_ROOTMENU,
		UNIT_ATTACKMENU,
		UNIT_WEAPON_ATTACKMENU, 
		UNLOAD_TARGETS_MENU,
		UNLOAD_UNITS_MENU,
		UNLOAD_TARGETS_MENU2,
		UNLOAD_UNITS_MENU2 	
	}
	
	
	
	/*
	 * VARIABLES
	 * ********* 
	 */
	
	private static ArrayList<Button> buttons;
	private static int pointer;
	private static MenuType menuType;
	
	

	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	static{
		buttons = new ArrayList<Button>();
	}
	

	
	/*
	 * ACCESS METHODS
	 * **************
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
	
	/**
	 * Returns the menu type.
	 */
	public static MenuType getType(){
		return menuType;
	}
	
	/**
	 * Sets the menu type.
	 */
	public static void setMenuType( MenuType menuType ){
		Menu.menuType = menuType;
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
        addButton( new Button( Button.ButtonType.NORMAL ,  Data.getEntrySheet( "AWDR")) ) ;
        addButton( new Button( Button.ButtonType.NORMAL ,  Data.getEntrySheet( "AWDS")) ) ;
        addButton( new Button( Button.ButtonType.NORMAL ,  Data.getEntrySheet( "GRID")) ) ;
        addButton( new Button( Button.ButtonType.NORMAL ,  Data.getEntrySheet( "OPTIONS")) ) ;
		addButton( new Button( Button.ButtonType.NORMAL ,  Data.getEntrySheet( "ENDTURN")) ) ;
		
		// complete menu
		completeList();
	}
	
	public static void createAttackMenu( Tile tile , Unit unit ){
		
		// clear menu
		clearList();
		setMenuType( MenuType.UNIT_ATTACKMENU );
				
		for( Weapon_Sheed sh : unit.sheet().getAllWeapons() ){
			if( Range.hasWeaponTargets(tile, unit, sh) ) addButton( new Button( Button.ButtonType.NORMAL, sh));
		}
		
		// complete menu
		completeList();
	}

	public static void createTargetMenu( Tile tile , Unit unit , Weapon_Sheed sh ){
		
		// clear menu
		clearList();
		setMenuType( MenuType.UNIT_WEAPON_ATTACKMENU );
				
		Range.clear();
		Range.generateTargets( tile, unit, sh);
		for( Tile target : Range.getTargets() ){
			addButton( new TargetButton( Button.ButtonType.NORMAL , target.getUnit() , sh ) );
		}
		
		// complete menu
		completeList();
	}
	
	public static void createUnitMenu( Unit unit , Tile tile ){
		
		// clear menu
		clearList();
		setMenuType( MenuType.UNIT_ROOTMENU );
		
		/* 
		 * Add buttons
		 * ***********
		 */
		
		if( tile.getUnit() != null && tile.getUnit() != unit ){
				
			// if on the tile is a transport unit which can load this unit
			if( tile.getUnit().sheet().canLoad( unit.sheet() ) ){
				if( tile.getUnit().canLoadUnit(unit) ) addButton( new Button( Button.ButtonType.NORMAL , Data.getEntrySheet( "LOAD")) );
			}
			else{
				Logger.critical("This situation isn't correct!");
			}
		}
		else{

			// if there is a target for the unit
			if( Range.hasUnitTargets(tile, unit) ) addButton( new Button( Button.ButtonType.SUBMENU_BUTTON , Data.getEntrySheet( "ATTACK")) );
			
			// if the unit has loads
			if( unit.hasLoads() ){
				for( Unit load : unit.getLoadedUnits() ){
					if( load.sheet().canUnitUnloaded(tile, unit) ){
						addButton( new Button( Button.ButtonType.SUBMENU_BUTTON , Data.getEntrySheet(  "UNLOAD" )));
						break;
					}
				}
			}
			
			// if you can capture a building
			if( tile.sheet().isCapturable() && unit.sheet().getCaptureValue() > 0  &&
				tile.getOwner() != unit.getOwner() ) addButton( new Button( Button.ButtonType.NORMAL , Data.getEntrySheet( "CAPTURE") ) );
			
			// if you can hide yourself
			if( unit.sheet().canHide() ){
				if( unit.isHidden() ) addButton( new Button( Button.ButtonType.NORMAL , Data.getEntrySheet( "HIDE") ) );
				else addButton( new Button( Button.ButtonType.NORMAL , Data.getEntrySheet( "UNHIDE") ) );
			}
			
			// every unit can perform a wait
			addButton( new Button( Button.ButtonType.NORMAL , Data.getEntrySheet( "WAIT") ) );
			
		}
		
		// complete menu
		completeList();
	}

	public static void createBuildMenu( Tile tile ){
		
		// clear menu
		clearList();
		setMenuType( MenuType.PROPERTY_MENU );
	
		// add buttons
		for( Unit_Sheed sh : tile.sheet().getBuildList() ){
			addButton( new BuildButton( ButtonType.NORMAL , sh , tile)  );
		}
		
		// complete menu
		completeList();
	}
	
	public static void createUnloadUnitsMenu( Tile tile , Unit apc , Unit notInAPC ){
		
		// clear old
		clearList();
		if( Menu.getType() != MenuType.UNLOAD_TARGETS_MENU ) setMenuType( MenuType.UNLOAD_UNITS_MENU );
		else setMenuType( MenuType.UNLOAD_UNITS_MENU2 );
		
		// add place only if the unit can unloaded onto 
		// the place
		for( Unit load : apc.getLoadedUnits() ){
			if( load != notInAPC && apc.sheet().canUnitUnloaded(tile,apc) ) addButton( new UnloadUnitButton( ButtonType.SUBMENU_BUTTON , load.sheet() , load ));
		}
		
		// every unit can perform a wait
		addButton( new Button( Button.ButtonType.NORMAL , Data.getEntrySheet( "WAIT") ) );
		
		// complete
		completeList();
	}
	
	public static void createUnloadTargetMenu( Unit apc , Unit unit , Tile target ){
		
		// clear old
		clearList();
		if( Menu.getType() == MenuType.UNLOAD_UNITS_MENU ) setMenuType( MenuType.UNLOAD_TARGETS_MENU );
		else setMenuType( MenuType.UNLOAD_TARGETS_MENU2 );
		
		// it's not possible that no unload place exist!
		for( Tile place : unit.sheet().getUnloadPlaces(target,apc) ){
			addButton( new UnloadUnitTargetButton( ButtonType.NORMAL , place.sheet() , unit , place));
		}
		
		// complete
		completeList();
	}
	
	
	
	/*
	 * OUTPUT METHODS
	 * **************
	 */
	
	/**
	 * Returns the status of class menu.
	 */
	public static String getStatus(){
		return "MENU :: Have "+buttons.size()+" buttons in the list and list pointer is at position "+pointer;
	}
	
}

