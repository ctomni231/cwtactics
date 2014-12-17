package com.jslix;

import com.jslix.state.JTestScreen;

import org.newdawn.slick.AppGameContainer;
import org.newdawn.slick.SlickException;

/**
 * UserSys
 *
 * A library to show users how to create your own libraries using JSlix.
 * An extended SlixGame is REQUIRED for Java and Slick frames and applets.
 * You should copy these classes exactly replacing the current names for
 * your own for instant functionality.
 *
 * JSlixGame
 *
 * A small tutorial on how to overwrite the Slix function to create your
 * own Screens. This is the main hub for all Slick Screens and Java
 * Screens. Descriptions below will tell you what overwriting functions
 * do. You can create the Slick Applet here.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.10.10
 */

public class JSlixGame extends SlixGame{

    /**
     * This function is used for creating Slick applets
     * @param args No arguments available
     */
    public static void main(String[] args){
        try{
            AppGameContainer app = new AppGameContainer(new JSlixGame());

            //YOU MAY SET NEW SIZE VALUES FOR THE APPLET HERE
            //Make sure you match them in the .net.wolfTec.html, or it won't work.
            app.setDisplayMode( 500, 500, false );
            app.start();
        } catch ( SlickException e ) {
            e.printStackTrace();
        }
    }

    /**
     * This function is used for loading and initializing screens into
     * the JSlix classes. It is required that this function is overridden
     * and used when trying to upload you own screens into the window.
     */
    @Override
    public void loadGame(){
        //DO ALL YOUR INITIALIZATIONS FOR YOUR SCREENS HERE!!!
        SlixLibrary.addFrameScreen(new JTestScreen());
    }
}
