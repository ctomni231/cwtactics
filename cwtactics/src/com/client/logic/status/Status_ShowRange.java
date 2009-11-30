package com.client.logic.status;

import com.client.logic.input.Controls;
import com.client.menu.GUI.MapDraw;

public class Status_ShowRange implements Status_Interface {

	public void update(int timePassed, MapDraw map ) {
		
		// if cancel button is no longer pressed down, go back into wait
		if( !Controls.isCancelDown() ){
			Status.setStatus( Status.Mode.WAIT );
		}
	}

}

