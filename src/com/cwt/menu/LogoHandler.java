package com.cwt.menu;

import com.cwt.menu.tools.MovingImage;
import com.cwt.menu.tools.ScrollImage;
import com.cwt.menu.tools.TextPix;
import com.cwt.tools.KeyControl;
import com.jslix.image.ImgLibrary;
import com.jslix.io.MouseHelper;
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
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.31.11
 */
public class LogoHandler implements ScreenSkeleton{

    /** How fast the menu scrolls */
    public final int SCROLL_SPEED = 2;

    /** This holds the Main Logo image */
    private MovingImage pic;
    /** This holds the Custom Wars main logo */
    private MovingImage logo;
    /** This holds the alternate logo image */
    private MovingImage alt;
    /** This holds the information of the menu */
    private MovingImage info;
    /** This holds the loading symbol */
    private TitleGUI load;
    /** This holds the bottom scrolling text */
    private ScrollImage scroll;
    /** This holds the help bar */
    private HelpHandler help;
    /** This holds the path to the help logo image */
    private String helpPath;
    /** This holds the current width of the screen */
    private int sizex;
    /** This holds the current height of the screen */
    private int sizey;
    /** This combines the values pertaining to the text */
    private String[] cool;
    /** This holds a group of colors for color changes */
    private int[] colors;
    /** This holds an imgLibrary for changing colors */
    private ImgLibrary imgLib;
    /** Regulates the delay of the loading logo */
    private MouseHelper helper;
    /** Helps control the visibility of the loading logo */
    private int counter;

    /**
     * This class handles all moving elements within the title screen of the
     * main option screen and controls their overall positioning.
     * @param help The path to the help icon image
     * @param width The current width of the screen
     * @param height The current height of the screen
     */
    public LogoHandler(String help, int width, int height){      
        sizex = width;
        sizey = height;
        helpPath = help;
        helper = new MouseHelper();
        helper.setScrollIndex(SCROLL_SPEED);
        counter = 0;
        imgLib = new ImgLibrary();
    }

    /**
     * This function sets up all the moving elements in the window and
     * initializes them for display
     * @param title The path to the main logo
     * @param mini The path to the alternate logo image
     * @param pix THe path to the picture logo
     * @param copyright The copyright scrolling text
     */
    public void init(String title, String mini, String pix, 
            String copyright, String loading, String faction){
        cool = new String[]{ title, pix, copyright, mini, loading, faction };
        pic = new MovingImage(145, -100, 1);
        pic.setImage(cool[0], 350, 150);

        pic.setShadowColor(Color.BLACK);
        pic.setShadowOffset(2);
        pic.setOrigScreen(sizex, sizey);

        alt = new MovingImage(430, 480, 1);
        alt.setImage(cool[3], 200, 25);
        alt.setOpacity(0.9);

        alt.setShadowColor(Color.BLACK);
        alt.setShadowOffset(2);
        alt.setOrigScreen(sizex, sizey);

        info = new MovingImage(5, 480, 1);
        info.setImage("-");

        info.setShadowColor(Color.BLACK);
        info.setShadowOffset(2);
        info.setOrigScreen(sizex, sizey);

        load = new TitleGUI(620, 0, 1);
        load.setImage(cool[4], 20, 20);

        load.setShadowColor(Color.BLACK);
        load.setShadowOffset(1);
        load.setOrigScreen(sizex, sizey);

        logo = new MovingImage(0, -150, 1);
        logo.setImage(cool[1], 125, 125);
        logo.setOrigScreen(sizex, sizey);

        logo.setShadowColor(Color.BLACK);
        logo.setShadowOffset(2);
        logo.setOrigScreen(sizex, sizey);

        scroll = new ScrollImage(0, 480, 640, 20, 1);
        scroll.setScrollIndex(25);
        scroll.setTextImage(" - ");
        scroll.setOrigScreen(sizex, sizey);

        help = new HelpHandler(helpPath, 0, -20, 1);
        help.setOrigScreen(sizex, sizey);
        help.init();       
    }

