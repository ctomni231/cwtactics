package com.client.screen;

import com.client.graphic.BackgroundHandler;
import com.jslix.state.Screen;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 * The new main menu screen now using JSlix exclusively.
 *
 * @author Crecen
 */
public class MainMenuScreen extends Screen{

    private BackgroundHandler bgPic;

    public MainMenuScreen(){
        bgPic = new BackgroundHandler(scr_width, scr_height);
    }

    @Override
    public void init() {
        bgPic.getSystem(scr_sysTime, scr_isApplet, scr_link);
        bgPic.init();
    }

    @Override
    public void update(int timePassed) {
        bgPic.getScreen(scr_name, scr_index, scr_width, scr_height);
        bgPic.update(timePassed);
    }

    @Override
    public void render(Graphics g) {
        bgPic.render(g);
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        bgPic.render(g, dthis);
    }



}
