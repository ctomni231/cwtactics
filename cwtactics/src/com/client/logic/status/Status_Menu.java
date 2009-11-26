package com.client.logic.status;

import com.client.logic.command.MessageServer;
import com.client.logic.command.commands.ingame.MoveTo;
import com.client.menu.GUI.MapDraw;
import com.client.menu.logic.Menu;
import com.client.model.Move;

public class Status_Menu implements Status_Interface {	
	
	public void update(int timePassed, MapDraw map) {
		
		// INTO THIS CLASS GOES YOUR MENU CONTROL
		// LOGIC CRECEN , OR THE CALL METHOD FOR YOU LOGIC CLASS :)
		// like this example
		// int action = MyMenuToolClass.updateInput();
		// action is the returned input, 1 if action is clicked and so on..
		
		int action = 0; // 0 = nothing, 1 = ACTION , 2 = CANCEL;
		switch( action ){
		
			// ACTION WAS CLICKED
			case 1 : 
				switch( Menu.getType() ){
					case UNIT_ROOTMENU :
						
						//TODO make logic
						// first check what type is the button
						// and then build subMenu or call Action
						
						// --> if maybe it's call action
						// send move commands
						MessageServer.send( new MoveTo(map), false);
						if( Move.isTapped() ) // send showTapAnimation
						
						// doCommands for the button
							
						break;
				}
				break;
				
			// CANCEL WAS CLICKED
			case 2 :
				switch( Menu.getType() ){
					
					// if you're in the unit root menu, go back to move range
					case UNIT_ROOTMENU :
						Move.resetWay();
						Status.setStatus( Status.Mode.SHOW_RANGE );
						break;
					
					// in the default case, go back to wait status
					default :
						Status.setStatus( Status.Mode.WAIT );
				}
				break;
		}
	}

}
