package com.customwarsTactics.logic.states;

import com.client.menu.GUI.MapDraw;

public interface Status_Interface {

	/**
	 * Updates the logic.
	 */
	public void update( int timePassed , MapDraw map );
}

