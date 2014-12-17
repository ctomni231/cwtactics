package net.wolfTec.network;

import net.wolfTec.Constants;
import net.wolfTec.action.ActionData;
import net.wolfTec.utility.Debug;

/**
 *
 */
public class MessageRouter {

    public static final String LOG = Constants.LOG_MESSAGE_ROUTER;

    /**
     * Id of the game in the connected network session.
     */
    private int gameId = Constants.INACTIVE_ID;

    /**
     * Id of the client in the connected network session.
     */
    private int clientId = Constants.INACTIVE_ID;

    /**
     *
     * @return
     */
    public boolean isActive () {
        return gameId != Constants.INACTIVE_ID;
    }

    /**
     *
     */
    public boolean isHost () {
        return gameId == Constants.INACTIVE_ID || clientId != Constants.INACTIVE_ID;
    }

    public boolean hasMessage () {
    	return false;
    }
    
    /**
     * Parses a message and invokes commands if necessary.
     */
    public ActionData popMessage () {
        Debug.logCritical(LOG, "NotImplementedYetException");
        return null;
    }

    /**
     * Sends a given action data object into data object and sends it to the game server.
     */
    public void sendMessage (ActionData data) {
        Debug.logCritical(LOG, "NotImplementedYetException");
    }
}
