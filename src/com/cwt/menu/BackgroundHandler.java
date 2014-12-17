package com.cwt.menu;

import com.cwt.tools.XML_Reader;
import com.jslix.image.AnimatedGif;
import com.jslix.image.ImgLibrary;
import com.jslix.io.FileFind;
import com.jslix.io.FileIndex;
import com.jslix.parser.XML_Writer;
import com.jslix.state.ScreenSkeleton;

import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;
import java.util.Random;
import org.newdawn.slick.Graphics;

/**
 * BackgroundHandler.java
 *
 * This class handles the backgrounds of a screen
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 04.29.14
 */
public class BackgroundHandler implements ScreenSkeleton {

    /** Stores the background images */
    private ImgLibrary imgSort;
    /** Stores an Animated GIF in the background */
    private AnimatedGif animImg;
    /** Helps select a random number */
    private Random generator;
    /** Holds the current width of the displayed window */
    private int cursx;
    /** Holds the current height of the displayed window */
    private int cursy;

    /**
     * This holds a series of background images for CWT. The images are
     * automatically resized to fit the window
     * @param width The current width of the window
     * @param height The current height of the window
     */
    public BackgroundHandler(int width, int height){
        cursx = width;
        cursy = height;
        imgSort = new ImgLibrary();
        animImg = null;
    }

    /**
     * This function is used to poll the screen to see if the window size
     * has been changed so it can resize the background
     * @param width The current width of the window
     * @param height The current height of the window
     * @param sysTime Current time of the system in milliseconds
     * @param mouseScroll Tells you when the scroll wheel was altered
     */
    public void update(int width, int height, int sysTime, int mouseScroll) {
        if(cursx != width || cursy != height){
            cursx = width;
            cursy = height;
            imgSort.setImageSize(cursx, cursy);
            imgSort.addImage(1, imgSort.getImage(0));
            if(animImg != null)
            	animImg.resizeImg(cursx, cursy);
        }
    }

    /**
     * This function is used to poll the screen to see if the current window
     * is an Applet
     * @param name The current name ID of this screen
     * @param index The current position of this screen in SlixLibrary
     * @param isApplet Tells you whether this screen is an @seeApplet
     * @param seethru If true, you can see screens underneath this screen
     */
    public void update(String name, int index, boolean isApplet,
            boolean seethru) {
        if(!isApplet)     findNewBackgrounds();
        loadRandomBackground();
        imgSort.setImageSize(cursx, cursy);
        imgSort.addImage(imgSort.getImage(0));
    }

    /**
     * Draws the background image to the Slick Frame and Applet windows
     * @param g Graphics object for Slick
     */
    public void render(Graphics g) {
        g.drawImage(imgSort.getSlickImage(1), 0, 0);
    }

    /**
     * Draws the background image to the Java2D Frame and Applet windows
     * @param g Graphics object for Java2D
     * @param dthis Component object for Java2D used for rendering
     */
    public void render(Graphics2D g, Component dthis) {
        g.drawImage(imgSort.getImage(1), 0, 0, dthis);
        if(animImg != null)
        	g.drawImage(animImg.getImage(), 0, 0, dthis);
    }

    /**
     * This function searches through your system for backgrounds and
     * organizes them in an XML file so they can be randomly selected.
     */
    private void findNewBackgrounds(){
        FileFind fileFinder = new FileFind();
        XML_Writer writer = new XML_Writer("data","background.xml");
        if(fileFinder.changeDirectory("image/background")){
            //Forces it to only look for pictures
            fileFinder.addAvoidDir(".svn");
            fileFinder.addForceType(".jpg");
            fileFinder.addForceType(".gif");
            fileFinder.addForceType(".png");
            fileFinder.addForceType(".bmp");

            writer.addXMLTag("background");

            for(FileIndex file: fileFinder.getAllFiles()){
                if(!file.isDirectory){
                    writer.addXMLTag("image");
                    writer.addAttribute("file", file.fpath, true);
                }
            }

            writer.endAllTags();
            writer.writeToFile(true);
        }
    }

    /**
     * This gets a random image from an XML file list of images for the
     * background display
     */
    private void loadRandomBackground(){

        XML_Reader.parse("data/background.xml");
        int[] entryLocation = XML_Reader.getIndex("background image");
        String[] entries = new String[entryLocation.length];

        for(int i = 0; i < entryLocation.length; i++)
            entries[i] = XML_Reader.getAttribute(entryLocation[i], "file");

        generator = new Random();
        imgSort.addImage(imgSort.getColorBox(new Color(generator.nextInt(256), 
        		generator.nextInt(256), generator.nextInt(256)), 1, 1));
        if(entries.length > 0){
        	String temp = entries[generator.nextInt(entries.length)];
        	if(temp.toLowerCase().endsWith(".gif"))
        		animImg = new AnimatedGif(temp);
        	else
        		imgSort.addImage(0, temp);
        }
            
        XML_Reader.clear();
    }

    public void init() {}

    public void update(int timePassed) {}
}