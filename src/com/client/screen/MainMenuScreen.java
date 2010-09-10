package com.client.screen;

import com.jslix.state.Screen;
import com.jslix.tools.ImgLibrary;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 * The new main menu screen now using JSlix exclusively.
 *
 * @author Crecen
 */
public class MainMenuScreen extends Screen{

    private ImgLibrary imgSort;
    private int cursx;
    private int cursy;

    public MainMenuScreen(){
        cursx = scr_width;
        cursy = scr_height;
        imgSort = new ImgLibrary();
    }

    @Override
    public void init() {
        imgSort.addImage("image/menu/background1.png");
        imgSort.setImageSize(cursx, cursy);
        imgSort.addImage(imgSort.getImage(0));
    }

    @Override
    public void update(int timePassed) {
        if(cursx != scr_width || cursy != scr_height){
            cursx = scr_width;
            cursy = scr_height;
            imgSort.setImageSize(cursx, cursy);
            imgSort.addImage(1, imgSort.getImage(0));
        }
    }

    @Override
    public void render(Graphics g) {
        g.drawImage(imgSort.getSlickImage(1), 0, 0);
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        g.drawImage(imgSort.getImage(1), 0, 0, dthis);

    }



}
