package com.system.network;

/**
 * Local connection, used for campaign and skirmish matches.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 12.12.2010
 */
public class LocalConnection extends Connection
{

    @Override
    public void sendMessage(String message)
    {
        getMessage(message);
    }

}
