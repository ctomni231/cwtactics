package com.client.logic.status;

import com.client.logic.command.MessageServer;
import com.client.logic.command.commands.ingame.BuildUnit;
import com.client.logic.command.commands.ingame.CaptureBuilding;
import com.client.logic.command.commands.ingame.HideUnit;
import com.client.logic.command.commands.ingame.MoveTo;
import com.client.logic.command.commands.ingame.ProcessFog;
import com.client.logic.command.commands.ingame.UnitCanAct;
import com.client.logic.command.commands.ingame.TurnEnd;
import com.client.logic.input.Controls;
import com.client.menu.GUI.MapDraw;
import com.client.menu.logic.Menu;
import com.client.menu.logic.buttons.TargetButton;
import com.client.model.Fight;
import com.client.model.Move;
import com.client.model.Turn;
import com.client.model.object.Unit;
import com.system.data.sheets.Unit_Sheed;
import com.system.data.sheets.Weapon_Sheed;
import com.system.log.Logger;
import com.system.log.Logger.Level;

public class Status_Menu implements Status_Interface {	

	public void update(int timePassed, MapDraw map) {

		// ACTION IS CLICKED
		//
		if( Controls.isActionClicked() ){
			switch( Menu.getType() ){

				case UNIT_WEAPON_ATTACKMENU :
					
					TargetButton button = ( TargetButton ) Menu.getSelected();
					
					if( !Move.isTapped() ){
						Fight.setupBattle( Move.getTargetTile() , Move.getUnit() , button.getWeapon() , button.getTile() , button.getUnit() );
						Fight.processBattle();
					}
					
					MessageServer.send( new MoveTo(map) );
					
					Menu.clearList();
					Status.setStatus( Status.Mode.WAIT );
					
					break;
					
				// WEAPON CHOICE MENU
				//
				case UNIT_ATTACKMENU :
					
					Weapon_Sheed shs = (Weapon_Sheed) Menu.getSelected().getSheet();
					Menu.clearList();
					Menu.createTargetMenu( Move.getTargetTile() , Move.getUnit() , shs );

					break;
			
				case UNIT_ROOTMENU :
							
					Unit apc = Move.getTargetTile().getUnit();
					
					if( Menu.getSelected().getSheet().getID().equals("WAIT") || Move.isTapped() ){
						MessageServer.send( new MoveTo(map) );
						MessageServer.send( new UnitCanAct(Move.getUnit(),false) );
					}		
					else if( Menu.getSelected().getSheet().getID().equals("CAPTURE") ){
						MessageServer.send( new MoveTo(map) );
						MessageServer.send( new CaptureBuilding(Move.getTargetTile(),Move.getUnit()) );
						MessageServer.send( new UnitCanAct(Move.getUnit(),false) );
					}		
					else if( Menu.getSelected().getSheet().getID().equals("HIDE") ){
						MessageServer.send( new MoveTo(map) );
						MessageServer.send( new HideUnit( Move.getUnit() , true) );
						MessageServer.send( new UnitCanAct(Move.getUnit(),false) );
					}		
					else if( Menu.getSelected().getSheet().getID().equals("UNHIDE") ){
						MessageServer.send( new MoveTo(map) );
						MessageServer.send( new HideUnit( Move.getUnit() ,false) );
						MessageServer.send( new UnitCanAct(Move.getUnit(),false) );
					}		
					else if( Menu.getSelected().getSheet().getID().equals("LOAD") ){
						MessageServer.send( new MoveTo(map) );
						apc.addLoad( Move.getUnit() );
						Move.getTargetTile().setUnit(apc);
					}	
					else if( Menu.getSelected().getSheet().getID().equals("ATTACK") ){
						Menu.clearList();
						Menu.createAttackMenu( Move.getTargetTile() , Move.getUnit() );
						return;
					}	
					
					// go back to status wait
					Menu.clearList();
					Status.setStatus( Status.Mode.WAIT );	
					
					break;
					
				// BUILD MENU
				//
				case BUILD_MENU :
					
					Unit_Sheed sh = ((Unit_Sheed) Menu.getSelected().getSheet() );
					
					// send commands
					MessageServer.send( new BuildUnit(Menu.getTile(),sh,Turn.getPlayer(),map) ); 
					MessageServer.send( new ProcessFog() );
					
					// clear menu and go back to wait
					Menu.clearList();
					Status.setStatus( Status.Mode.WAIT );	
					break;
					
				// MAP CLICK MENU
				//
				case MAP_MENU :

                    if( Menu.getSelected().getSheet().getID().equals("AWDS") )				map.changeType("AWDS");
                    else if( Menu.getSelected().getSheet().getID().equals("AWDR") )			map.changeType("AWDR");
                    else if( Menu.getSelected().getSheet().getID().equals("GRID") )			map.setColumn(2);
                    else if( Menu.getSelected().getSheet().getID().equals("OPTIONS") )		map.setColumn(1);
                    else if( Menu.getSelected().getSheet().getID().equals("ENDTURN") )		MessageServer.send( new TurnEnd() );
                    else 																	Logger.write( "Status got an unknown button!", Level.WARN );
                    
                    // clear menu and go back to wait
                    Menu.clearList();
					Status.setStatus( Status.Mode.WAIT );

                    if( Menu.getSelected().getSheet().getID().equals("AWDS") ){
                        map.changeType("AWDS");

                        Menu.clearList();
						Status.setStatus( Status.Mode.WAIT );
                    }
                    else if( Menu.getSelected().getSheet().getID().equals("AWDR") ){
                    	map.changeType("AWDR");

                        Menu.clearList();
						Status.setStatus( Status.Mode.WAIT );
                    }
                    else if( Menu.getSelected().getSheet().getID().equals("GRID") ){
                        //map.setColumn(2);
                        for(int i = 0; i < 4; i++){
                            map.addShake(6, 0);
                            map.addShake(-6, 0);
                            map.addShake(4, 0);
                            map.addShake(-4, 0);
                            map.addShake(2, 0);
                            map.addShake(-2, 0);
                        }
                        map.addShake(0, 0);

                        Menu.clearList();
						Status.setStatus( Status.Mode.WAIT );
                    }
                    else if( Menu.getSelected().getSheet().getID().equals("OPTIONS") ){
                        map.setColumn(1);

                        Menu.clearList();
						Status.setStatus( Status.Mode.WAIT );
                    }
                    else if( Menu.getSelected().getSheet().getID().equals("ENDTURN") ){

						Turn.nextTurn();
						
						Menu.clearList();
						Status.setStatus( Status.Mode.WAIT );
					}
					break;
			}
		}
		
		// CANCEL IS CLICKED
		//
		else if ( Controls.isCancelDown() ){
			
			switch( Menu.getType() ){		
			
				// if you're in the unit root menu, go back to move range
				case UNIT_ROOTMENU :
					Move.resetWay();
					Menu.clearList();
					Status.setStatus( Status.Mode.SHOW_MOVE );
					break;
				
				// in the default case, go back to wait status
				default :
					Menu.clearList();
					Status.setStatus( Status.Mode.WAIT );
			}
		}
		
		
		
	}
}
