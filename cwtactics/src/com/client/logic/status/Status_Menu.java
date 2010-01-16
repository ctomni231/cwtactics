package com.client.logic.status;

import java.util.ArrayList;

import com.client.logic.command.CommandFactory;
import com.client.logic.command.MessageServer;
import com.client.logic.command.commands.ingame.*;
import com.client.logic.input.Controls;
import com.client.menu.GUI.MapDraw;
import com.client.menu.logic.Menu;
import com.client.menu.logic.buttons.*;
import com.client.menu.logic.buttons.Button.ButtonType;
import com.client.model.Fight;
import com.client.model.Move;
import com.client.model.Turn;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.Data;
import com.system.data.script.ScriptFactory;
import com.system.data.script.Trigger_Object;
import com.system.data.script.ScriptLogic.Trigger;
import com.system.data.sheets.Sheet;
import com.system.data.sheets.Unit_Sheed;
import com.system.data.sheets.Weapon_Sheed;
import com.system.log.Logger;

/**
 * Menu status class.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Status_Menu implements Status_Interface {	

	public void update(int timePassed, MapDraw map) {

		// ACTION IS CLICKED
		//
		if( Controls.isActionClicked() ){
			
			// get variables
			Tile startTile = null;
			Tile targetTile = null;
			Unit unit = null;
			Unit apc = null;
			
			if( Move.getWay().size() > 0 ){
				startTile = Move.getStartTile();
				targetTile = Move.getTargetTile();
				unit = startTile.getUnit();
				apc = targetTile.getUnit();
			}
			
			Button selected = Menu.getSelected();
			
			
			// DO ACTION
			switch( Menu.getType() ){

				case UNLOAD_UNITS_MENU :
				case UNLOAD_UNITS_MENU2 :
			
					//Logger.write( selected.getSheet().getID() , Level.NORMAL );
					// if the button isn't a wait button
					if( ! selected.getSheet().getID().equals("WAIT") ){
						UnloadUnitButton button = (UnloadUnitButton) selected;
						
						if( startTile.getUnit() == null ){
							unit = apc;
						}
						
						Menu.createUnloadTargetMenu( unit , button.getUnit() , targetTile );
						return;
					}
					break;
			
				case UNLOAD_TARGETS_MENU :
				case UNLOAD_TARGETS_MENU2 :
			
					UnloadUnitTargetButton button2 = (UnloadUnitTargetButton) selected;
					Unit load = button2.getUnit();
						
					// if you unload the first unit,
					// then move unit
					if( startTile.getUnit() != null ){
						move(null, unit, map);
					}else{
						unit = apc;
					}

					MessageServer.send( CommandFactory.loadUnit( unit , load , false));
					//TODO show move animation
					MessageServer.send( CommandFactory.tileSetUnit( button2.getTile() , load ) );
					MessageServer.send( CommandFactory.unitCanAct( load ,false) );
					MessageServer.send( CommandFactory.unitCanAct( Move.getUnit(),false) );
					MessageServer.send( CommandFactory.processFog() );


					Menu.createUnloadUnitsMenu(targetTile, unit, load);
					if( Menu.getList().size() > 1 ) return;
					break;
			
				// TARGET MENU
				//
				case UNIT_WEAPON_ATTACKMENU :
					
					TargetButton button3 = ( TargetButton ) selected;
					
					// move 
					move(null, unit, map);
					
					// fight
					if( !Move.isTapped() ){
						Fight.battle( targetTile , unit , button3.getWeapon() , button3.getTile() , button3.getUnit() );
					}

					// set wait status to the unit
					MessageServer.send( CommandFactory.unitCanAct(Move.getUnit(),false) );
					MessageServer.send( CommandFactory.processFog() );
					
					break;
					
				// WEAPON CHOICE MENU
				//
				case UNIT_ATTACKMENU :
					
					Weapon_Sheed shs = (Weapon_Sheed) selected.getSheet();
					
					// create menu with targets 
					Menu.createTargetMenu( Move.getTargetTile() , Move.getUnit() , shs );
					
					return;
			
				// UNIT MENU, CALLED AFTER SHOW MOVE RANGE
				//
				case UNIT_ROOTMENU :
					
					if( selected.getType() == ButtonType.SUBMENU_BUTTON ){

						if( Menu.getSelected().getSheet().getID().equals("ATTACK") ){
							Menu.createAttackMenu( Move.getTargetTile() , Move.getUnit() );
						}
						else if( Menu.getSelected().getSheet().getID().equals("UNLOAD") ){
							Menu.createUnloadUnitsMenu( targetTile , unit, null);
						}
						
						// don't do wait status command, 
						// return instantly
						return;
					}
					else{
						
						// move
						if( apc == null ) move(null, unit, map);
						else move(null, apc, map);
							
						// if not tapped, react on selected button
						if( !Move.isTapped() ){
							if( Menu.getSelected().getSheet().getID().equals("LOAD") ){
								MessageServer.send( CommandFactory.loadUnit(apc, Move.getUnit() ,  true ) );
							}
							else if( Menu.getSelected().getSheet().getID().equals("CAPTURE") ){
								MessageServer.send( CommandFactory.captureBuilding(Move.getTargetTile(),Move.getUnit()) );
								if( Move.getTargetTile().getCapPoints() <= ((int) Move.getUnit().sheet().getCaptureValue() * Move.getUnit().getHealth() / 99 ) ){
									Trigger_Object.triggerCall(targetTile, unit);
									ScriptFactory.checkAll( Trigger.BUILDING_CAPTURED );
								}
								MessageServer.send( CommandFactory.unitCanAct(Move.getUnit(),false) );
							}		
							else if( Menu.getSelected().getSheet().getID().equals("HIDE") ){
								MessageServer.send( CommandFactory.hideUnit( Move.getUnit() , true) );
								MessageServer.send( CommandFactory.unitCanAct(Move.getUnit(),false) );
							}		
							else if( Menu.getSelected().getSheet().getID().equals("UNHIDE") ){
								MessageServer.send( CommandFactory.hideUnit( Move.getUnit() ,false) );
								MessageServer.send( CommandFactory.unitCanAct(Move.getUnit(),false) );
							}
						}

						// set wait status to the unit
						MessageServer.send( CommandFactory.unitCanAct(Move.getUnit(),false) );
						MessageServer.send( CommandFactory.processFog() );
					}
					
					break;
					
				// BUILD MENU
				//
				case PROPERTY_MENU :
					
					Unit_Sheed sh = (Unit_Sheed) selected.getSheet();
					Tile property = ((BuildButton) selected).getProperty();
					
					// if you can't pay, do nothing!
					ArrayList<Sheet> list = Data.getRessourceTable();
					for( int i = 0 ; i < list.size() ; i++ ){
						if( property.getOwner().getResourceValue(i) < sh.getCost( list.get(i)) ) return;
					}
					
					// send commands
					MessageServer.send( CommandFactory.buildUnit(property,sh,Turn.getPlayer() ) ); 
					MessageServer.send( CommandFactory.changeResource( true, property.getOwner() , sh.getCostTable() ));
					MessageServer.send( CommandFactory.processFog() );
					
					break;
					
				// MAP CLICK MENU
				//
				case MAP_MENU :

                    if( Menu.getSelected().getSheet().getID().equals("AWDS") )				map.changeType("AWDS");
                    else if( Menu.getSelected().getSheet().getID().equals("AWDR") )			map.changeType("AWDR");
                    else if( Menu.getSelected().getSheet().getID().equals("GRID") ){
                        map.toggleGrid();
                        map.addShake(6, 0);
                        map.addShake(-6, 0);
                        map.addShake(4, 0);
                        map.addShake(-4, 0);
                        map.addShake(2, 0);
                        map.addShake(-2, 0);
                        map.addShake(0, 0);
                        map.setColumn(2);
                    }else if( Menu.getSelected().getSheet().getID().equals("OPTIONS") )		map.setColumn(1);
                    else if( Menu.getSelected().getSheet().getID().equals("ENDTURN") )	    MessageServer.send( CommandFactory.turnEnd() ); //Turn.nextTurn();
                    //else 																	Logger.write( "Status got an unknown button!", Level.WARN );

			}
			
            // clear menu and go back to wait
            changeStatus( Status.Mode.WAIT );
		}
		
		// CANCEL IS CLICKED
		//
		else if ( Controls.isCancelClicked() ){
			
			switch( Menu.getType() ){		
			
				case UNLOAD_TARGETS_MENU : 
				case UNLOAD_TARGETS_MENU2 :
					Menu.createUnloadUnitsMenu( Move.getTargetTile() , Move.getUnit(), null );
					break;
					
				case UNLOAD_UNITS_MENU :
					Menu.createUnitMenu( Move.getUnit() , Move.getTargetTile() );
					break;
					
				case UNLOAD_UNITS_MENU2 :
					//if( Logger.isOn() ) Logger.write( "Unit unloaded allready, undo action not allowed!", Level.NORMAL );
					break;
					
				case UNIT_ATTACKMENU : 
					Menu.createUnitMenu( Move.getUnit() , Move.getTargetTile() );
					break;
					
				case UNIT_WEAPON_ATTACKMENU :
					Menu.createTargetMenu( Move.getTargetTile() , Move.getUnit() , ((TargetButton) Menu.getSelected()).getWeapon() ); 
					break;
					
				// if you're in the unit root menu, go back to move range
				case UNIT_ROOTMENU :
					
					// clear all things from move and menu
					Move.resetWay();
					changeStatus( Status.Mode.SHOW_MOVE );
					break;
				
				// in the default case, go back to wait status
				default :
					changeStatus( Status.Mode.WAIT );
			}
		}
		
	}
	
	private void move( Unit startUnit , Unit targetUnit , MapDraw map ){

		MessageServer.send( CommandFactory.tileSetUnit( Move.getStartTile() , startUnit ) );
        MessageServer.send( CommandFactory.startMoveAnimation() );
        MessageServer.send( CommandFactory.waitAnimation() );
		MessageServer.send( CommandFactory.tileSetUnit( Move.getTargetTile() , targetUnit ) );
		
		// decrease fuel
		MessageServer.send( CommandFactory.decreaseFuel( Move.getUnit() , Move.getCompleteFuel() ));
		
	}
	
	private void changeStatus( Status.Mode status ){
		
		Menu.clearList();
		Status.setStatus( status );
	}
}
