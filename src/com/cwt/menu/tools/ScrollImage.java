package com.cwt.menu.tools;

import com.jslix.image.PixtureMap;
import com.jslix.io.MouseHelper;

import java.awt.Component;
import java.awt.Graphics2D;
import java.awt.Image;
import java.util.ArrayList;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 * ScrollImage
 *
 * This is a remix of ScrollPix, it is used for moving images across the
 * Screen in a smooth motion, has support for Java2D fonts.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.27.11
 */

public class ScrollImage extends MovingImage {

    /** Holds a list of scrolling images */
    private ArrayList<Double> textScroll;
    /** The speed of the scrolling images */
    private double scrollSpeed;
    /** The width of the background bar */
    private int sizex;
    /** The height of the background bar */
    private int sizey;
    /** The color of the scrolling text */
    private Color textColor;
    /** The color of the background bar */
    private Color boxColor;
    /** Helps Regulates the scrolling speed */
    private MouseHelper helper;
    /** Represents the text of the scrolling image */
    private String logoTxt;
    /** Holds a picture map for making picture text */
    private PixtureMap pixture;

    /**
     * This class takes a font string and changes it into a repeating scrolling
     * image
     * @param locx The x-axis location of the scrolling image
     * @param locy The y-axis location of the scrolling image
     * @param sizex The width of the background box
     * @param sizey The height of the background box
     * @param moveSpeed How quickly this scroll box moves in the window
     */
    public ScrollImage(int locx, int locy,
            int sizex, int sizey, int moveSpeed){
        super(locx, locy, moveSpeed);
        textScroll = new ArrayList<Double>();
        scrollSpeed = 1.0;
        opacity = 0.3;
        this.sizex = sizex;
        this.sizey = sizey;
        boxColor = new Color(60, 60, 60, 127);
        textColor = new Color(255, 255, 255, 127);
        helper = new MouseHelper();
        pixture = new PixtureMap();
    }

    /**
     * This function control how fast the text scrolls across the screen
     * @param speed The speed of the scrolling text
     */
    public void setScrollSpeed(double speed){
        if(speed != 0)
            scrollSpeed = (speed < 0) ? -speed : speed;
    }

    /**
     * This function changes the millisecond speed of how fast the text
     * scrolls across the screen
     * @param speed The divisible time in milliseconds
     */
    public void setScrollIndex(int speed){
        helper.setScrollIndex(speed);
    }

    /**
     * This function sets a color to the background box
     * @param newColor The background box color
     */
    public void setBoxColor(java.awt.Color newColor){
        setBoxColor(imgRef.getColor(newColor));
    }

    /**
     * This function sets a color to the background box
     * @param newColor The background box color
     */
    public void setBoxColor(Color newColor){
        if(newColor != null)
            boxColor = newColor;
    }

    /**
     * This function sets a color for the scrolling text
     * @param newColor The text color
     */
    public void setTextColor(java.awt.Color newColor){
        setTextColor(imgRef.getColor(newColor));
    }

    /**
     * This function sets a color for the scrolling text
     * @param newColor The text color
     */
    public void setTextColor(Color newColor){
        if(newColor != null)
            textColor = newColor;
    }

    /**
     * This function converts a textual string into a font picture that
     * will become the scrolling image
     * @param text The text to convert
     */
    public void setTextImage(String text) {
        setShadowColor(imgRef.getColor(textColor));
        setImage(getTextPicture(text), 0, 0);
        logoTxt = text;
        textScroll.clear();
    }

    /**
     * This gets a string representation of the scrolling text
     * @return The scrolling text
     */
    public String getText(){
    	return logoTxt;
    }

    /**
     * This function converts a string into a picture string
     * @param text The text to convert into an image
     * @return An image representing the text
     */
    private Image getTextPicture(String text){
        pixture.setOpacity(opacity);
        return pixture.getTextPicture(text);
    }

