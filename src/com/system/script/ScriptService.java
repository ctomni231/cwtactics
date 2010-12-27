package com.system.script;

import java.util.ArrayList;

/**
 * Script service class process.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 25.12.2010
 */
public class ScriptService extends Thread
{

    // singleton instance
    private static final ScriptService INSTANCE = new ScriptService();
    private static final int SLEEP_TIME = 10;


    private final ArrayList<Object> workList;

    private ScriptService()
    {
        //TODO
        workList = new ArrayList<Object>();
    }

    @Override
    public void run()
    {
        try
        {
            while( true )
            {
                if( workList.size() > 0 ) processNextScript();

                // prevent cpu overhead
                sleep( SLEEP_TIME );
            }
        }
        catch( InterruptedException e )
        {
            System.err.println( e.getMessage() );
        }
    }

    public void processNextScript()
    {
        synchronized( workList )
        {
            //TODO
            throw new UnsupportedOperationException();
        }
    }

    public boolean isReady()
    {
        return workList.isEmpty();
    }

    public void processScripts( String... scripts )
    {
        synchronized( workList )
        {
            //TODO
            throw new UnsupportedOperationException();
        }
    }

    /**
     * Retuns the singleton instance of the singleton class.
     */
    public static ScriptService getInstance()
    {
        return ScriptService.INSTANCE;
    }

 }
