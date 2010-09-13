package com.client;

import com.jslix.system.SlixApplet;

/**
 * JApplet
 *
 * This handles displaying the JSlix game to an Applet
 *
 * @author Crecen
 */
public class JApplet extends SlixApplet {

    public JApplet(){
        super();
        //Use this function to add your game class to Slix so it'll
        //load your screens.
        changeGame(new JSGMain());
    }

}
