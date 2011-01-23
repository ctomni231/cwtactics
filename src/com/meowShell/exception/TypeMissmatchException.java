package com.meowShell.exception;

/**
 * Thrown by MeoWObjects if a method or operation is called, but the variable
 * type don't allow the operation on it.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 10.01.2011
 */
public class TypeMissmatchException extends RuntimeException
{
    @Override
    public String toString()
    {
        return "action unavailable on this variable";
    }
}
