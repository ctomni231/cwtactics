package com.jslix.system;

/**
 * UserSys
 *
 * A library to show users how to create your own libraries using JSlix.
 * An extended SlixGame is REQUIRED for Java and Slick frames and applets.
 * You should copy these classes exactly replacing the current names for
 * your own for instant functionality.
 *
 * JSlixApplet
 *
 * A small tutorial on how to overwrite the Slix function to create your
 * own Screens. It requires that you already have overwritten SlixGame.
 * You can create the Java Applet here.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.10.10
 */

//TODO: Finish commenting this class
public class JSlixApplet extends SlixApplet{

    //This is the only function needed to create java applets
    public JSlixApplet(){
        super();
        //Use this function to add your game class to Slix so it'll
        //load your screens.
        changeGame(new JSlixGame());
    }
}
