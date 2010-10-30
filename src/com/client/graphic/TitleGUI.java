package com.client.graphic;

import com.client.graphic.tools.MovingImage;
import com.client.graphic.tools.TextPix;
import com.client.input.KeyControl;
import com.jslix.tools.ImgLibrary;
import com.jslix.tools.TextImgLibrary;
import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 * TitleGUI.java
 *
 * This displays the flashing title "Press Start" logo
 * 
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.29.10
 */

public class TitleGUI extends MovingImage {

    private double counter;//This controls the opacity of the image
    private boolean help;//This controls whether the help is available or not
    private int[] colors;//Integer representation of the multple colors

    /**
     * This class displays a flashing start logo and controls the help bar
     * screen functionality
     * @param locx The x-axis location of the title flashing logo
     * @param locy The y-axis location of the title flashing logo
     * @param speed How fast the flashing title screen logo moves
     */
    public TitleGUI(int locx, int locy, double speed){
        super(locx, locy, speed);
        counter = 0;
        help = false;
    }

    /**
     * This sets the letters for the flashing logo
     * @param text The text to convert into a picture
     * @param width The x-axis size of the logo
     * @param height The y-axis size of the logo
     */
    public void setWords(String text, int width, int height){
        setImage(TextPix.getTextImg(text), width, height);
    }

    /**
     * This class updates all graphical elements of the title screen
     * @param width The current width of the window
     * @param height The current height of the window
     * @param sysTime The system time in milliseconds
     * @param mouseScroll The mouse scroll wheel value
     */
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);      
        counter = (((double)sysTime/1000)-.5);
        if(counter > 1 || counter < -1)
            counter = 1;
        if(counter < 0)
            counter *= -1;
    }

    /**
     * This renders the title image to the screen
     * @param g Graphics object for Slick
     */
    @Override
    public void render(Graphics g){
        imgRef.getSlickImage(1).setAlpha((float)counter);
        if(imgRef.length() > 1)
            imgRef.getSlickImage(2).setAlpha((float)counter);
        super.render(g);
    }

    /**
     * This renders the title image to the Screen
     * @param g Graphics object for Java2D
     * @param dthis Component object for Java2D
     */
    @Override
    public void render(Graphics2D g, Component dthis) {
        g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER,
                (float)counter));
        super.render(g, dthis);
        g.setComposite(AlphaComposite.SrcOver);
    }

    /**
     * This function deals with all the keyboard and mouse actions for this
     * screen. It also deals with how this screen interacts with other
     * screens.
     * @param column The current column this screen is on
     * @return A new column to change to
     */
    public int control(int column){
        if(KeyControl.isUpClicked() ||
                KeyControl.isDownClicked() ||
                KeyControl.isRightClicked() ||
                KeyControl.isLeftClicked())
            help = !help;

        if(KeyControl.isActionClicked()){
            if(KeyControl.getMouseY() < 20*scaley &&
                    KeyControl.getMouseX() != 0)
                help = !help;
            else
                return 1;
        }else if(KeyControl.isCancelClicked()){
            return -1;
        }
        return column;
    }

    /**
     * Gets whether the help menu bar is locked in display
     * @return Whether this bar is displayed(true) or timed(false)
     */
    public boolean getHelp(){
        return help;
    }

    /**
     * This function helps set if the help bar is visible
     * @param set Whether the help bar is visible(true) or not(false)
     */
    public void setHelp(boolean set){
        help = set;
    }

    /**
     * This function gets a list of color changes for menu items
     * @param colorPath The path to the color list
     */
    public void setColorPath(String colorPath){
        ImgLibrary imgLib = new ImgLibrary();
        imgLib.addImage(colorPath);
        colors = imgLib.getPixels(0);
    }

    /**
     * This function changes the color based on the menu colors
     * @param index Which index of colors to use for this menu
     */
    public void setColor(int index){
        index *= 16;
        resetColor();
        if(index >= 0 && index < colors.length){
            addColor(new Color(160, 160, 160),
                    new Color(colors[index+9+3]));
            addColor(new Color(128, 128, 128),
                    new Color(colors[index+9+4]));
        }
    }
}
