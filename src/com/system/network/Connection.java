package com.system.network;

import com.system.CommunicationPipeline;

/**
 * Connection object, used to as communication interface between command
 * pool and the command pusher.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 11.12.2010
 */
public abstract class Connection
{
	/**
	 * Send a message over this network connection.
	 *
	 * @param message message object
	 */
	public abstract void sendMessage( String message );

	/**
	 * This method must be called after an incoming message and invokes the
	 * push process, to push the incomming command into the command pool.
	 * <br><br>
	 * Format: OpCode-Message
	 * <br>The '-' character is only as description character, the message
	 * starts with one char as opCode number with the following characters
	 * as message.
	 *
	 * @param message incoming message string
	 */
	protected final void getMessage( String message )
	{
		assert message != null;

		int opCode = Integer.parseInt( message.substring(0,1) );

		CommunicationPipeline.getInstance().getPool().pushCommand(
            message.substring(1,message.length()),
            opCode
        );
	}
}
