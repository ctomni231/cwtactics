package com.jslix.system;

import java.applet.Applet;
import java.awt.BorderLayout;

/**
 * SlixApplet.java
 *
 * This is used to make a general java applet for the JSlix Screens
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.19.12
 */
public class SlixApplet extends Applet{

    /** The Applet that holds the canvas container */
    private SlixCanvas canvas;

    /**
     * By Kevin of Slick2D: Altered by JSR.
     */
    @Override
    public void init() {
        removeAll();
        setLayout(new BorderLayout());
        setIgnoreRepaint(true);
        canvas = new SlixCanvas(new TestGame());
        canvas.setSize(getWidth(), getHeight());
        add(canvas);
        canvas.setFocusable(true);
        canvas.requestFocus();
        canvas.setIgnoreRepaint(true);
        setVisible(true);
    }
}
