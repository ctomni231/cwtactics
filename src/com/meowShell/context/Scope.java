package com.meowShell.context;

import com.meowShell.variables.MeoWObject;
import static com.yasl.assertions.Assertions.*;

/**
 * Scope object, service to provide a global array for variables.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 15.01.2011
 */
public class Scope
{
    private final int INCREAMENT_SIZE = 10;
    private MeoWObject[] globalVariables;
    private int[] hashValues;

    /**
     * Returns a variable from the global scope.
     *
     * @param posID position of the variable
     * @return object at the position
     */
    public final MeoWObject getVar( int posID )
    {
        asserInRange(posID, 0 , globalVariables.length-1 );

        return globalVariables[posID];
    }

    /**
     * Sets a global variable in the scope.
     *
     * @param posID position of variable
     * @param object object that will be set in the global scope
     */
    public final void setVar( int posID , MeoWObject object )
    {
        assertNotNull(object); // for null exists a NoneVariable object
        asserInRange(posID, 0 , globalVariables.length-1 );

        globalVariables[posID] = object;
    }

    public final int getVariablePos( String name )
    {
        assertNotNull(name);

        int hash = name.hashCode();
        assertGreater(hash, 0);

        int i = 0;
        while( hashValues[i] != 0 )
        {
            if( hash == hashValues[i] )
                return i;

            i++;
        }

        assertLower( i , hashValues.length );

        hashValues[i] = hash;
        if( i == hashValues.length-1 )
        {
            int[] old = hashValues;
            MeoWObject[] oldData = globalVariables;

            hashValues = new int[ old.length + INCREAMENT_SIZE ];
            globalVariables = new MeoWObject[ oldData.length + INCREAMENT_SIZE ];

            System.arraycopy(old, 0, hashValues, 0, old.length);
            System.arraycopy(oldData, 0, globalVariables, 0, oldData.length);
        }


        return i;
    }
}