    /**
     * This function deals with updating all the graphical features of
     * the scrolling image
     * @param width The current width of the window
     * @param height The current height of the window
     * @param sysTime The system time in milliseconds
     * @param mouseScroll The current mouse scroll wheel value
     */
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        helper.setMouseControl(sysTime);
        super.update(width, height, sysTime, mouseScroll);
    }

    /**
     * This function draws a moving image to the screen
     * @param g The Java2D graphics object
     * @param dthis The Java2D Component object
     */
    @Override
    public void render(Graphics2D g, Component dthis){
        g.setColor(imgRef.getColor(boxColor));
        g.fillRect((int)(posx*scalex), (int)(posy*scaley), 
                (int)(sizex*scalex), (int)(sizey*scaley));
        scroll(g, (int)posx, (int)posy, sizex,
                helper.getScroll() ? scrollSpeed : 0, dthis);
    }

    /**
     * This function draws a moving image to the screen
     * @param g The Slick graphics object
     */
    @Override
    public void render(Graphics g){
        g.setColor(boxColor);
        g.fillRect((int)(posx*scalex), (int)(posy*scaley),
                (int)(sizex*scalex), (int)(sizey*scaley));
        scroll(g, (int)posx, (int)posy, sizex,
                helper.getScroll() ? scrollSpeed : 0);
    }

    /**
     * This controls the speed of the scrolling menu image.
     * @param g The Slick graphics object
     * @param px The x-axis position of this object
     * @param py The y-axis position of this object
     * @param width The width of the background box
     * @param speed The speed of the scrolling image
     */
    private void scroll(Graphics g, int px, int py,
            int width, double speed){
        double temp, addmore;

        if(textScroll.isEmpty())
            textScroll.add((double)width);

        for(int i = 0; i < textScroll.size(); i++){
            temp = textScroll.get(i)-speed;
            addmore = scrollImg(g, (int)(px+temp), py);
            if(temp < -addmore)
                textScroll.remove(i);
            else
                textScroll.set(i, temp);

            if(i == textScroll.size()-1){
                if(textScroll.get(i) < width-addmore)
                    textScroll.add((double)width);
            }
        }
    }

    /**
     * This controls the speed of the scrolling menu image
     * @param g The java2D graphics object
     * @param px The x-axis position of this object
     * @param py The y-axis position of this object
     * @param width The width of the background box
     * @param speed The speed of the scrolling image
     * @param dthis The java2D component object
     */
    private void scroll(Graphics2D g, int px, int py,
            int width, double speed, Component dthis){
        double temp, addmore;

        if(textScroll.isEmpty())
            textScroll.add((double)width);

        for(int i = 0; i < textScroll.size(); i++){
            temp = textScroll.get(i)-speed;
            addmore = scrollImg(g, (int)(px+temp), py,  dthis);
            if(temp < -addmore)
                textScroll.remove(i);
            else
                textScroll.set(i, temp);

            if(i == textScroll.size()-1){
                if(textScroll.get(i) < width-addmore)
                    textScroll.add((double)width);
            }
        }
    }

    /**
     * This controls the visual of each repeating scroll text item.
     * @param g The slick2D graphics object
     * @param px The x-axis position of this object
     * @param py The y-axis position of this object
     * @return The width of this image
     */
    private double scrollImg(Graphics g, int px, int py){
        g.drawImage(imgRef.getSlickImage(1), (int)(px*scalex),
                (int)(py*scaley));
        return imgRef.getOrigX(1);
    }

    /**
     * This controls the visual of each repeating scroll text item.
     * @param g The java2D graphics object
     * @param px The x-axis position of this object
     * @param py The y-axis position of this object
     * @param dthis The java2D component object
     * @return The width of this image
     */
    private double scrollImg(Graphics2D g, int px, int py,
            Component dthis){
        g.drawImage(imgRef.getImage(1), (int)(px*scalex), (int)(py*scaley),
                dthis);
        return imgRef.getOrigX(1);
    }
}
