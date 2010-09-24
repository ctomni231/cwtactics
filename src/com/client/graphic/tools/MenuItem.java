package com.client.graphic.tools;

import java.awt.Color;

/**
 * MenuItem.java
 * 
 * Holds a MenuItem reference for the Moving Menu class
 *
 * @author Crecen
 */
public class MenuItem {
    //This holds the ID# of the MenuItem
    public int id;
    //This holds its user selection index#
    public int index;
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

    public MenuItem(int locx, int locy, double speed){
        posx = locx;
        fposx = locx;
        posy = locy;
        fposy = locy;
        this.speed = speed;
        refPath = new int[0];
        index = 0;
        choice = 0;
        opacity = -1;
        selectable = true;
        theColor = null;
        sizex = 0;
        sizey = 0;
        arc = 0;
        drawthis = true;
    }

    public void addReference(int reference){
        int[] temp = refPath;
        refPath = new int[temp.length+1];
        System.arraycopy(temp, 0, refPath, 0, temp.length);
        refPath[refPath.length-1] = reference;
    }

    public void setOpacity(double opacity){
        this.opacity = opacity;
    }

    public void setFinalPosition(int x, int y){
        fposx = x;
        fposy = y;
    }

    public boolean getIndexExists(int index){
        return(index >= 0 && index < refPath.length);
    }

    public void setPictureIndex(int index, int reference){
        if(getIndexExists(index))
            refPath[index] = reference;
    }

    public int getPicture(boolean select){
        if(select && choice+1 < refPath.length)
            return choice+1;
        else
            return choice;
    }

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