    /**
     * This function sets the loading icon image
     * @param index The faction color index
     */
    public void setLoadIcon(int index){
        if(index*16 >= 0 && index*16 < colors.length)
            load.setImage(TextPix.getCutImage(cool[5],
                    0, index*14, 14, 14), 20, 20);
        else
            load.setImage(cool[4], 20, 20);
    }

    /**
     * This function gets a list of color changes for menu items
     * @param colorPath The path to the color list
     */
    public void setColorPath(String colorPath){
        colors = TextPix.getImgPixels(colorPath);
    }

    /**
     * This function changes the color based on the menu colors
     * @param index Which index of colors to use for this menu
     */
    public void setColor(int index){
        index *= 16;

        if(index >= 0 && index < colors.length){
            if(pic != null){
                pic.resetColor();
                pic.addColor(new Color(255,0,0),
                        new Color(colors[index+9+2]));
                pic.addColor(new Color(127,0,0),
                        new Color(colors[index+9+5]));
            }

            if(load != null){
                load.resetColor();
                load.addColor(new Color(255,0,0),
                        new Color(colors[index+9+2]));
                load.addColor(new Color(127,0,0),
                        new Color(colors[index+9+5]));
            }

            if(info != null){
                info.resetColor();
                info.addColor(new Color(160, 160, 160),
                    new Color(colors[index+9+3]));
                info.addColor(new Color(128, 128, 128),
                    new Color(colors[index+9+4]));
            }

            if(scroll != null){
                scroll.setBoxColor(
                        imgLib.getColor(new Color(colors[index+9+5]), 127));
                scroll.setTextColor(
                        imgLib.getColor(new Color(colors[index+9+0]), 200));
            }

            if(help != null){
                help.resetColor();
                help.setItemColor(0,
                        imgLib.getColor(new Color(colors[index+9+5]), 127));
                help.addColor(imgLib.getColor(Color.WHITE, 127),
                        imgLib.getColor(new Color(colors[index+9+0]), 200));
            }
        }else{
            if(pic != null)
                pic.resetColor();

            if(load != null)
                load.resetColor();

            if(info != null)
                info.resetColor();

            if(scroll != null){
                scroll.setBoxColor(new Color(60, 60, 60, 127));
                scroll.setTextColor(new Color(255, 255, 255, 127));
            }

            if(help != null){
                help.resetColor();
                help.setItemColor(0, imgLib.getColor(Color.DARK_GRAY, 127));
            }
        }
    }

    /**
     * This function controls how much seconds the help bar stays
     * hidden before it is visible again.
     * @param number The amount of time in quarter seconds
     */
    public void setCounter(int number){
        help.setCounter(number);
    }

    /**
     * This function controls how much seconds the faction logo stays
     * visible before disappearing
     * @param number The amount of time in quarter seconds
     */
    public void setFactionCounter(int number){
        counter = number;
    }

    /**
     * This function is used to see if the help bar is visible
     * @return whether the help bar is visible(true) or not(false)
     */
    public boolean getCounter(){
        return help.getVisible();
    }

    /**
     * This function is used to see if the faction logo is visible
     * @return whether the help bar is visible(true) or not(false)
     */
    public boolean isFactionVisible(){
        return (counter > 0);
    }

    /**
     * Gets the current text string used in the help bar
     * @return The help text
     */
    public String getHelpText(){
        return help.getHelpText();
    }

    /**
     * Sets the Help Bar right-justify position
     * @param offset The distance away from the screen
     */
    public void setHelpJustify(int offset){
        help.setPosition(offset);
    }

    /**
     * Sets the opacity for the loading icon
     * @param opac How opaque this object is
     */
    public void setLoadOpacity(double opac){
        load.setOpacity(opac);
    }

