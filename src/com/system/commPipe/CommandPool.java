package com.system.commPipe;

import java.util.ArrayList;
import java.util.Vector;

/**
 * Simple command service class, that provides the services
 * to add commands and retrieve them later.
 * This pool uses a priority based FIFO strategy.
 * <br>
 * This command pool supports 3 levels of priority.<br>
 * <br>
 * Execution: <br>
 * 1. CRITICAL_PRIORITY <br>
 * 2. HIGH_PRIORITY <br>
 * 3. LOW_PRIORITY <br>
 * <br>
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 12.12.2010
 */
public final class CommandPool
{
    // operation codes
    public static final int LOW_PRIORITY = 0;
    public static final int HIGH_PRIORITY = 1;
    public static final int CRITICAL_PRIORITY = 2;
    public static final int START_SIZE = 20;
    public static final int INCREAMENT_SIZE = 10;

    private final Vector<String>[] stacks;
	private final ArrayList<CommandPoolListener> listeners;

    public CommandPool()
	{
		super();

		listeners = new ArrayList<CommandPoolListener>();

		// initialize stacks
		stacks = new Vector[]{
            new Vector<String>( START_SIZE , INCREAMENT_SIZE ),
            new Vector<String>( START_SIZE , INCREAMENT_SIZE ),
			new Vector<String>( START_SIZE , INCREAMENT_SIZE )
        };
	}

    /**
	 * Adds a command to the command stack with LOW priority.
	 *
	 * @param cmd command object
	 */
	public final void pushCommand( String cmd )
	{
		pushCommand(cmd,LOW_PRIORITY);
	}

    /**
	 * Adds a command to the command stack
	 *
	 * @param opCode operation code for the strategy
	 * @param cmd command object
	 */
	public final void pushCommand( String cmd , int opCode )
	{
		assert cmd != null;
		assert isCorrectOpCode(opCode);

		stacks[opCode].add(cmd);

        // notice listeners for event
        for( int i = 0 ; i < listeners.size() ; i++ )
            listeners.get(i).messagePushed( cmd );
	}

	/**
	 * Returns true if stack from the stacks is empty, else false.
	 */
	public final boolean isEmpty()
	{
        for( int i = 0 ; i < stacks.length ; i++ )
            if( !stacks[i].isEmpty() )
                return false;

		return true;
	}

    /**
	 * Returns the next command from the pool. This pop method follows the
     * rule of higher priority commands poppes first than lower ones.
	 *
	 * @return next available command string from pool
	 * @throws UnsupportedOperationException if pool is empty
	 */
	public final String popCommand()
	{
        int opCode = -1;

        if( !stacks[CRITICAL_PRIORITY].isEmpty() )
            opCode = CRITICAL_PRIORITY;
		else if( !stacks[HIGH_PRIORITY].isEmpty() )
            opCode = HIGH_PRIORITY;
		else if( !stacks[LOW_PRIORITY].isEmpty() )
            opCode = LOW_PRIORITY;
		else
			throw new UnsupportedOperationException("Error, can't return next "+
													"command, command pool is "+
													"empty");

        assert opCode != -1;
        
        return popCommand( opCode );
    }

	/**
	 * Returns the next command from the pool.
	 *
	 * @param opCode operation code
	 * @return next available command string from pool
	 * @throws IllegalArgumentException if incorrect
	 */
	public final String popCommand( int opCode )
	{
		assert isCorrectOpCode(opCode);
        assert stacks[opCode].size() > 0 :
            new StringBuilder("incorrect argument,").append(" the stack id:")
                    .append(opCode).append(" is empty").toString();

        String cmd = stacks[opCode].remove(0);
        
        // notice listeners for event
        for( int i = 0 ; i < listeners.size() ; i++ )
            listeners.get(i).messagePopped( cmd );

		return cmd;
	}

	/**
	 * Checks the a index number, returns true if correct, else false.
	 */
	public final boolean isCorrectOpCode( int i )
	{
		return ( i >= LOW_PRIORITY && i <= CRITICAL_PRIORITY )? true : false;
	}

	/**
	* Adds a listener to the service.
	*/
   public void addListener( CommandPoolListener listener )
   {
	   assert listener != null;
       assert !listeners.contains(listener);

	   listeners.add(listener);
   }

   /**
	* Removes a listener from the service.
	*/
   public void removeListener( CommandPoolListener listener )
   {
	   assert listener != null;
       assert listeners.contains(listener);

	   listeners.remove(listener);
   }


   @Override
   public String toString()
   {
	   return new StringBuilder("CommandPool Size is ").
	   		append( stacks[0].size()+stacks[1].size()+stacks[2].size() ).
			toString();
   }
}
