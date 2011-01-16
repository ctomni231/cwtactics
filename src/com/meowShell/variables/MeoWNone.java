package com.meowShell.variables;

/**
 * MeoW object that represents a null statement.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 11.01.2011
 */
public class MeoWNone extends MeoWObject
{
    public static final MeoWNone NONE = new MeoWNone();

    // singleton
    private MeoWNone(){}

    @Override
    public boolean getBoolean()
    {
        return false;
    }

    @Override
    public String toString()
    {
        return "None";
    }

    @Override
    public MeoWObject clone()
    {
        return NONE;
    }
}
