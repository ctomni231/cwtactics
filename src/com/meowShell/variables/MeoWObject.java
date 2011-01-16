package com.meowShell.variables;

import com.meowShell.exception.OperationTypeMissmatchException;

/**
 * Defines structure of a meow shell object.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 14.01.2011
 */
public abstract class MeoWObject
{
    private static final String EXCEPTION_MESSAGE = "action unavailable on this variable";

    /*
     * getter methods
     */

    /**
     * Returns the boolean value of a meow object.
     * @return boolean value of the object
     */
    public abstract boolean getBoolean();

    /**
     * Returns the numeric value of a meow object.
     * @return numeric value as float
     */
    public float getNumericValue()
    {
        throw new OperationTypeMissmatchException(EXCEPTION_MESSAGE);
    }

    /**
     * Returns the object value of a meow object.
     * @return object instance
     */
    public Object getObjectValue()
    {
        throw new OperationTypeMissmatchException(EXCEPTION_MESSAGE);
    }


    /*
     * setter methods
     */

    /**
     * Sets the numeric value of a meow object.
     *
     * @target MeoWNumber
     * @param val value that will be set
     */
    public void setNumericValue( float val )
    {
        throw new OperationTypeMissmatchException(EXCEPTION_MESSAGE);
    }

    /**
     * Sets the java value of a meow object.
     *
     * @target MeoWJavaObject
     * @param obj value that will be set
     */
    public void setJavaObject( Object obj )
    {
        throw new OperationTypeMissmatchException(EXCEPTION_MESSAGE);
    }

    /**
     * Sets the boolean value of a meow object.
     *
     * @target MeoWBoolean
     * @param val value that will be set
     */
    public void setBooleanValue( boolean val )
    {
        throw new OperationTypeMissmatchException(EXCEPTION_MESSAGE);
    }

    
    /*
     * aritmetic operations
     */


    /**
     * Adds a value to the object value.
     *
     * @target MeoWNumber
     * @param val value that will be added
     */
    public void plus( float val )
    {
        throw new OperationTypeMissmatchException(EXCEPTION_MESSAGE);
    }

    /**
     * Subtracts a value from the object value.
     *
     * @target MeoWNumber
     * @param val value that will be subtracted
     */
    public void minus( float val )
    {
        throw new OperationTypeMissmatchException(EXCEPTION_MESSAGE);
    }

    /**
     * Multiplies a value from the object value.
     *
     * @target MeoWNumber
     * @param val value that will be multiplied
     */
    public void multiply( float val )
    {
        throw new OperationTypeMissmatchException(EXCEPTION_MESSAGE);
    }

    /**
     * Divides a value from the object value.
     *
     * @target MeoWNumber
     * @param val value that will be divided
     */
    public void divide( float val )
    {
        throw new OperationTypeMissmatchException(EXCEPTION_MESSAGE);
    }

    /**
     * Powers a value on the object value.
     *
     * @target MeoWNumber
     * @param val value that will be powered 
     */
    public void pow( float val )
    {
        throw new OperationTypeMissmatchException(EXCEPTION_MESSAGE);
    }

    /**
     * Modulo a value on the object value.
     *
     * @target MeoWNumber
     * @param val value that will be powered
     */
    public void modulo( float val )
    {
        throw new OperationTypeMissmatchException(EXCEPTION_MESSAGE);
    }

    /**
     * @target MeoWNumber
     */
    public void sqrt()
    {
        throw new OperationTypeMissmatchException(EXCEPTION_MESSAGE);
    }


    /*
     * cloning method
     */

    /**
     * Clones a meow object.
     *
     * @return a cloned instance
     */
    @Override
    public abstract MeoWObject clone();
}
