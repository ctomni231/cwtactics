package com.client.logic.status;

import com.client.logic.command.MessageServer;
import com.client.logic.command.commands.ingame.MoveTo;
import com.client.logic.input.Controls;
import com.client.menu.GUI.MapDraw;
import com.client.menu.logic.Menu;
import com.client.menu.logic.buttons.Button;
import com.client.menu.logic.buttons.Button.ButtonType;
import com.client.model.Fog;
import com.client.model.Move;
import com.client.model.Turn;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.data.sheets.Unit_Sheed;

public class Status_Menu implements Status_Interface {	

	public void update(int timePassed, MapDraw map) {

		// TODO remove action and cancel from mapdraw and menu!!
		if( Controls.isActionDown() ){
			switch( Menu.getType() ){

				case UNIT_ROOTMENU :
					
					Button b = Menu.getSelected();
					
					if( b.getType() == ButtonType.NORMAL ){

						MessageServer.send( new MoveTo(map), false);
						if( Move.isTapped() ) ; // send showTapAnimation
													
						Menu.clearList();
						Status.setStatus( Status.Mode.WAIT );	
					}						
					break;
					
				case BUILD_MENU :
					
					//TODO as command logic
					
					Unit_Sheed sh = ((Unit_Sheed) Menu.getSelected().getSheet() );
					Tile property = Menu.getTile();
										
					Unit unit = new Unit( sh , Turn.getPlayer() );
					
					property.setUnit(unit);
					Turn.getPlayer().addUnit(unit);
					
					map.updateMapItem( property.getPosX() , property.getPosY() );
					
					Fog.processFog( unit.getOwner());
					
					Menu.clearList();
					Status.setStatus( Status.Mode.WAIT );	
					break;
					
				case MAP_MENU :

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
                    else if( Menu.getSelected().getSheet().getID().equals("ENDTURN") ){

						Turn.nextTurn();
						
						Menu.clearList();
						Status.setStatus( Status.Mode.WAIT );
					}
					break;
			}
		}
		else if ( Controls.isCancelDown() ){
			
			switch( Menu.getType() ){		
			
				// if you're in the unit root menu, go back to move range
				case UNIT_ROOTMENU :
					Move.resetWay();
					Menu.clearList();
					Status.setStatus( Status.Mode.SHOW_RANGE );
					break;
				
				// in the default case, go back to wait status
				default :
					Menu.clearList();
					Status.setStatus( Status.Mode.WAIT );
			}
		}
	}

}
