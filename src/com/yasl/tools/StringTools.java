package com.yasl.tools;


import java.util.ArrayList;
import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Simple collection of string manipulation tools.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 23.01.2011
 */
public class StringTools
{
    public static String[] splitAtChar( String str , char splitter , char mask )
    {
        assertNotNull(str);

        ArrayList<String> parts = new ArrayList<String>();

        int e = str.length();
        int p = 0;
        boolean inMask = false;
        boolean searchPointer = false;
        char c;
        for( int i = 0 ; i < e ; i++ )
        {
            c = str.charAt(i);
            if( c == mask )
            {
                inMask = !inMask;
            }
            else if( c == splitter && !searchPointer && !inMask )
            {
                parts.add( str.substring(p,i) );
                searchPointer = true;
            }
            else if( searchPointer && !inMask )
            {
                p = i;
                searchPointer = false;
            }
        }
        // add last part
        if( !searchPointer )
            parts.add( str.substring(p,str.length()));

        return parts.toArray( new String[0] );
    }

    public static String cutOuterCharacters( String str , char character )
    {
        int hPointer = 0;
        int tPointer = str.length();

        // check head
        int e = str.length();
        for( int i = 0 ; i < e ; i++ )
            if( str.charAt(i) == character )
                hPointer++;
            else break;

        // check tail
        for( int i = str.length()-1 ; i > hPointer ; i-- )
            if( str.charAt(i) == character )
                tPointer--;
            else break;

        return str.substring(hPointer, tPointer);
    }
}
