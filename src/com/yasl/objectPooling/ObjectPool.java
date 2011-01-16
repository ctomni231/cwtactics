package com.yasl.objectPooling;

import java.util.LinkedList;
import static com.yasl.assertions.Assertions.*;

/**
 * Template class for defining object pools.
 * This factory pattern saves a lot of time and memory, because you avoid heavy
 * usage of the keyword new.
 * <br><br>
 * This template based on a linked list as pool storage and is not thread safe.
 * 
 * @param <T> Type of the objects you save in this pool
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 16.01.2011
 */
public abstract class ObjectPool<T>
{
    private LinkedList<T> pool;

    public ObjectPool()
    {
        pool = new LinkedList<T>();
    }

    /**
     * Releases an object back to the number factory.
     *
     * @param obj object
     */
    public final void release( T obj)
    {
        assertNotNull(obj);

        cleanInstance(obj);
        pool.add(obj);
    }

    /**
     * Acquires a MeoWNumber from the factory.
     *
     * @return MeoWNumber object
     */
    public final T aquire()
    {
        if( pool.isEmpty() )
            return createInstance();
        else
            return pool.removeFirst();
    }


    /**
     * Cleans an object back to a recycled status.
     *
     * @param obj object that will be cleaned
     */
    protected abstract void cleanInstance( T obj );

    /**
     * Creates a new instance of an object.
     *
     * @return object instance
     */
    protected abstract T createInstance();
}
