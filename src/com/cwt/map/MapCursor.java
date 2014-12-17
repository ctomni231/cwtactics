package com.cwt.map;

import com.cwt.menu.tools.MovingMenu;
import com.cwt.oldgame.MapElement;
import com.cwt.oldgame.PixAnimate;
import com.jslix.image.ImgLibrary;

/*
 * MapDraw.java
 *
 * This draws the cursor for the MapDraw object. It is separated from the
 * draw class so it can be expanded to include many different types of
 * cursor objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.11.11
 */
public class MapCursor extends MovingMenu {

    /** Holds the default base value */
    public final int BASE = PixAnimate.BASE;

    /** Holds all images for the current cursor */
    private ImgLibrary imgSort;
    /** Holds all possible cursor images for the cursor */
    private int[] curImages;
    /** Holds the scale of currently drawn tiles */
    private double scale;
    /** Holds whether the map grows to screen size */
    private boolean stretch;

    /**
     * This class helps draw and control the cursor for the MapDraw class.
     * It's main purpose is to reduce the amount of code present within
     * the MapDraw class
     * @param locx The x-axis location of the map top-right corner
     * @param locy The y-axis location of the map top-right corner
     * @param speed The scrolling speed of the cursor
     */
    public MapCursor(int locx, int locy, double speed){
        super(locx, locy, speed);
        curImages = PixAnimate.getCursor();
        imgSort = new ImgLibrary();
    }

    /**
     * This function sets the image of the cursor
     * @param index The index of the loaded image
     */
    public void setCursor(int index){
        if(curImages.length > 0){
            int[] temp = PixAnimate.getMapData().getArray(
                curImages[index], MapElement.FILE);
            imgSort.addImage(0,
                PixAnimate.getMapData().getFileData().getFile(temp[0]));
        }
        updateCursor();
    }

    /**
     * This function updates the draw function of the cursor
     */
    public void updateCursor(){
        deleteItems();
        scale = PixAnimate.getScale();       
        if(scale != 1)
            imgSort.setImageSize((int)(imgSort.getX(0)*scale),
                (int)(imgSort.getY(0)*scale));
        imgSort.addImage(1, imgSort.getImage(0));
        imgSort.setFlipX();
        imgSort.addImage(2, imgSort.getImage(1));
        imgSort.setFlipY();
        imgSort.addImage(3, imgSort.getImage(1));
        imgSort.setFlipX();
        imgSort.setFlipY();
        imgSort.addImage(4, imgSort.getImage(1));

        createNewItem(0, 0, 1);
        addImagePart(imgSort.getImage(1), 1.0);
        addMenuItem(0, true);
        createNewItem((int)(BASE*scale), 0, 1);
        addImagePart(imgSort.getImage(2), 1.0);
        addMenuItem(0, true);
        createNewItem(0, (int)(BASE*scale), 1);
        addImagePart(imgSort.getImage(3), 1.0);
        addMenuItem(0, true);
        createNewItem((int)(BASE*scale), (int)(BASE*scale), 1);
        addImagePart(imgSort.getImage(4), 1.0);
        addMenuItem(0, true);
    }

    /**
     * This function sets the new position of the cursor
     * @param locx The x-axis location of the cursor top-right corner
     * @param locy The y-axis location of the cursor top-right corner
     */
    @Override
    public void setFinalPosition(int locx, int locy){
        super.setFinalPosition((int)(locx-(imgSort.getX(1)*scale)/2),
                (int)(locy-(imgSort.getY(1)*scale)/2));
    }

    /**
     * This function updates the animation sequence of the cursor
     * @param width The current width of the screen
     * @param height The current height of the screen
     * @param sysTime The time passed in milliseconds
     * @param mouseScroll Holds the scroll wheel actions
     */
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll){
        //setOrigScreen(-1, -1);
        super.update(width, height, sysTime, mouseScroll);
        
        //Cursor mini movement
        setItemPosition(0, (int)(sysTime/10 > 50 ? scale : -scale*2),
            (int)(sysTime/10 > 50 ? scale : -scale*2)-(int)(BASE*scale));
        setItemPosition(1, 
            (int)((scale*BASE)+(sysTime/10 > 50 ? -scale : 2*scale)),
            (int)(sysTime/10 > 50 ? scale : -scale*2)-(int)(BASE*scale));
        setItemPosition(2, (int)(sysTime/10 > 50 ? scale : -scale*2),
            (int)(sysTime/10 > 50 ? -scale : scale*2));
        setItemPosition(3,
            (int)((scale*BASE)+(sysTime/10 > 50 ? -scale : 2*scale)),
            (int)(sysTime/10 > 50 ? -scale : scale*2));
    }

    /**
     * This function controls whether the cursor stretches width the screen
     * dimensions, or stays the same size regardless of the screen dimensions.
     */
    public void toggleScretch(){
        stretch = !stretch;
    }
}
