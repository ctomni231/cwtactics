package com.cwt.system.scriptEngine;

import java.io.File;

/**
 * Only prototype yet, no function.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 12.12.2010
 */
public final class ScriptReader {

    // singleton instance
    private static final ScriptReader INSTANCE = new ScriptReader();

    private ScriptReader() {}

    /**
     * Parses a file into the script database.
     *
     * @param file file instace that will be parsed
     */
    public void parseScript( File file )
    {
    }

    /**
     * Parses all files of a directory into the script database.
     *
     * @param directory directory instance
     * @param parseSubDirectories if true, all subdirectories will be parsed
     *                            too, else not
     */
    public void parseDirectory( File directory , boolean parseSubDirectories )
    {
    }

    /**
     * Retuns the singleton instance of the singleton class.
     */
    public static ScriptReader getInstance() {
        return ScriptReader.INSTANCE;
    }

 }
