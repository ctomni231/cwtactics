package com.client.logic.status;

import com.client.logic.input.Controls;
import com.client.menu.GUI.MapDraw;
import com.client.model.Range;

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
			Status.setStatus( Status.Mode.WAIT );
		}
	}

}

