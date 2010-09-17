package com.client.screen;

import com.client.graphic.BackgroundHandler;
import com.client.graphic.tools.LogoLibrary;
import com.client.graphic.tools.MovingImage;
import com.jslix.state.Screen;
import com.system.reader.MenuReader;
import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 * The new main menu screen now using JSlix exclusively.
 *
 * @author Crecen
 */
public class MainMenuScreen extends Screen{

    private final int SIZE_X = 640;
    private final int SIZE_Y = 480;

    private BackgroundHandler bgPic;
    private MenuReader reader;
    private MovingImage pic;

    public MainMenuScreen(){
        bgPic = new BackgroundHandler(scr_width, scr_height);
        reader = new MenuReader("data/mainmenu.xml");
    }

    @Override
    public void init() {
        //Test code here
        pic = new MovingImage(145, -100, 1);
        pic.setImage(reader.getTitleLogo(), 350, 150);

        pic.setShadowColor(Color.BLACK);
        pic.setShadowOffset(2);
        pic.setOrigScreen(SIZE_X, SIZE_Y);

        bgPic.update(scr_name, scr_index, scr_isApplet, scr_link);
        bgPic.init();
    }

    @Override
    public void update(int timePassed) {
        bgPic.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
        pic.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
        pic.setFinalPosition(145, 30);
    }

    @Override
    public void render(Graphics g) {
        bgPic.render(g);
        pic.render(g);
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        bgPic.render(g, dthis);
        pic.render(g, dthis);
    }
}
