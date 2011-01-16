package com.meowShell.exception;

/**
 * Thrown by MeoWObjects if a method or operation is called, but the variable
 * type don't allow the operation on it.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 10.01.2011
 */
public class OperationTypeMissmatchException extends RuntimeException
{
    public OperationTypeMissmatchException(){ super(); }
    public OperationTypeMissmatchException( String message ){ super( message ); }
}
