package com.jslix.system;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.image.BufferedImage;
import javax.swing.JFrame;
import javax.swing.JTextField;
import org.newdawn.slick.SlickException;

/**
 * Slix.java
 *
 * This class contains the basics for the screen system
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.19.12
 */

public class Slix {

    /**
     * This class allows you to create Java2D or Slick2D frames from
     * a list of screens contained in a SlixGame extended class. The
     * Slick2D frame requires natives in order to run.
     * @param argv "java" = java2D, "slick" = Slick2D (req natives)
     */
    public static void main(String[] argv) {       
        Slix game = new Slix(480, 320);
        if(argv.length > 0){
            //if(argv[0].matches("java"))         game.showWindow();
            //else if(argv[0].matches("slick"))   game.showSlick();
        }else
            game.showSlick();
    }

    /** The window that holds the frame of the game */
    private JFrame window;
    /** This holds the Slick version of the game (resize) */
    private SlixCanvas contain;
    /** This holds the game of the CanvasGameContainer */
    private TestGame game;
    /** The title of the window */
    private String mainTitle;
    /** The width of the window */
    private int sizex;
    /** The height of the window */
    private int sizey;
    /** The image used for Graphics (BackgroundImage) */
    private BufferedImage bimg;
    /** Controls whether the frame rate is shown */
    private boolean showRate;
    /** Controls whether the log messages are shown to the screen */
    private boolean showLog;
    /** Holds the keyboard and mouse id actions */
    private int id;
    /** Holds whether to update each frame for slick (default:false) */
    private boolean frameUpdate;
    /** Holds a temporary Screen */
    //private Screen tempScreen;
    /** Holds a variable so only the top screen displays */
    private int scrStart;
    /** The Textfield for this particular Applet */
    private JTextField textfield;

    /**
     * This class creates a Java2D or Slick2D screen with a starting
     * width and height
     * @param width The x-axis length of the screen
     * @param height The y-axis length of the screen
     */
    public Slix(int width, int height){
        initialize(width, height);
    }

    /**
     * This function initializes and displays a Slick2D frame
     */
    public void showSlick(){
    	if(game == null)
            game = new TestGame();

        contain = new SlixCanvas(game);
        contain.setSize(sizex, sizey);
        window.setSize(sizex, sizey);
        window.add(contain, BorderLayout.CENTER);
        textfield = new JTextField();
        window.add(textfield, BorderLayout.SOUTH);
        textfield.setFocusable(true);
        window.validate();
        window.setVisible(true);
        window.pack();

    }

    /**
     * This function initializes the Slick and Java2D general functions,
     * but does not uses any resources for setting up the windows
     * @param width The x-axis length of the screen
     * @param height The y-axis length of the screen
     */
    private void initialize(int width, int height){
    	mainTitle = "JSlix Window";
        sizex = width;
        sizey = height;
        showRate = false;
        window = new JFrame(mainTitle);
        window.setBackground(Color.BLACK);
        //setBackground(Color.BLACK);
        frameUpdate = true;
        //SlixLibrary.setFrame();
    }
}
