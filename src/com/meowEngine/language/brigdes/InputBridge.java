package com.meowEngine.language.brigdes;

/**
 * Interface for external input controllers. Used by the meow input controller,
 * to listen to external frameworks, that already does input handling like
 * jSlix.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 07.05.2011
 */
public interface InputBridge
{
	boolean isKeyPressed( int code );
	boolean isKeyDown( int code );
}
