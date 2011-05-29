package com.meowRhinoEnv.jsBridges;

import com.meowRhinoEnv.javaBridges.ViewBrigde;
import org.mozilla.javascript.ScriptableObject;

/**
 * UNDER CONSTRUCTION.
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
		return -1;
	}

	@Override
	public String getClassName()
	{
		return "MeowView";
	}

}
