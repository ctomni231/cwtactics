package com.client.graphic;

import com.client.graphic.tools.BackgroundReader;
import com.client.tools.ImgLibrary;
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
 * @author Crecen
 */
public class BackgroundHandler implements ScreenSkeleton {

    private ImgLibrary imgSort;
    private Random generator;
    private int cursx;
    private int cursy;
    private boolean applet;

    public BackgroundHandler(int width, int height){
        cursx = width;
        cursy = height;
        imgSort = new ImgLibrary();
    }

    public void init() {
        if(!applet)     findNewBackgrounds();
        loadRandomBackground();
        imgSort.setImageSize(cursx, cursy);
        imgSort.addImage(imgSort.getImage(0));
    }

    public void update(int width, int height, int sysTime, int mouseScroll) {
        if(cursx != width || cursy != height){
            cursx = width;
            cursy = height;
            imgSort.setImageSize(cursx, cursy);
            imgSort.addImage(1, imgSort.getImage(0));
        }
    }

    public void update(String name, int index, boolean isApplet,
            boolean seethru) {
        applet = isApplet;
    }

    public void render(Graphics g) {
        g.drawImage(imgSort.getSlickImage(1), 0, 0);
    }

    public void render(Graphics2D g, Component dthis) {
        g.drawImage(imgSort.getImage(1), 0, 0, dthis);
    }

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

    //Gets a random background from the xml file
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
