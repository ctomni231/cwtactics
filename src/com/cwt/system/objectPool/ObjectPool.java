package com.cwt.system.objectPool;

import java.util.ArrayList;

/**
 * An object pool is a recycling depot for recyclable objects. This objects
 * can't be reused after releasing it back to the pool instead of creating
 * new instances.
 * <br><br>
 * For more information see "Object Pooling" Pattern.
 * <br><br>
 * NOTE : This implementation isn't thread safe, designed for single threading
 * applications.
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 19.12.2010
 */
public abstract class ObjectPool<T>
{
    private static final int DEFAULT_INIT_SIZE = 10;
    private final ArrayList<T> collectedTrash;

    public ObjectPool()
    {
        this( DEFAULT_INIT_SIZE );
    }

    public ObjectPool( int initSize )
    {
        collectedTrash = new ArrayList<T>(initSize);
    }

    /**
     * Acquires an object from the pool, if a recycled one is available, then
     * the pool will return the recycled one rather than creating a new one.
     *
     * @return object instance
     */
    public final T acquireObject()
    {
        if( collectedTrash.size() > 0 )
            return collectedTrash.remove(0);
        else
            return createInstance();
    }

    /**
     * Releases an object and puts it into the object pool. The object pool
     * will recycle the object data in this step too.
     *
     * @param obj object instance
     */
    public final void releaseObject( T obj )
    {
        assert obj != null;

        collectedTrash.add( recycleInstance( obj ) );
    }

    /**
     * Recycles an used object back to a clean state, called by object pool
     * if a used object will released back to the pool.
     *
     * @param obj object instance
     * @return recycled instance of the object
     */
    protected abstract T recycleInstance( T obj );

    /**
     * Creates a new instance of that object class, called by the object pool
     * if no recycled instance is available in the collected released objects.
     *
     * @return clean object instance
     */
    protected abstract T createInstance();
}
