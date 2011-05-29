package com.meowRhinoEnv.javaBridges;

/**
 * Interface for external input controllers. Used by the meow input controller,
 * to listen to external frameworks, that already does input handling like
 * jSlix.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 07.05.2011
 */
public interface SoundBridge
{
	void playMusic( String identifier );
	void playSFX( String identifier );

	void musicVol( double vol );
	void sfxVol( double vol );

	void stopMusic();
}