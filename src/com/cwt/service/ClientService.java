package com.cwt.service;

import com.cwt.model.mapObjects.Player;
import static com.cwt.system.error.ErrorMessages.*;
import java.util.ArrayList;

/**
 * Service class to remember the local players of a client in a game.
 * <br><br>
 * NOTE:: This class is a first prototype for the new error messages class.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 27.12.2010
 */
public class ClientService
{
    private final ArrayList<Player> controlledPlayers;
    private int lastIndex;

    public ClientService( ArrayList<Player> players )
    {
        assert players != null : printError( ARGUMENT_NULL_POINTER );
        assert players.size() > 0 : printError( ARGUMENT_ILLEGAL , players );

        controlledPlayers = new ArrayList<Player>( players.size() );
        controlledPlayers.addAll(players);
    }

    /**
     * Is a player an instance on this client.
     *
     * @param player player instance
     * @return true if the player plays on this client, else false
     */
    public boolean isLocalPlayer( Player player )
    {
        assert player != null : printError( ARGUMENT_NULL_POINTER );
        
        return controlledPlayers.contains(player);
    }

    /**
     * Indexes a player as the active player on this client.
     *
     * @param player player instance
     */
	public void indexPlayer( Player player )
    {
        assert player != null : printError( ARGUMENT_NULL_POINTER );
        assert controlledPlayers.contains( player ) : printError( NOT_COLLECTED , player );

        lastIndex = controlledPlayers.indexOf( player );
	}

    /**
	 * Returns the current player of this client.
	 */
	public Player getIndexedPlayer() 
    {
        assert lastIndex >= 0 && lastIndex < controlledPlayers.size() : printIndexError(lastIndex);

		return controlledPlayers.get(lastIndex);
	}
}
