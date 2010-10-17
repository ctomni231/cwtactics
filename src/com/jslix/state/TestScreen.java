package com.jslix.state;

import com.jslix.system.KeyPress;
import com.jslix.system.SlixLibrary;
import com.jslix.tools.ImgLibrary;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 * TestScreen
 *
 * A testing screen for the JSlix class.
 * 
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.24.10
 */

public class TestScreen extends Screen{
    private int counter;//This holds the updating rate for the class
    private ImgLibrary imgSort;//This holds an imageholder for the class

    /**
     * Sets up the picture and sets the screen to be see through
     */
    @Override
    public void init() {
        imgSort = new ImgLibrary();
        imgSort.addImage("image/AzariaMilhena.gif");
        scr_link = true;
    }

    /**
     * Draws the various elements for the Slick window including the
     * keyboard and mouse actions, an image, the update rate, and
     * the frames per second
     * @param g The Slick graphics object
     */
    @Override
    public void render(Graphics g) {
        g.drawImage(imgSort.getSlickImage(0), scr_index*20, scr_index*20);

        g.setColor(Color.blue);
        g.drawString("("+KeyPress.getMouseX()+","+KeyPress.getMouseY()+"),"
                +KeyPress.getMouseScroll(),
                scr_index*20+200, scr_index*20+40);
        g.setColor(Color.red);
        g.drawString("("+KeyPress.lastKeyAction()+"["+
                KeyPress.getKeyConversion(KeyPress.lastKeyAction())+"],"
                +KeyPress.lastMouseAction()+"["+
                KeyPress.getMouseConversion(KeyPress.lastMouseAction())+"])",
                scr_index*20+200, scr_index*20+60);
        g.setColor(Color.darkGray);
        g.drawString("("+scr_width+","+scr_height+"),"+scr_index,
                scr_index*20+200, scr_index*20+80);


        g.setColor(Color.yellow);
        g.drawString(""+counter,scr_index*20+0,scr_index*20+60);


    }

    /**
     * Draws the various elements for the Java2D window including the
     * keyboard and mouse actions, an image, the update rate, and
     * the frames per second
     * @param g The java2D graphics object
     * @param dthis The java2D component object
     */
    @Override
    public void render(Graphics2D g, Component dthis) {
       g.drawImage(imgSort.getImage(0), scr_index*20, scr_index*20, dthis);

        g.setColor(java.awt.Color.BLUE);
        g.drawString("("+KeyPress.getMouseX()+","+KeyPress.getMouseY()+"),"
                +KeyPress.getMouseScroll(),
                scr_index*20+200, scr_index*20+40);
        g.setColor(java.awt.Color.RED);
        g.drawString("("+KeyPress.lastKeyAction()+"["+
                KeyPress.getKeyConversion(KeyPress.lastKeyAction())+"],"
                +KeyPress.lastMouseAction()+"["+
                KeyPress.getMouseConversion(KeyPress.lastMouseAction())+"])",
                scr_index*20+200, scr_index*20+60);
        g.setColor(java.awt.Color.DARK_GRAY);
        g.drawString("("+scr_width+","+scr_height+"),"+scr_index,
                scr_index*20+200, scr_index*20+80);

        g.setColor(java.awt.Color.YELLOW);
        g.drawString(""+counter,scr_index*20+0,scr_index*20+60);
    }

    /**
     * This updates the graphics based on various actions done by the user
     * and by the engine
     * @param timePassed negative values (Java2D) & positive values (Slick2D)
     */
    @Override
    public void update(int timePassed) {
        if(scr_index == 0)
            counter++;

        if(timePassed < 0){
            if(KeyPress.isMouseClicked(1)){
                SlixLibrary.addFrameScreen(new TestScreen());
            }

            if(KeyPress.isMouseClicked(3)){
                SlixLibrary.removeFrameScreen(0);
            }

            if(KeyPress.isMouseClicked(2)){
                SlixLibrary.bringScreenToFront(1);
            }
        }else{
            if(KeyPress.isMouseClicked(0)){
                SlixLibrary.addFrameScreen(new TestScreen());
            }

            if(KeyPress.isMouseClicked(1)){
                SlixLibrary.removeFrameScreen(0);
            }

            if(KeyPress.isMouseClicked(2)){
                SlixLibrary.bringScreenToFront(1);
            }
        }
    }
}