    /**
     * This function is used to set the final position for the moving objects
     * within this screen
     * @param index The index representation of an moving object
     * @param locx The new x-axis location of the object
     * @param locy The new y-axis location of the object
     */
    public void setFinalPosition(int index, int locx, int locy){
        if(index == 0)
            pic.setFinalPosition(locx, locy);
        else if(index == 1)
            logo.setFinalPosition(locx, locy);
        else if(index == 2)
            scroll.setFinalPosition(locx, locy);
        else if(index == 3)
            help.setFinalPosition(locx, locy);
        else if(index == 4)
            alt.setFinalPosition(locx, locy);
        else if(index == 5)
            info.setFinalPosition(locx, locy);
        else if(index == 6)
            load.setFinalPosition(locx, locy);
    }

    /**
     * Sets the opacity of the help menu bar and help bar items
     * @param opac The opacity value between 0.0 - 1.0
     */
    public void setHelpOpacity(double opac){
        help.setOpacity(opac);
    }

    /**
     * This function gets the help text for display
     * @return The String representing the help text
     */
    public void setHelpText(String text){
        help.setHelpText(text);
    }

    /**
     * This function gets the help text for display
     * @return The String representing the help text
     */
    public void setInfoText(String text){
        info.setImage(TextPix.getTextImg(text));
    }

    /**
     * This function sets the default scroll text for the bottom scroll bar
     */
    public void setScrollText(){
    	if(!scroll.getText().matches(cool[2]+".*"))
    		scroll.setTextImage(cool[2]+
    				"                                       ");
    }
    /**
     * This function changes the bottom scroll text to what you specify
     * @param text The text to display in the scroll bar
     */
    public void setScrollText(String text){
        if(!scroll.getText().matches(text+".*"))
            scroll.setTextImage(text+"                                   ");
    }

    /**
     * This function does not check if the text exists already before
     * changing the bottom scroll text. Great if you have characters that
     * are not compatible with pattern matching.
     * @param text The text to display in the scroll bar
     */
    public void forceScrollText(String text){
        scroll.setTextImage(text+"                                   ");
    }

    /**
     * This updates all the displayed items on the screen
     * @param width The current width of the screen
     * @param height The current height of the screen
     * @param sysTime The system time in milliseconds
     * @param mouseScroll The current mouse scroll wheel
     */
    public void update(int width, int height, int sysTime, int mouseScroll) {
        pic.update(width, height, sysTime, mouseScroll);
        logo.update(width, height, sysTime, mouseScroll);
        scroll.update(width, height, sysTime, mouseScroll);
        help.update(width, height, sysTime, mouseScroll);
        alt.update(width, height, sysTime, mouseScroll);
        info.update(width, height, sysTime, mouseScroll);
        load.update(width, height, sysTime, mouseScroll);
        helper.setMouseControl(sysTime);
        if(counter > 0 && helper.getScroll())
            counter--;
        if(mouseScroll == 0)
            KeyControl.resetMouseWheel();
    }

    /**
     * This renders the moving objects to the screen
     * @param g Graphics object for Slick
     */
    public void render(Graphics g) {
        pic.render(g);
        alt.render(g);
        logo.render(g);
        info.render(g);
        scroll.render(g);
        help.render(g);
        load.render(g);
    }

    /**
     * This renders the moving objects to the Screen
     * @param g Graphics object for Java2D
     * @param dthis Component object for Java2D
     */
    public void render(Graphics2D g, Component dthis) {
        pic.render(g, dthis);
        alt.render(g, dthis);
        logo.render(g, dthis);
        info.render(g, dthis);
        scroll.render(g, dthis);
        help.render(g, dthis);
        load.render(g, dthis);
    }

    /**
     * This function checks to see if the mouse is hovering over the mouse
     * bar
     * @return whether the mouse is hovering over the bar(true) or not(false)
     */
    public boolean checkHelp(){
        return help.checkHelp();
    }

    public void init(){}

    public void update(int timePassed) {}

    public void update(String name, int index, boolean isApplet,
            boolean seethru) {}

}
