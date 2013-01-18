package com.jslix.nightly;

import java.applet.Applet;
import java.awt.BorderLayout;
import javax.swing.JTextField;

/**
 * SlixApplet.java
 *
 * This is used to make a general java applet for the JSlix Screens
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.19.12
 */
public class NSlixApplet extends Applet{

    /** The Applet that holds the canvas container */
    private NSlixCanvas canvas;
    /** The Textfield for this particular Applet */
    private NSlixTextField textfield;

    /**
     * By Kevin of Slick2D: Altered by JSR.
     */
    @Override
    public void init() {
        removeAll();
        setLayout(new BorderLayout());
        setIgnoreRepaint(true);
        canvas = new NSlixCanvas(new TestGame());
        canvas.setSize(getWidth(), getHeight());
        add(canvas, BorderLayout.CENTER);
        canvas.setFocusable(true);
        canvas.requestFocus();
        canvas.setIgnoreRepaint(true);
        textfield = new NSlixTextField();
        add(textfield, BorderLayout.SOUTH);
        textfield.setFocusable(true);
        setVisible(true);
    }
    
    
}
