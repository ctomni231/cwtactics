package com.client.graphic;

import com.client.graphic.tools.MovingImage;
import com.client.graphic.tools.ScrollImage;
import com.client.graphic.tools.TextPix;
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
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.30.10
 */
public class LogoHandler implements ScreenSkeleton{

    private MovingImage pic;//This holds the Main Logo image
    private MovingImage logo;//This holds the Custom Wars main logo
    private MovingImage alt;//This holds the alternate logo image
    private MovingImage info;//This holds the information of the menu
    private ScrollImage scroll;//This holds the bottom scrolling text
    private HelpHandler help;//This holds the help bar
    private String helpPath;//This holds the path to the help logo image
    private int sizex;//This holds the current width of the screen
    private int sizey;//This holds the current height of the screen
    private String[] cool;//This combines the values pertaining to the text
    private int[] colors;//This holds a group of colors for color changes
    private ImgLibrary imgLib;//This holds an imgLibrary for changing colors

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
            String copyright){
        cool = new String[]{ title, pix, copyright, mini };
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
        help.init();
        help.setOrigScreen(sizex, sizey);
    }

    /**
     * This function gets a list of color changes for menu items
     * @param colorPath The path to the color list
     */
    public void setColorPath(String colorPath){
        imgLib = new ImgLibrary();
        imgLib.addImage(colorPath);
        colors = imgLib.getPixels(0);
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
     * This function is used to see if the help bar is visible
     * @return whether the help bar is visible(true) or not(false)
     */
    public boolean getCounter(){
        return help.getVisible();
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
        if(index == 1)
            logo.setFinalPosition(locx, locy);
        if(index == 2)
            scroll.setFinalPosition(locx, locy);
        if(index == 3)
            help.setFinalPosition(locx, locy);
        if(index == 4)
            alt.setFinalPosition(locx, locy);
        if(index == 5)
            info.setFinalPosition(locx, locy);
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
