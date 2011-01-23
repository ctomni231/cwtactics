package com.meowShell.context;

import com.meowShell.variables.MeoWObject;

/**
 * Call able script block used for storing scripts and
 * functions.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 13.01.2011
 */
public abstract class Script
{
    public MeoWObject call( MeoWObject... parameters )
    {
        // empty body , will filled by meow shell compiler with statements
        return null;
    }
}
