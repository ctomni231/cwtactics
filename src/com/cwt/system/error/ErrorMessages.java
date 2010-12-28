package com.cwt.system.error;

/**
 * Messages used for assertion descriptions.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 27.12.2010
 */
public enum ErrorMessages
{
    /*
     * Possible problems...
     */

    ARGUMENT_NULL_POINTER("argument is a null pointer"),
    ARGUMENT_ILLEGAL("argument is illegal and not useable"),
    NOT_COLLECTED("object should be in this object, but it isn't"),
    IS_COLLECTED("object shouldn't be in this object, but it is"),
    CONNECTION_CRASHED(""),
    INDEX_FAULT("index parameter isn't legal");


    /*
     * Error message structure
     */

    public String message;

    private ErrorMessages( String message )
    {
        this.message = message;
    }

    @Override
    public String toString()
    {
        return message;
    }


    /*
     * Description methods for assertions and errors
     */

    public static String printError( ErrorMessages message )
    {
        return message.toString();
    }

    public static String printIndexError( int index )
    {
        return new StringBuilder( INDEX_FAULT.toString() )
                        .append(" :: caused by index ")
                        .append( index )
                        .toString();
    }

    public static String printError( ErrorMessages message , Object causedBy )
    {
        return new StringBuilder( message.toString() )
                        .append(" :: caused by ")
                        .append( causedBy )
                        .toString();
    }
}
