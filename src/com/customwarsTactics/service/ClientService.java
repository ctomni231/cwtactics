package com.customwarsTactics.service;

import com.client.model.object.Player;
import java.util.ArrayList;

/**
 * Service class to remember the local players of a client in a game.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 27.12.2010
 */
public class ClientService
{
    private final ArrayList<Player> controlledPlayers;

    public ClientService( ArrayList<Player> players )
    {
        assert players.size() > 0;

        controlledPlayers = new ArrayList<Player>( players.size() );
        controlledPlayers.addAll(players);
    }

    public boolean isLocalPlayer( Player player )
    {
        return controlledPlayers.contains(player);
    }
}
