package com.client.graphic;

import com.client.graphic.tools.MovingImage;
import com.client.graphic.tools.ScrollImage;
import com.client.input.KeyControl;
import com.jslix.state.ScreenSkeleton;
import com.jslix.tools.ImgLibrary;
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
    private HelpHandler help;
    private String helpPath;
    private int sizex;
    private int sizey;
    private String[] cool;
    private int[] colors;
    private ImgLibrary imgLib;

    public LogoHandler(String title, String mini,
            String copyright, String help, int width, int height){
        cool = new String[]{ title, mini, copyright };
        sizex = width;
        sizey = height;
        helpPath = help;
        imgLib = new ImgLibrary();
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

        help = new HelpHandler(helpPath, 0, -20, 1);
        help.init();
        help.setOrigScreen(sizex, sizey);
    }

    public void setColorPath(String colorPath){
        imgLib = new ImgLibrary();
        imgLib.addImage(colorPath);
        colors = imgLib.getPixels(0);
    }

    public void setColor(int index){
        index *= 16;
        if(index >= 0 && index < colors.length){
            if(pic != null){
                pic.addColor(new Color(255,0,0),
                        new Color(colors[index+9+2]));
                pic.addColor(new Color(127,0,0),
                        new Color(colors[index+9+5]));
            }

            if(scroll != null){
                scroll.setBoxColor(
                        imgLib.getColor(new Color(colors[index+9+5]), 127));
                scroll.setTextColor(
                        imgLib.getColor(new Color(colors[index+9+0]), 200));
            }

            if(help != null){
                help.setItemColor(0,
                        imgLib.getColor(new Color(colors[index+9+5]), 127));
                help.addColor(Color.WHITE,
                        imgLib.getColor(new Color(colors[index+9+0]), 200));
            }
        }
    }

    public void setCounter(int number){
        help.setCounter(number);
    }

    public boolean getCounter(){
        return help.getVisible();
    }

    public void setFinalPosition(int index, int locx, int locy){
        if(index == 0)
            pic.setFinalPosition(locx, locy);
        if(index == 1)
            logo.setFinalPosition(locx, locy);
        if(index == 2)
            scroll.setFinalPosition(locx, locy);
        if(index == 3)
            help.setFinalPosition(locx, locy);
    }

    public void setHelpOpacity(double opac){
        help.setOpacity(opac);
    }

    public void setHelpText(String text){
        help.setHelpText(text);
    }

    public void setScrollText(){
    	if(!scroll.getText().matches(cool[2]+".*"))
    		scroll.setTextImage(cool[2]+
    				"                                       ");
    }
    public void setScrollText(String text){
        if(!scroll.getText().matches(text+".*"))
            scroll.setTextImage(text+"                                   ");
    }
    public void forceScrollText(String text){
        scroll.setTextImage(text+"                                   ");
    }

    public void update(int width, int height, int sysTime, int mouseScroll) {
        pic.update(width, height, sysTime, mouseScroll);
        scroll.update(width, height, sysTime, mouseScroll);
        help.update(width, height, sysTime, mouseScroll);
        if(mouseScroll == 0)
        	KeyControl.resetMouseWheel();
    }

    public void render(Graphics g) {
        pic.render(g);
        scroll.render(g);
        help.render(g);
    }

    public void render(Graphics2D g, Component dthis) {
        pic.render(g, dthis);
        scroll.render(g, dthis);
        help.render(g, dthis);
    }

    public boolean checkHelp(){
        return help.checkHelp();
    }

    public void update(int timePassed) {}

    public void update(String name, int index, boolean isApplet,
            boolean seethru) {}

}
