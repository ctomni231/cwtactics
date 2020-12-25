package com.jslix;

import java.util.HashMap;

/**
 * A simple remix of UserAction. Instead of storing keyboard and mouse
 * actions, this class will help translate Slick key presses into Java
 * key presses and vice-versa for the keyboard and the mouse. Useful since
 * Slick mentions all keys in terms of numbers, but Java has the String
 * values for each key. Simplified for this game
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 07.13.20
 */

public class KeyPress {
	
	//Holds a list of stored actions
    private static HashMap<KeyIndex, Integer> conveyor = null;
    //Holds a temporary stored key or mouse press
    private static KeyIndex temp = new KeyIndex();
    //Holds the value of the last key pressed;
    private static int lastKey = -1;
    //Holds the value of the last mouse action pressed
    private static int lastMouse = -1;
	
	//Holds whether the last action done was a mouse action
    public static boolean mouseFocus;
    //Holds the current horizontal location of the mouse
    public static int mouseX;
    //Holds the current vertical location of the mouse
    public static int mouseY;
    //Holds the current scroll value of the mouse;
    public static int mouseScroll;
    
    /**
     * Gets the current value of the horizontal axis of the mouse
     * @return The horizontal axis of the mouse
     */
    public static int getMouseX(){
        return mouseX;
    }

    /**
     * Gets the current value of the vertical axis of the mouse
     * @return The vertical axis of the mouse
     */
    public static int getMouseY(){
        return mouseY;
    }

    /**
     * Gets whether the last user action was a mouse action
     * @return Whether the last action by the user was a mouse action
     */
    public static boolean mouseFocused(){
        return mouseFocus;
    }

    /**
     * Gets the scroll wheel value of the mouse
     * @return The direction of the scroll click
     */
    public static int getMouseScroll(){
        return mouseScroll;
    }
    
    /**
     * This sets the scroll wheel to steady
     */
    public static void resetMouseWheel(){
    	mouseScroll = 0;
    }
    /**
     * Whether user is actively pressing a control
     * @return Whether a user is causing input
     */
    public static boolean userActive(){
        return !conveyor.isEmpty();
    }
    
    /**
     * Holds the last Key action registered by the user
     * @return The last key registered
     */
    public static int lastKeyAction(){
        return lastKey;
    }

    /**
     * Holds the last mouse action registered by the user
     * @return The last mouse click registered
     */
    public static int lastMouseAction(){
        return lastMouse;
    }
    
    /**
     * Tests to see if a key is held down
     * @param keycode The key to test
     * @return if key is held down
     */
    public static boolean isKeyDown(int keycode){
        temp.code = keycode;
        temp.index = 0;

        if(conveyor == null)    clearAll();
        return conveyor.containsKey(temp) && keycode == lastKey;
    }

    /**
     * Tests to see if a mouse button is held down
     * @param mousebutton The mouse click to test
     * @return if button is held down
     */
    public static boolean isMouseDown(int mousebutton){
        temp.code = mousebutton;
        temp.index = 1;

        if(conveyor == null)    clearAll();
        return conveyor.containsKey(temp) && mousebutton == lastMouse;
    }

    /**
     * Tests to see if a key was pressed
     * @param keycode The key to test
     * @return if key was pressed
     */
    public static boolean isKeyPressed(int keycode){
        if(isKeyDown(keycode)){
            if(conveyor.get(temp) == 1){
                conveyor.put(temp, 0);
                return true;
            }
        }
        return false;
    }

    /**
     * Checks to see if a mouse button was pressed
     * @param mousebutton The mouse button to check
     * @return if it was clicked
     */
    public static boolean isMouseClicked(int mousebutton){
        if(isMouseDown(mousebutton)){
            if(conveyor.get(temp) == 1){
                conveyor.put(temp, 0);
                return true;
            }
        }
        return false;
    }
    
    /**
     * Conserves memory by clearing all references from the list
     */
    public static void clearAll(){
    	if(conveyor != null)   conveyor.clear();
        else                   conveyor = new HashMap<KeyIndex, Integer>();
    }
    
    /**
     * Adds a user key action to the array
     * @param keycode The action to add
     * @param slick Whether it is a Slick action
     */
    public static void addKeyPress(int keycode){
        temp.code = keycode;
        temp.index = 0;
        lastKey = keycode;
        mouseFocus = false;
        alterKeyPress(temp, true);
    }

    /**
     * Adds a user mouse action to the array
     * @param mousebutton The mouse action to add
     * @param slick Whether it is a Slick action
     */
    public static void addMouseClick(int mousebutton){
        temp.code = mousebutton;
        temp.index = 1;
        lastMouse = mousebutton;
        mouseFocus = true;
        alterKeyPress(temp, true);
    }

    /**
     * Removes a key press from the list of key presses
     * @param keycode The key to remove
     */
    public static void removeKeyPress(int keycode){
        temp.code = keycode;
        temp.index = 0;
        lastKey = -1;
        alterKeyPress(temp, false);
    }

    /**
     * Removes mouse clicks from the array
     * @param mousebutton The button to remove
     */
    public static void removeMouseClick(int mousebutton){
        temp.code = mousebutton;
        temp.index = 1;
        lastMouse = -1;
        alterKeyPress(temp, false);
    }
    
    
    /**
     * This function adds a key if it doesn't exist in the system, or removes
     * a key if it already exists in the system
     * @param type The type of key to add or remove from the system
     * @param add Whether you want to add a key (T) or remove a key (F)
     */
    private static void alterKeyPress(KeyIndex type, boolean add){
        if(conveyor == null)    clearAll();
        if(add && !conveyor.containsKey(type))
            conveyor.put(type, 1);
        else if(!add && conveyor.containsKey(type))
            conveyor.remove(type);
    }
}
