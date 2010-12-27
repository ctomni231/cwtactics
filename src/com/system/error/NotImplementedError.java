package com.system.error;

/**
 * Error type to show prototype methods.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 27.12.2010
 */
public class NotImplementedError extends RuntimeException
{

    public NotImplementedError( String message )
    {
        super(message);
    }

    public NotImplementedError()
    {
        super();
    }
}
