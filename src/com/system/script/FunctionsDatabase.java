package com.system.script;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 25.12.2010
 */
public class FunctionsDatabase
{

    // singleton instance
    private static final FunctionsDatabase INSTANCE = new FunctionsDatabase();

    private FunctionsDatabase() {}

    /**
     * Retuns the singleton instance of the singleton class.
     */
    public static FunctionsDatabase getInstance()
    {
        return FunctionsDatabase.INSTANCE;
    }

 }
