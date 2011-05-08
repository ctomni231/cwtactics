package com.meowEngine.language.java;

import com.meowEngine.language.brigdes.InputBridge;
import org.mozilla.javascript.ScriptableObject;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 05.05.2011
 */
public class MeowInput extends ScriptableObject
{
	private InputBridge controller;

	public void setController( InputBridge ctr )
	{
		this.controller = ctr;
	}

	public boolean jsFunction_isKeyPressed( int keyCode )
	{
		return controller.isKeyPressed(keyCode);
	}

	public boolean jsFunction_isKeyDown( int keyCode )
	{
		return controller.isKeyDown(keyCode);
	}

	@Override
	public String getClassName()
	{
		return "MeowInput";
	}

}
