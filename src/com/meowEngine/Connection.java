package com.meowEngine;


/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 13.02.2011
 */
public abstract class Connection
{
    private Network controller;

    final void initConnection( Network ctr )
    {
        controller = ctr;
    }

    final void deInitConnection()
    {
        controller = null;
    }

    abstract void sendMessage( String message );
}
