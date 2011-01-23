package com.meowShell.variables;

import java.util.ArrayList;
import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * MeoWShell implementation of a java array list data type.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class MeoWArray extends MeoWObject
{
    ArrayList<MeoWObject> list;

    public MeoWArray()
    {
        list = new ArrayList<MeoWObject>();
    }

    @Override
    public final boolean getBoolean()
    {
        return list.size()>0;
    }

    @Override
    public void setValueAt( int f , MeoWObject obj )
    {
        while( list.size()-1 <= f )
            list.add( MeoWNone.NONE );

        list.set(f, obj);
    }

    @Override
    public MeoWObject getValueAt( int f )
    {
        return list.get(f);
    }

    @Override
    public MeoWObject clone()
    {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
