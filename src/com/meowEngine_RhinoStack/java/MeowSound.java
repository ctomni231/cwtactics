package com.meowEngine_RhinoStack.java;

import com.meowEngine_RhinoStack.brigdes.SoundBridge;
import org.mozilla.javascript.ScriptableObject;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 05.05.2011
 */
public class MeowSound extends ScriptableObject
{
	private SoundBridge controller;

	public void setController( SoundBridge ctr )
	{
		this.controller = ctr;
	}

	public void jsFunction_setMusicVolume( float vol )
	{
		controller.musicVol(vol);
	}

	public void jsFunction_playMusic( String key )
	{
		controller.playMusic( key );
	}

	public void jsFunction_stopMusic()
	{
		controller.stopMusic();
	}

	public void jsFunction_setSFXVolume( float vol )
	{
		controller.sfxVol(vol);
	}

	public void jsFunction_playSFX( String key )
	{
		controller.playSFX( key );
	}

	@Override
	public String getClassName()
	{
		return "MeowInput";
	}

}
