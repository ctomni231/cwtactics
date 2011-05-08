package com.meowEngine;

import com.yasl.annotation.ParentModulePointer;
import com.yasl.annotation.SubModule;
import java.util.StringTokenizer;
import static com.yasl.assertions.Assertions.*;

/**
 * Network controller class, holds the active connections and controls the
 * flow of the model manipulation data flow.
 *
 * MeowEngine Network Protocol ( MNP )
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 13.02.2011
 */
@SubModule("com.meowEngine.Engine")
public class Network
{
	// network stack operation codes
	public static final int SYNC_PROPERTY	= 0;
	public static final int SYNC_OBJECT		= 1;
	public static final int CALL_FUNCTION	= 2;
	
    private Connection activeConnection;
    private boolean localMode = false;

	@ParentModulePointer
	private Engine engine;

    public Network( Engine engine )
    {
		this.engine = engine;
    }


    /**
     * Sets the active connection of this network controller, de initializes
     * the old connection if necessary.
     *
     * @param connection jFoxConnection instance
     */
    public final void setConnection( Connection connection )
    {
        assertNotNull(connection);

        // clean up old connection
        if( activeConnection != null )
            activeConnection.deInitConnection();

        activeConnection = connection;
        activeConnection.initConnection(this);
    }

    /**
     * Is the network controller in local mode ?
     *
     * @return true if in local mode, else false
     */
    public final boolean inLocalMode()
    {
        return localMode;
    }

    /**
     * Toggles the current active sending mode.
     */
    public final void toogleMode()
    {
        localMode = !localMode;
    }

    /**
     * Sends a message through the active connection to all clients of
     * the game round.
     * 
     * @param message 
     */
    public final void sendMessage( String message )
    {
        assertNotNull(activeConnection);
        assertNotNull(message);

        activeConnection.sendMessage(message);
    }

    /**
     * Should be called by the active connection if an incoming message will
     * be processed. 
     * <br><br>
     * 
     *
     * @param message message from the active connection
     */
    public final void processMessage( String message )
    {
        StringTokenizer tokens = new StringTokenizer(message, ",");
        try
        {
            int amount = tokens.countTokens();

            if( amount < 2 )
                throw new CorruptNetworkMessageException();

            int[] data = new int[amount-1];
            int start = Integer.parseInt( tokens.nextToken() );

            switch( start )
            {
            	/*
            	 * Synchronizes a complete object as root scoped entity
            	 */
            	case SYNC_OBJECT:
            		break;
            	
            	/*
            	 * Synchronizes a property of a root scoped entity
            	 */
            	case SYNC_PROPERTY:

            		break;
            	
            	/*
            	 * Calls a function
            	 */
            	case CALL_FUNCTION:
            		break;
            	
            	default: 
            		throw new CorruptNetworkMessageException("unkown operation code");
            }
        }
        catch( NumberFormatException e )
        {
            throw new CorruptNetworkMessageException( e.getMessage() );
        }
    }

    public static class CorruptNetworkMessageException extends RuntimeException
    {
        public CorruptNetworkMessageException()
        {
            super();
        }

        public CorruptNetworkMessageException( String message )
        {
            super( message );
        }
    }

}
