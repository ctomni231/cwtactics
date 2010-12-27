package com.system.script;

import java.util.HashMap;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 25.12.2010
 */
public class ProcedureDatabase
{

    // singleton instance
    private static final ProcedureDatabase INSTANCE = new ProcedureDatabase();

    private Procedure[] procedures = new Procedure[]
    {
        // increase unit health
        new Procedure(){ public void call(int[] args){
            throw new UnsupportedOperationException("Not supported yet.");
        }}
    };

    private ProcedureDatabase() {}

    /**
     * Retuns the singleton instance of the singleton class.
     */
    public static ProcedureDatabase getInstance()
    {
        return ProcedureDatabase.INSTANCE;
    }

    /**
     * Simple interface to define the structure of a procedure.
     */
    static interface Procedure
    {
        void call( int[] args );
    }
 }
