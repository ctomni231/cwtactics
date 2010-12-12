package com.system.logger;

import com.system.commPipe.CommandPoolListener;

/**
 * Simple debugger for a communication pipeline.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 12.12.2010
 */
public class SimpleDebugger implements CommandPoolListener
{

	@Override
    public void messagePushed(String message)
    {
        System.out.println( new StringBuilder("COMMAND PUSHED => ").append(message).toString() );
    }

	@Override
    public void messagePopped(String message)
    {
        System.out.println( new StringBuilder("COMMAND POPPED => ").append(message).toString() );
    }

}
