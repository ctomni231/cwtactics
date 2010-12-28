package com.cwt.system.commandPipeline;

/**
 * Command pool interface, used to define listerners that listen
 * push and pop events in the command pool.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 10.12.2010
 */
public interface CommandPoolListener
{

   /**
	* Invoked if a message is being pushed into a pool.
	*
	* @param message
	*/
   void messagePushed( String message );

   /**
    * Invoked if a message is being popped from a pool.
    *
    * @param message
    */
   void messagePopped( String message );
}
