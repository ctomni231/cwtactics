package com.cwt.system.logger;

import com.cwt.system.commandPipeline.CommandPoolListener;

/**
 * Simple debugger for a communication pipeline.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 12.12.2010
 */
public class SimpleCommandStackDebugger implements CommandPoolListener
{

    private String consoleString;

    public SimpleCommandStackDebugger( String consoleString )
    {
        assert consoleString != null;

        this.consoleString = consoleString;
    }

	@Override
    public void messagePushed(String message)
    {
        System.out.println( new StringBuilder( consoleString )
                .append(" command pushed: ")
                .append(message)
                .toString() );
    }

	@Override
    public void messagePopped(String message)
    {
        System.out.println( new StringBuilder( consoleString )
                .append(" command popped: ")
                .append(message)
                .toString() );
    }

}
