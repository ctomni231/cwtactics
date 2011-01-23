package com.yasl.exception;

/**
 * Not implemented yet exception.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 18.01.2011
 */
public class NotImplementedYetContext extends RuntimeException
{
    @Override
    public String toString()
    {
        return "Method is not completely implemented yet";
    }
}
