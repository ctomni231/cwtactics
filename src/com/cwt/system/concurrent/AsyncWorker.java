package com.cwt.system.concurrent;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * AsyncWorker singleton is a service class, that provides methods for 
 * asynchron background tasks.
 * 
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 28.12.2010
 */
public class AsyncWorker
{

    // singleton instance
    private static final AsyncWorker INSTANCE = new AsyncWorker();

    private ExecutorService executor = Executors.newSingleThreadExecutor();

    public final Future<Object> asyncCall( Callable<Object> function )
    {
        assert function != null;
        
        return executor.submit(function);
    }

    public final void shutdown()
    {
        executor.shutdown();
    }

    /**
     * Retuns the singleton instance of the singleton class.
     */
    public static AsyncWorker getInstance()
    {
        return AsyncWorker.INSTANCE;
    }

 }
