package com.cwt.io;

import com.cwt.system.jslix.KeyPress;

/**
 * KeyControl.java
 *
 * A basic class for dealing with a small subset of predefined keys
 * This is meant to combine the Control and ID class into one
 * function.
 *
 * @author <ul><li>Carr, Crecen</li>
 *             <li>Radom, Alexander</li></ul>
 * @license Look into "LICENSE" file for further information
 * @version 10.28.10
 */
public class KeyControl {
    /*
     * Keyboard values
     */
    public static enum Keys{

        /** Action keys with values for keyboard keys */
        UP(200, 38), DOWN(208, 40), LEFT(203, 37), RIGHT(205, 39),
                                                   SELECT(44, 90),
                                                   CANCEL(45, 88);

        /** The Slick2D value of a key */
        private int slick;
        /** The Java2D value of a key */
        private int java;

        /**
         * This function accepts two values for a keyboard action
         * @param slickVal The slick value of the key
         * @param javaVal The java value of the key
         */
        Keys(int slickVal, int javaVal){
            slick = slickVal;
            java = javaVal;
        }

        /**
         * This function gets the Java2D value of a keyboard action
         * @return The Java2D value of a keyboard action
         */
        public int javaValue(){
            return java;
        }

        /**
         * This function gets the Slick2D value of a keyboard action
         * @return The Slick2D value of a keyboard action
         */
        public int slickValue(){
            return slick;
        }

        /**
         * This function sets the values contained in the actions to new values
         * @param slick The Slick2D representation of a keyboard press
         * @param java The Java2D representation of a keyboard press
         */
        public void setValues(int slick, int java){
            this.java = java;
            this.slick = slick;
        }
    }

    /**
     * Mouse values
     */
    public static enum Mouse{

        /** Action clicks with values for the mouse */
        SELECT(0, 1), CANCEL(1, 3);

        /** The Slick2D value of a mouse click */
        private int slick;
        /** The Java2D value of a mouse click */
        private int java;

        /**
         * This function accepts two values for a mouse click
         * @param slickVal The slick value of the mouse click
         * @param javaVal The java value of the mouse click
         */
        Mouse(int slickVal, int javaVal){
            slick = slickVal;
            java = javaVal;
        }

        /**
         * This function gets the Java2D value of a mouse action
         * @return The Java2D value of a mouse action
         */
        public int javaValue(){
            return java;
        }

        /**
         * This function gets the Slick2D value of a mouse action
         * @return The Slick2D value of a mouse action
         */
        public int slickValue(){
            return slick;
        }

        /**
         * This function sets the values contained in the actions to new values
         * @param slick The Slick2D representation of a mouse click
         * @param java The Java2D representation of a mouse click
         */
        public void setValues(int slick, int java){
            this.java = java;
            this.slick = slick;
        }
    }

    /**
     * This function checks to see if the user is actively pressing something
     * @return if a user a pressing an action(true) or not(false)
     */
    public static boolean isUserActive(){
        return KeyPress.userActive();
    }

    /**
     * This function tells you if the last action pressed was a mouse action
     * @return if the user pressed the mouse action last
     */
    public static boolean isMouseFocused(){
        return KeyPress.mouseFocused();
    }

    /**
     * This function gets the last key pressed by the user
     * @return The last key pressed
     */
    public static int getLastKey(){
        return KeyPress.lastKeyAction();
    }

    /**
     * This function gets the last mouse click done by the user
     * @return The last mouse click
     */
    public static int getLastMouse(){
        return KeyPress.lastMouseAction();
    }

    /**
     * This function converts Slick keys into Java keys and vice versa
     * depending on the window that is displayed
     * @param keycode The current key code to convert
     * @return A key code opposite to the window displayed
     */
    public static int getKeyConversion(int keycode){
        return KeyPress.getKeyConversion(keycode);
    }

    /**
     * Polls to see whether this is a Slick Window
     * @return whether this is a Slick Window (true) or a Java window (false)
     */
    public static boolean isSlickWindow(){
        return KeyPress.isSlickWindow();
    }

    /**
     * This function checks if a keyboard key was pressed
     * @param key The key value action
     * @return Whether this key was pressed (T) or not (F)
     */
    private static boolean isClicked( Keys key ){
        return KeyPress.isKeyPressed(KeyPress.isSlickWindow() ?
            key.slickValue() : key.javaValue());
    }

