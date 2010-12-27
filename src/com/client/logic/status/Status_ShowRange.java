package com.client.logic.status;

import com.customwarsTactics.service.StatusController;
import com.customwarsTactics.logic.states.Status_Interface;
import com.system.input.Controls;
import com.client.menu.GUI.MapDraw;
import com.customwarsTactics.logic.mapController.Range;

/**
 * ShowRange class.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Status_ShowRange implements Status_Interface {

	public void update(int timePassed, MapDraw map ) {
		
		// GO BACK IF CANCEL ISN'T PRESSED DOWN
		if( !Controls.isCancelDown() ){
			Range.clear();
			StatusController.setStatus( StatusController.Mode.WAIT );
		}
	}

}

