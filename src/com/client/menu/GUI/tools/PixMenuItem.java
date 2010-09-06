package com.client.menu.GUI.tools;

import java.util.ArrayList;
import org.newdawn.slick.Color;
import org.newdawn.slick.Image;

/**
 * This class holds a part of the PixMenu class. The menu uses these
 * parts to draw items to the screen.
 *
 * @author Crecen
 */
public class PixMenuItem extends MovingPix{
    //This decides what item is drawn by the menu
    public int index;
    //This holds a list of items for the menu
    public ArrayList<PixMenuItemPart> pixPart;
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
    //This holds the item opacity
    public double opacity;

    //This holds the Color of a menu item
    public Color theColor;
    //This holds the width of a menu item
    public int sizex;
    //This holds the height of a menu item
    public int sizey;
    //This holds the arc of a menu item
    public int arc;

    public PixMenuItem(int locx, int locy, double speed){
        super(locx, locy, speed);
        pixPart = new ArrayList<PixMenuItemPart>();
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

    public void addPixPart(Image theImg, String theText,
            double theOpac, Color theColor){
        PixMenuItemPart temp = new PixMenuItemPart();
        temp.img = theImg;
        temp.text = theText;
        temp.opacity = theOpac;
        temp.color = theColor;
        pixPart.add(temp);
    }

    public void changePixImage(int index, Image theImg){
        if(index >= 0 && index < pixPart.size()){
            PixMenuItemPart temp = pixPart.get(index);
            temp.img = theImg;
            pixPart.set(index, temp);
        }
    }

    public void changePixText(int index, String theText){
        if(index >= 0 && index < pixPart.size()){
            PixMenuItemPart temp = pixPart.get(index);
            temp.text = theText;
            pixPart.set(index, temp);
        }
    }

    public void changeAll(boolean selected, double opac){
        if(pixPart.size() == 0) return;
        //Changes the opacity of pictures
        if(logoPic != null){
            if(opacity >= 0 && opacity <= 1)
                logoPic.setAlpha((float)opacity);
            else
                logoPic.setAlpha((float)opac);
        }
        //Decide whether an image is chosen
        int sel = 0;
        if(selected)                sel = choice+1;
        else                        sel = choice;

        //Sets the selection to a valid selection
        if(sel >= pixPart.size())   sel = pixPart.size()-1;
        if(sel < 0)                 sel = 0;
        if(heldChoice == sel)       return;

        //stores the logo into logoPic
        logoPic = pixPart.get(sel).img;
        //Uncomment to resize images within menu
        //if(sizex*sizey > 0) logoPic = logoPic.getScaledCopy(sizex, sizey);
        logoTxt = pixPart.get(sel).text;
        opacity = pixPart.get(sel).opacity;
        theColor = pixPart.get(sel).color;
        //Sets an opacity to an image
        heldChoice = sel;
    }
}
