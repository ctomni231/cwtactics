package com.client;

import com.jslix.system.SlixApplet;

/**
 * JApplet.java
 *
 * This handles displaying the JSlix game to an Applet
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.21.10
 */
public class JApplet extends SlixApplet {

	private static final long serialVersionUID = 2452945053572843636L;
	/*
     * Contains the code for making a Java2D Applet from the JSlix
     * Screens.
     */
    public JApplet(){
        super();
        //Use this function to add your game class to Slix so it'll
        //load your screens.
        changeGame(new JSGMain());
    }
}