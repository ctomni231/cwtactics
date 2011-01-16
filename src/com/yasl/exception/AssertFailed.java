package com.yasl.exception;

/**
 * Thrown if a check failed.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 29.12.2010
 */
public class AssertFailed extends RuntimeException
{
    public AssertFailed(){ super(); }
    public AssertFailed( String message ){ super( message ); }
}
