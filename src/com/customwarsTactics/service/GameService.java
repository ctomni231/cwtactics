package com.customwarsTactics.service;

import com.system.error.NotImplementedError;

/**
 * Game service class is the central point of a complete game round. This
 * singleton provides support and access for different logic controllers
 * and service classes.
 * <br><br>
 * Any game that will be started on the custom wars tactics engine, must
 * be registered here.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 27.12.2010
 */
public class GameService
{

    private static GameService activeGame;
    private static final IDController idService = new IDController();
    private final ClientService localClients;

    public GameService( ClientService localClients )
    {
        assert localClients != null;

        this.localClients = localClients;
    }

    /**
     * Starts a new game.
     */
    static void startGame()
    {
        assert !isGameActive();
        
        //TODO
        throw new NotImplementedError();
    }

    /**
     * Returns the current active game.
     *
     * @return GameService instance that is active
     */
    static GameService getActiveGame()
    {
        assert isGameActive();

        return activeGame;
    }

    /**
     * @return true if game is active, else false
     */
    static boolean isGameActive()
    {
        return activeGame != null;
    }

    /**
     * @return the localClients
     */
    public ClientService getLocalClients()
    {
        return localClients;
    }

    /**
     * @return the idService
     */
    public static IDController getIdService()
    {
        return idService;
    }

 }
