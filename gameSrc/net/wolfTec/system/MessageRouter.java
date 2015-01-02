package net.wolfTec.system;

import net.wolfTec.Constants;
import net.wolfTec.action.ActionData;

/**
 *
 */
public class MessageRouter {

	public static boolean	$BEAN			= true;
	public static Logger	$LOG;

	/**
	 * Id of the game in the connected network session.
	 */
	private int						gameId		= Constants.INACTIVE_ID;

	/**
	 * Id of the client in the connected network session.
	 */
	private int						clientId	= Constants.INACTIVE_ID;

	/**
	 *
	 * @return
	 */
	public boolean isActive() {
		return gameId != Constants.INACTIVE_ID;
	}

	/**
     *
     */
	public boolean isHost() {
		return gameId == Constants.INACTIVE_ID || clientId != Constants.INACTIVE_ID;
	}

	public boolean hasMessage() {
		return false;
	}

	/**
	 * Parses a message and invokes commands if necessary.
	 */
	public ActionData popMessage() {
		$LOG.error("NotImplementedYetException");
		return null;
	}

	/**
	 * Sends a given action data object into data object and sends it to the game
	 * server.
	 */
	public void sendMessage(ActionData data) {
		$LOG.error("NotImplementedYetException");
	}
}
