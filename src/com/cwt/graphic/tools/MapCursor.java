package com.cwt.graphic.tools;

import com.cwt.map.PixAnimate;
import com.cwt.system.jslix.tools.ImgLibrary;

/*
 * MapDraw.java
 *
 * This draws the cursor for the MapDraw object. It is separated from the
 * draw class so it can be expanded to include many different types of
 * cursor objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.05.11
 */
public class MapCursor extends MovingMenu {

    private int[] curImage;//Holds all possible cursor images for the cursor

    public MapCursor(int locx, int locy, double speed){
        super(locx, locy, speed);
        curImage = PixAnimate.getCursor();
    }
    
    public void createCursor(){
        ImgLibrary imgSort = new ImgLibrary();
        
        
    }



}
