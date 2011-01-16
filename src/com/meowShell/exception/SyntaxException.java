package com.meowShell.exception;

/**
 * Thrown by the Parser, if the source can't compiled due usage of forbidden,
 * wrong or illegal statements.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 29.12.2010
 */
public class SyntaxException extends RuntimeException
{
    public SyntaxException(){ super(); }
    public SyntaxException( String message ){ super( message ); }
}
