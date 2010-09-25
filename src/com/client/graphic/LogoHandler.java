package com.client.graphic;

import com.client.graphic.tools.MovingImage;
import com.client.graphic.tools.ScrollImage;
import com.client.input.KeyControl;
import com.jslix.state.ScreenSkeleton;
import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 * LogoHandler.java
 *
 * Handles the display of the logos and scrolling
 *
 * @author Crecen
 */
public class LogoHandler implements ScreenSkeleton{

    private MovingImage pic;
    private MovingImage logo;
    private ScrollImage scroll;
    private int sizex;
    private int sizey;
    private String[] cool;

    public LogoHandler(String title, String mini,
            String copyright, int width, int height){
        cool = new String[]{ title, mini, copyright };
        sizex = width;
        sizey = height;
    }

    public void init() {
        pic = new MovingImage(145, -100, 1);
        pic.setImage(cool[0], 350, 150);

        pic.setShadowColor(Color.BLACK);
        pic.setShadowOffset(2);
        pic.setOrigScreen(sizex, sizey);

        logo = new MovingImage(0, -100, 1);
        logo.setImage(cool[1], 75, 75);

        logo.setShadowColor(Color.BLACK);
        logo.setShadowOffset(2);
        logo.setOrigScreen(sizex, sizey);

        scroll = new ScrollImage(0, 480, 640, 20, 1);
        scroll.setScrollIndex(25);
        scroll.setTextImage(" - ");
        scroll.setOrigScreen(sizex, sizey);
    }

    public void setFinalPosition(int index, int locx, int locy){
        if(index == 0)
            pic.setFinalPosition(locx, locy);
        if(index == 1)
            logo.setFinalPosition(locx, locy);
        if(index == 2)
            scroll.setFinalPosition(locx, locy);
    }

    public void setScrollText(){
    	if(!scroll.getText().matches(cool[2]+".*"))
    		scroll.setTextImage(cool[2]+
    				"                                       ");
    }
    public void setScrollText(String text){
        scroll.setTextImage(text);
    }

    public void update(int width, int height, int sysTime, int mouseScroll) {
        pic.update(width, height, sysTime, mouseScroll);
        scroll.update(width, height, sysTime, mouseScroll);
        if(mouseScroll == 0)
        	KeyControl.resetMouseWheel();
    }

    public void render(Graphics g) {
        pic.render(g);
        scroll.render(g);
    }

    public void render(Graphics2D g, Component dthis) {
        pic.render(g, dthis);
        scroll.render(g, dthis);
    }

    public void update(int timePassed) {}

    public void update(String name, int index, boolean isApplet,
            boolean seethru) {}

}
