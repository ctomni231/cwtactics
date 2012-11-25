package com.cwt.graphic.tools;

import com.cwt.system.jslix.state.ScreenSkeleton;
import com.engine.Engine;
import com.engine.EngineHolder;

/*
 * MapField.java
 *
 * This class is made to create a map that directly interacts with
 * the JavaScript bridge. Its sole function is to be able to read,
 * display, and use the JavaScript engine to interact with map
 * functions.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 11.25.12
 */
public class MapField extends MovingMenu implements ScreenSkeleton{

	private EngineHolder holder;
	private Engine engine;
	
	public MapField(int locx, int locy, double speed) {
		super(locx, locy, speed);
		// TODO Auto-generated constructor stub
	}
	
	public void loadMap(String jsonMap){
		holder.callFunction(EngineHolder.ENGINE_MODULE.PERSISTENCE, "load", 
				engine.evalExpression(jsonMap));
	}
}
