package com.customwarsTactics.service;

import com.customwarsTactics.system.commandPipeline.CommandPool;
import com.customwarsTactics.system.network.Connection;

/**
 * Service class, that holds the complete communication system with the command
 * pool, connections and the interpreters.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 12.12.2010
 */
public class CommunicationPipeline
{

    // singleton instance
    private static final CommunicationPipeline INSTANCE = new CommunicationPipeline();

    private final CommandPool pool;
    private Connection connection;

    private CommunicationPipeline(){
        pool = new CommandPool();
    }

    /**
	 * Sends a message over the communication pipeline.
	 *
	 * @param message message that will be send
	 */
    public void sendOverConnection( String message )
    {
        sendOverConnection(message,false);
    }

    /**
	 * Sends a message over the communication pipeline.
	 *
	 * @param message message that will be send
	 * @param locally if true, the message will processed only on the local
	 */
	public void sendOverConnection( String message , boolean locally )
	{
		if( locally )
            getPool().pushCommand(message);
        else
        {
            assert connection != null;

            connection.sendMessage(message);
        }
	}

    /**
     * @return the pool
     */
    public CommandPool getPool()
    {
        return pool;
    }

    /**
     * @param connection the connection to set
     */
    public void setConnection(Connection connection)
    {
        this.connection = connection;
    }
    
    /**
     * Retuns the singleton instance of the singleton class.
     */
    public static CommunicationPipeline getInstance()
    {
        return CommunicationPipeline.INSTANCE;
    }

}
