package com.meowShell.variables;

import com.yasl.objectPooling.ObjectPool;
import static com.yasl.assertions.Assertions.*;

/**
 * MeoWShell implementation of a numeric data type.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 14.01.2011
 */
public class MeoWNumber extends MeoWObject
{
    private float val;

    public MeoWNumber( float value )
    {
        this.val = value;
    }

    @Override
    public final boolean getBoolean()
    {
        return val != 0;
    }

    @Override
    public final float getNumericValue()
    {
        return val;
    }

    @Override
    public final Object getObjectValue()
    {
        return Float.valueOf(val);
    }

    @Override
    public final void setNumericValue(float val)
    {
        this.val = val;
    }


    /*
     * arithmetic operation methods
     */

    @Override
    public final void plus(float val)
    {
        this.val += val;
    }

    @Override
    public final void minus(float val)
    {
        this.val -= val;
    }

    @Override
    public final void multiply(float val)
    {
        this.val *= val;
    }

    @Override
    public final void divide(float val)
    {
        this.val /= val;
    }

    @Override
    public final void pow(float val)
    {
        this.val = (float) Math.pow( this.val , val);
    }

    @Override
    public final void sqrt()
    {
        this.val = (float) Math.sqrt( this.val );
    }

    @Override
    public void modulo( float val )
    {
        this.val = this.val % val;
    }

    @Override
    public final String toString()
    {
        return String.valueOf(val);
    }

    @Override
    public MeoWObject clone()
    {
        return new MeoWNumber(val);
    }

    /**
     * MeoW Number factory.
     */
    public static class MeoWNumberFactory extends ObjectPool<MeoWNumber>
    {
        @Override
        protected void cleanInstance(MeoWNumber obj)
        {
            obj.val = 0;
        }

        @Override
        protected MeoWNumber createInstance()
        {
            return new MeoWNumber(0);
        }
    }
}
