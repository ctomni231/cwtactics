package com.yasl.assertions;

/**
 * Predefined service methods, to produce understandable assertion error
 * messages.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 29.12.2010
 */
public abstract class AssertionMessages
{
    public static String objectIsntInCollection( Object c )
    {
        return new StringBuilder(c.toString())
                .append(" is not in the collection")
                .toString();
    }
}
