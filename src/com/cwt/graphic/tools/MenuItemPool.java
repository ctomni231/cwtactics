package com.cwt.graphic.tools;

import com.cwt.system.ObjectPool;

/**
 * MenuItemPool.java
 *
 * This class helps to recycle used Menu Items for the moving menu class
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.30.10
 */
public class MenuItemPool extends ObjectPool<MenuItem>{

    private int locx;//A temporary x-axis location variable
    private int locy;//A temporary y-axis location variable
    private double speed;//A temporary speed holding variable

    /**
     * This sets up the variables for a new or recycled MenuItem
     * @param posx The x-axis position of this MenuItem
     * @param posy The y-axis position of this MenuItem
     * @param spd The current scroll speed of this MenuItem
     */
    public void setVar(int posx, int posy, double spd){
        locx = posx;
        locy = posy;
        speed = spd;
    }

    /**
     * This function recycles an old MenuItem object
     * @param obj The Object to be recycled
     * @return An instance of the old object
     */
    @Override
    protected MenuItem recycleInstance(MenuItem obj) {
        obj.posx = locx;
        obj.posy = locy;
        obj.fposx = locx;
        obj.fposy = locy;
        obj.speed = speed;

        return obj;
    }

    /**
     * This function creates a new MenuItem object
     * @return An instance of a new MenuItem object
     */
    @Override
    protected MenuItem createInstance() {
        return new MenuItem(locx, locy, speed);
    }
}
