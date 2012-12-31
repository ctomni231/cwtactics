package com.jslix.system;

import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

import javax.swing.JTextField;

/**
 * We might have to implement a separate KeyListener for the Textfield events and store them within the
 * new textfield. It can only get Keys when it is focused on.
 * It needs a getText function and it'll store it separate so it can be extracted from the Textfield
 * This completely breaks the ability for JSlix to be fullscreen.
 * 
 * @author Ctomni
 *
 */
public class SlixTextField extends JTextField implements KeyListener{
	
	public SlixTextField(){
		super();
		addKeyListener(this);
	}

	//@Override
	public void keyPressed(KeyEvent e) {
			
	}

	
        //@Override
	public void keyReleased(KeyEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	//@Override
	public void keyTyped(KeyEvent e) {
            System.out.println("Pressed Key");
	}

	
}
