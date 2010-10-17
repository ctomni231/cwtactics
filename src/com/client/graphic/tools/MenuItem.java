package com.client.graphic.tools;

import java.awt.Color;

/**
 * MenuItem.java
 * 
 * Holds a MenuItem reference for the Moving Menu class
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.25.10
 */

public class MenuItem {
    //This holds the ID# of the MenuItem
    public int id;
    //This holds its user selection index#
    public int select;
    //This holds the text reference to the image
    protected int[] refPath;
    //This holds the index in the refPath for which image will be diplayed
    //When image is selected, it temporarily increments it by 1
    public int choice;
    //This holds whether this item is selectable
    public boolean selectable;
    //This holds whether this item should be drawn
    public boolean drawthis;
    //This holds the item opacity
    public double opacity;

    //Holds the current position
    public double posx;
    public double posy;
    //Holds the final position
    public double fposx;
    public double fposy;
    //Holds the pixel speed
    public double speed;

    //This holds the Color of a menu item
    public Color theColor;
    //This holds the width of a menu item
    public int sizex;
    //This holds the height of a menu item
    public int sizey;
    //This holds the arc of a menu item
    public int arc;

    /**
     * This class holds an item for the MovingMenu class
     * @param locx The x-axis location of the object
     * @param locy The y-axis location of the object
     * @param speed How fast this object moves in the screen
     */
    public MenuItem(int locx, int locy, double speed){
        posx = locx;
        fposx = locx;
        posy = locy;
        fposy = locy;
        this.speed = speed;
        refPath = new int[0];
        select = 0;
        choice = 0;
        opacity = -1;
        theColor = null;
        selectable = true;
        sizex = 0;
        sizey = 0;
        arc = 0;
        drawthis = true;
    }

    /**
     * This function adds an image reference to the MenuItem representing
     * the image in the Moving Menu
     * @param reference The index to an image array
     */
    public void addReference(int reference){
        int[] temp = refPath;
        refPath = new int[temp.length+1];
        System.arraycopy(temp, 0, refPath, 0, temp.length);
        refPath[refPath.length-1] = reference;
    }

    /**
     * This stores an internal opacity for this specific item
     * @param opacity A number between 0.0 - 1.0 determining opacity
     */
    public void setOpacity(double opacity){
        this.opacity = opacity;
    }

    /**
     * This sets the final position of this object
     * @param x The x-axis of this object
     * @param y The y-axis of this object
     */
    public void setFinalPosition(int x, int y){
        fposx = x;
        fposy = y;
    }

    /**
     * This checks to see if a particular image index exists
     * @param index The index number to check
     * @return whether the image index exists(true) or not(false)
     */
    public boolean getIndexExists(int index){
        return(index >= 0 && index < refPath.length);
    }

    /**
     * This function allows you to change a picture reference index
     * @param index The index you want to change
     * @param reference The number reference to change this image to
     */
    public void setPictureIndex(int index, int reference){
        if(getIndexExists(index))
            refPath[index] = reference;
    }

    /**
     * This gets an image picture depending on the selection of the item
     * @param select whether this item is selected
     * @return An index representing the picture
     */
    public int getPicture(boolean select){
        if(select && choice+1 < refPath.length)
            return refPath[choice+1];
        else
            return refPath[choice];
    }

    /**
     * This function controls how fast an object will reach its destination
     * Negative values will be treated as teleportation.
     */
    public void renderSpeed(){
        if(posx == fposx && posy == fposy);
        else if(speed == 0){
            posx = fposx;
            posy = fposy;
        }else{
            if(posx < fposx)
                posx += speed;
            else if(posx > fposx)
                posx -= speed;
            if(posy < fposy)
                posy += speed;
            else if(posy > fposy)
                posy -= speed;
        }
    }
}