    /**
     * This function checks if a keyboard key was held down
     * @param key The key value action
     * @return Whether this key is held down (T) or not (F)
     */
    private static boolean isDown( Keys key ){
        return KeyPress.isKeyDown(KeyPress.isSlickWindow() ?
            key.slickValue() : key.javaValue());
    }

    /**
     * This function checks if a mouse button was clicked
     * @param mouse The mouse button action
     * @return Whether this mouse button was clicked (T) or not (F)
     */
    private static boolean isClicked( Mouse mouse ){
        return KeyPress.isMouseClicked(KeyPress.isSlickWindow() ?
            mouse.slickValue() : mouse.javaValue());
    }

    /**
     * This function checks if a mouse button was held down
     * @param mouse The mouse button action
     * @return Whether this mouse button was held down (T) or not (F)
     */
    private static boolean isDown( Mouse mouse ){
        return KeyPress.isMouseDown(KeyPress.isSlickWindow() ?
            mouse.slickValue() : mouse.javaValue());
    }

    /*
     * DIRECT ACCESS METHODS
     * *********************
     */

    /**
     * This function gets the x-axis location of the mouse
     * @return The x-axis location of the mouse
     */
    public static int getMouseX(){
    	return KeyPress.getMouseX();	
    }

    /**
     * This function gets the y-axis location of the mouse
     * @return The y-axis location of the mouse
     */
    public static int getMouseY(){
    	return KeyPress.getMouseY();	
    }

    /**
     * This function resets the mouse scroll wheel
     */
    public static void resetMouseWheel(){
    	KeyPress.resetMouseWheel();
    }

    /**
     * This function checks if the up action was clicked
     * @return Whether the up action was clicked (T) or not (F)
     */
    public static boolean isUpClicked(){
        return isClicked( Keys.UP ); 
    }

    /**
     * This function checks if the down action was clicked
     * @return Whether the down action was clicked (T) or not (F)
     */
    public static boolean isDownClicked(){
        return isClicked( Keys.DOWN ); 
    }

    /**
     * This function checks if the left action was clicked
     * @return Whether the left action was clicked (T) or not (F)
     */
    public static boolean isLeftClicked(){
        return isClicked( Keys.LEFT ); 
    }

    /**
     * This function checks if the right action was clicked
     * @return Whether the right action was clicked (T) or not (F)
     */
    public static boolean isRightClicked(){
        return isClicked( Keys.RIGHT ); 
    }

    /**
     * This function checks if the action was clicked
     * @return Whether the action was clicked (T) or not (F)
     */
    public static boolean isActionClicked(){
        return (isClicked( Keys.SELECT ) || isClicked( Mouse.SELECT )); 
    }

    /**
     * This function checks if cancel was clicked
     * @return Whether cancel was clicked (T) or not (F)
     */
    public static boolean isCancelClicked(){
        return (isClicked( Keys.CANCEL ) || isClicked( Mouse.CANCEL ));
    }

    /**
     * This function checks if the up action is held down
     * @return Whether the up action was held down (T) or not (F)
     */
    public static boolean isUpDown(){
        return isDown( Keys.UP ); 
    }

    /**
     * This function checks if the down action is held down
     * @return Whether the down action was held down (T) or not (F)
     */
    public static boolean isDownDown(){
        return isDown( Keys.DOWN ); 
    }

    /**
     * This function checks if the left action is held down
     * @return Whether the left action was held down (T) or not (F)
     */
    public static boolean isLeftDown(){
        return isDown( Keys.LEFT ); 
    }

    /**
     * This function checks if the right action is held down
     * @return Whether the right action was held down (T) or not (F)
     */
    public static boolean isRightDown(){
        return isDown( Keys.RIGHT ); 
    }

    /**
     * This function checks if action is held down
     * @return Whether action was held down (T) or not (F)
     */
    public static boolean isActionDown(){
        return (isDown( Keys.SELECT ) || isDown( Mouse.SELECT)); 
    }

    /**
     * This function checks if cancel is held down
     * @return Whether cancel was held down (T) or not (F)
     */
    public static boolean isCancelDown(){
        return (isDown( Keys.CANCEL ) || isDown( Mouse.CANCEL )); }
}
