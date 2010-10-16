package com.client.graphic;

import com.client.graphic.xml.BackgroundReader;
import com.jslix.tools.ImgLibrary;
import com.jslix.state.ScreenSkeleton;
import com.jslix.tools.FileFind;
import com.jslix.tools.FileIndex;
import com.jslix.tools.XML_Writer;
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
 * @version 10.11.10
 */
public class BackgroundHandler implements ScreenSkeleton {

    private ImgLibrary imgSort;//Stores the background images
    private Random generator;//Helps select a random number
    private int cursx;//Holds the current width of the displayed window
    private int cursy;//Holds the current height of the displayed window
    private boolean applet;//Holds whether the current window is an applet

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
    }

    /**
     * This function checks to see if there are any new backgrounds. If not,
     * it'll load a list of the old backgrounds, choose one, and resize it
     * to fit the screen.
     */
    public void init() {
        if(!applet)     findNewBackgrounds();
        loadRandomBackground();
        imgSort.setImageSize(cursx, cursy);
        imgSort.addImage(imgSort.getImage(0));
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
        }
    }

    /**
     * This function is used to poll the screen to see if the current window
     * is an applet
     * @param name The current name ID of this screen
     * @param index The current position of this screen in SlixLibrary
     * @param isApplet Tells you whether this screen is an applet
     * @param seethru If true, you can see screens underneath this screen
     */
    public void update(String name, int index, boolean isApplet,
            boolean seethru) {
        applet = isApplet;
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

            fileFinder.refactor();

            writer.addXMLTag("background");

            for(FileIndex file: fileFinder.getAllFiles()){
                if(!file.isDirectory){
                    writer.addXMLTag("image");
                    writer.addAttribute("file", file.fpath, true);
                }
            }

            writer.endAllTags();
            //writer.print();
            writer.writeToFile(true);
        }
    }

    /**
     * This gets a random image from an XML file list of images for the
     * background display
     */
    private void loadRandomBackground(){
        BackgroundReader reader = new BackgroundReader("data/background.xml");
        String[] entries = reader.getEntries();

        if(entries.length > 0){
            generator = new Random();
            int random = generator.nextInt(entries.length);
            imgSort.addImage(entries[random]);
        }
    }

    public void update(int timePassed) {}
}