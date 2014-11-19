package net.wolfTec.network;

import net.wolfTec.Constants;
import net.wolfTec.actions.ActionData;
import net.wolfTec.utility.Debug;

/**
 *
 */
public class MessageRouter {

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

    /**
     * Parses a message and invokes commands if necessary.
     */
    public void parseMessage (String msg) {
        Debug.logCritical("NotImplementedYetException");
    }

    /**
     * Sends a given action data object into data object and sends it to the game server.
     */
    public void sendMessage (ActionData actionData) {
        Debug.logCritical("NotImplementedYetException");
    }
}
