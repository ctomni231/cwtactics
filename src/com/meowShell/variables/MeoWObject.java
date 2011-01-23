package com.meowShell.variables;

import com.meowShell.exception.TypeMissmatchException;

/**
 * Defines structure of a meow shell object.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 14.01.2011
 */
public abstract class MeoWObject
{
    
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
        throw new TypeMissmatchException();
    }

    /**
     * Returns the object value of a meow object.
     * @return object instance
     */
    public Object getObjectValue()
    {
        throw new TypeMissmatchException();
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
        throw new TypeMissmatchException();
    }

    /**
     * Sets the java value of a meow object.
     *
     * @target MeoWJavaObject
     * @param obj value that will be set
     */
    public void setJavaObject( Object obj )
    {
        throw new TypeMissmatchException();
    }

    /**
     * Sets the boolean value of a meow object.
     *
     * @target MeoWBoolean
     * @param val value that will be set
     */
    public void setBooleanValue( boolean val )
    {
        throw new TypeMissmatchException();
    }

    public void setValueAt( int f , MeoWObject obj )
    {
        throw new TypeMissmatchException();
    }

    public MeoWObject getValueAt( int f )
    {
        throw new TypeMissmatchException();
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
        throw new TypeMissmatchException();
    }

    /**
     * Subtracts a value from the object value.
     *
     * @target MeoWNumber
     * @param val value that will be subtracted
     */
    public void minus( float val )
    {
        throw new TypeMissmatchException();
    }

    /**
     * Multiplies a value from the object value.
     *
     * @target MeoWNumber
     * @param val value that will be multiplied
     */
    public void multiply( float val )
    {
        throw new TypeMissmatchException();
    }

    /**
     * Divides a value from the object value.
     *
     * @target MeoWNumber
     * @param val value that will be divided
     */
    public void divide( float val )
    {
        throw new TypeMissmatchException();
    }

    /**
     * Powers a value on the object value.
     *
     * @target MeoWNumber
     * @param val value that will be powered 
     */
    public void pow( float val )
    {
        throw new TypeMissmatchException();
    }

    /**
     * Modulo a value on the object value.
     *
     * @target MeoWNumber
     * @param val value that will be powered
     */
    public void modulo( float val )
    {
        throw new TypeMissmatchException();
    }

    /**
     * @target MeoWNumber
     */
    public void sqrt()
    {
        throw new TypeMissmatchException();
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
