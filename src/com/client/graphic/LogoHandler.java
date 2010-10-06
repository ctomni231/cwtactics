package com.client.graphic;

import com.client.graphic.tools.MovingImage;
import com.client.graphic.tools.MovingMenu;
import com.client.graphic.tools.ScrollImage;
import com.client.input.KeyControl;
import com.jslix.state.ScreenSkeleton;
import com.jslix.tools.MouseHelper;
import com.jslix.tools.PixtureMap;
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
    private MovingMenu help;
    private MouseHelper helper;
    private int counter;
    private int sizex;
    private int sizey;
    private String[] cool;
    private PixtureMap pixture;

    public LogoHandler(String title, String mini,
            String copyright, int width, int height){
        cool = new String[]{ title, mini, copyright };
        pixture = new PixtureMap();
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

        pixture.setOpacity(0.2);
        pixture.addImage(0, pixture.getTextPicture(" - "));

        help = new MovingMenu(0, -20, 1);
        help.setOpacity(0.9);
        help.createNewItem(0, 0, 1);
        help.addBox(0, pixture.getColor(Color.DARK_GRAY, 127),
                640, 20, false);
        help.createNewItem(2, 2, 1);
        help.addImagePart("image/question.png", -1);
        help.addMenuItem(0, false);
        help.createNewItem(640-pixture.getX(0), 0, 0);
        help.addImagePart(pixture.getImage(0), -1);
        help.addMenuItem(0, false);
        help.setOrigScreen(sizex, sizey);

        helper = new MouseHelper();
        helper.setScrollIndex(4);
    }

    public void setCounter(int number){
        counter = number;
    }

    public boolean getCounter(){
        return counter < 1;
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
        pixture.setOpacity(0.1);
        pixture.addImage(0, pixture.getTextPicture(text));
        
        help.setItemImage(2, 0, pixture.getImage(0));
        help.setItemPosition(2, 640-pixture.getX(0), 0);
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

    public void update(int width, int height, int sysTime, int mouseScroll) {
        pic.update(width, height, sysTime, mouseScroll);
        scroll.update(width, height, sysTime, mouseScroll);
        help.update(width, height, sysTime, mouseScroll);
        if(mouseScroll == 0)
        	KeyControl.resetMouseWheel();
        helper.setMouseControl(sysTime);
        if(counter > 0 && helper.getScroll())
            counter--;
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
        if(KeyControl.getMouseY() < 20*help.getScaleY()){
            help.setPosition(0, 0);
            return true;
        }
        return false;
    }

    public void update(int timePassed) {}

    public void update(String name, int index, boolean isApplet,
            boolean seethru) {}

}
