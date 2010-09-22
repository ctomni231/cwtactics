package com.client.graphic.tools;

import java.awt.Color;
import java.awt.Image;
import java.util.ArrayList;

/**
 * MovingMenuItem.java
 * 
 * A remix of PixMenuItem, this holds the image part of the Moving Menu
 * class and controls drawing them to the screen.
 *
 * @author Crecen
 */
public class MovingMenuItem extends MovingImage{

    //This decides what item is drawn by the menu
    public int index;
    //This holds a list of items for the menu
    public ArrayList<MovingImage> pixPart;
    //This holds the select index for a menu item
    public int select;
    //This holds how the images react when chosen (#:idle #+1:selected)
    public int choice;
    //This makes sure that images are only stored when needed
    private int heldChoice;
    //This holds whether this item is selectable
    public boolean selectable;
    //This holds whether this item should be drawn
    public boolean drawthis;

    //This holds the Color of a menu item
    public Color theColor;
    //This holds the width of a menu item
    public int sizex;
    //This holds the height of a menu item
    public int sizey;
    //This holds the arc of a menu item
    public int arc;

    public MovingMenuItem(int locx, int locy, double speed){
        super(locx, locy, speed);
        pixPart = new ArrayList<MovingImage>();
        select = 0;
        choice = 0;
        heldChoice = -1;
        opacity = -1;
        selectable = true;
        theColor = null;
        sizex = 0;
        sizey = 0;
        arc = 0;
        drawthis = true;
    }

    public void addPixPart(Image theImg, double theOpac, Color theColor){
        MovingImage temp = new MovingImage(0, 0, 0);
        temp.setImage(theImg);
        temp.opacity = theOpac;
        temp.setShadowColor(theColor);
        pixPart.add(temp);
    }

    public void changePixImage(int index, Image theImg){
        if(index >= 0 && index < pixPart.size()){
            MovingImage temp = pixPart.get(index);
            temp.setImage(theImg);
            pixPart.set(index, temp);
        }
    }

    @Override
    public void setOrigScreen(int scrX, int scrY) {
        super.setOrigScreen(scrX, scrY);
        for(int i = 0; i < pixPart.size(); i++)
            changeOrigScreenSize(i, scrX, scrY);
    }


    public void changeOrigScreenSize(int index, int origx, int origy){
        if(index >= 0 && index < pixPart.size()){
            MovingImage temp = pixPart.get(index);
            temp.setOrigScreen(origx, origy);
            pixPart.set(index, temp);
        }
    }

    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);
        for(int i = 0; i < pixPart.size(); i++)
           update(index, width, height, sysTime, mouseScroll);
    }

    public void update(int index, int width, int height,
            int sysTime, int mouseScroll){
        if(index >= 0 && index < pixPart.size()){
            MovingImage temp = pixPart.get(index);
            temp.update(width, height, sysTime, mouseScroll);
            pixPart.set(index, temp);
        }
    }

    public void changeAll(boolean selected, double opac){
        if(pixPart.isEmpty()) return;
        
        //Decide whether an image is chosen
        int sel = 0;
        if(selected)                sel = choice+1;
        else                        sel = choice;

        //Sets the selection to a valid selection
        if(sel >= pixPart.size())   sel = pixPart.size()-1;
        if(sel < 0)                 sel = 0;
        if(heldChoice == sel)       return;

        //stores the logo into logoPic
        setImage(pixPart.get(sel).imgRef.getImage(0));

        //Changes the opacity of pictures
        if(opacity >= 0 && opacity <= 1)
            setOpacity(pixPart.get(sel).opacity);
        else
            setOpacity(opac);

        setShadowColor(pixPart.get(sel).shadow);
        
        heldChoice = sel;
    }
}
