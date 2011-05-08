package com.meowEngine.language.java;

import com.meowEngine.language.brigdes.ViewBrigde;
import org.mozilla.javascript.ScriptableObject;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 05.05.2011
 */
public class MeowView extends ScriptableObject
{
	private ViewBrigde controller;

	public void setController( ViewBrigde ctr )
	{
		this.controller = ctr;
	}

	public int jsFunction_screenX()
	{
		return controller.screenX();
	}

	public int jsFunction_screenY()
	{
		return controller.screenY();
	}

	public int jsFunction_mapX()
	{
		return controller.mapX();
	}

	public int jsFunction_mapY()
	{
		return controller.mapX();
	}

	public int jsFunction_screenWidth()
	{
		return controller.screenWidth();
	}

	public int jsFunction_screenHeight()
	{
		return controller.screenHeight();
	}

	public void jsFunction_setScreenPos( int x , int y , int mode )
	{
		controller.setScreenPos(x, y, mode);
	}

	public void jsFunction_invokeEffect( int id , Object... args )
	{
		controller.invokeEffect(id, args);
	}

	@Override
	public String getClassName()
	{
		return "MeowView";
	}

}
