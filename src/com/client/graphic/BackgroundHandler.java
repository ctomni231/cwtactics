package com.client.graphic;

import com.client.tools.GameSkeleton;
import com.client.tools.ImgLibrary;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 * BackgroundHandler.java
 *
 * This class handles the backgrounds of the game
 *
 * @author Ctomni
 */
public class BackgroundHandler implements GameSkeleton {

    private ImgLibrary imgSort;
    private int cursx;
    private int cursy;

    public BackgroundHandler(int width, int height){
        cursx = width;
        cursy = height;
        imgSort = new ImgLibrary();
    }

    public void init() {
        imgSort.addImage("image/menu/background1.png");
        imgSort.setImageSize(cursx, cursy);
        imgSort.addImage(imgSort.getImage(0));
    }

    public void update(int timePassed) {

    }

    public void render(Graphics g) {
        g.drawImage(imgSort.getSlickImage(1), 0, 0);
    }

    public void render(Graphics2D g, Component dthis) {
        g.drawImage(imgSort.getImage(1), 0, 0, dthis);
    }

    public void getScreen(String name, int index, int width, int height) {
        if(cursx != width || cursy != height){
            cursx = width;
            cursy = height;
            imgSort.setImageSize(cursx, cursy);
            imgSort.addImage(1, imgSort.getImage(0));
        }
    }

    public void getSystem(int time, boolean isApplet, boolean seethru) {}

    public void getMouse(int mouseScroll) {}

    public void getDelete(boolean delete) {}

}
