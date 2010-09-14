package com.client.input;

import com.jslix.system.KeyPress;

/**
 * KeyControl.java
 *
 * A basic class for dealing with a small subset of predefined keys
 * This is meant to combine the Control and ID class into one
 * function.
 *
 * @author JakeSamiRulz & Tapsi
 */
public class KeyControl {
    /*
     * Keyboard values
     */
    public static enum Keys{
        // action keys with values for keyboard keys
        UP(200, 38), DOWN(208, 40),
        RIGHT(205, 39), LEFT(203, 37),
        ENTER(44, 90),CANCEL(45, 88);

        // key value of the key
        private int slick;
        private int java;

        Keys(int slickVal, int javaVal){
            slick = slickVal;
            java = javaVal;
        }

        // Access Methods
        public int javaValue(){
            return java;
        }
        public int slickValue(){
            return slick;
        }
        public void setValues(int slick, int java){
            this.java = java;
            this.slick = slick;
        }
    }

    /**
     * Mouse values
     */
    public static enum Mouse{

        //action clicks with clicks for the mouse
        ENTER(0, 1), CANCEL(1, 3);

        private int slick;
        private int java;

        Mouse(int slickVal, int javaVal){
            slick = slickVal;
            java = javaVal;
        }

        // Access Methods
        public int javaValue(){
            return java;
        }
        public int slickValue(){
            return slick;
        }
        public void setValues(int slick, int java){
            this.java = java;
            this.slick = slick;
        }
    }

    /**
     * Is a button clicked ?
     */
    private static boolean isClicked( Keys key ){
        if(KeyPress.isSlickWindow())
            return KeyPress.isKeyPressed( key.slickValue() );
        else
            return KeyPress.isKeyPressed( key.javaValue() );
    }

    /**
     * Is a button hold ?
     */
    private static boolean isDown( Keys key ){
        if(KeyPress.isSlickWindow())
            return KeyPress.isKeyDown( key.slickValue() );
        else
            return KeyPress.isKeyDown( key.javaValue() );
    }

    /**
     * Is a mouse button clicked ?
     */
    private static boolean isClicked( Mouse mouse ){
        if(KeyPress.isSlickWindow())
            return KeyPress.isMouseClicked( mouse.slickValue() );
        else
            return KeyPress.isMouseClicked( mouse.javaValue() );
    }

    /**
     * Is a mouse button hold ?
     */
    private static boolean isDown( Mouse mouse ){
        if(KeyPress.isSlickWindow())
            return KeyPress.isMouseDown( mouse.slickValue() );
        else
            return KeyPress.isMouseDown( mouse.javaValue() );
    }

    /*
     * DIRECT ACCESS METHODS
     * *********************
     */

    // IS CLICKED
    public static boolean isUpClicked(){
        return isClicked( Keys.UP ); }
    public static boolean isDownClicked(){
        return isClicked( Keys.DOWN ); }
    public static boolean isLeftClicked(){
        return isClicked( Keys.RIGHT ); }
    public static boolean isRightClicked(){
        return isClicked( Keys.LEFT ); }
    public static boolean isActionClicked(){
        return (isClicked( Keys.ENTER ) || isClicked( Mouse.ENTER )); }
    public static boolean isCancelClicked(){
        return (isClicked( Keys.CANCEL ) || isClicked( Mouse.CANCEL )); }

    // IS DOWN
    public static boolean isUpDown(){
        return isDown( Keys.UP ); }
    public static boolean isDownDown(){
        return isDown( Keys.DOWN ); }
    public static boolean isLeftDown(){
        return isDown( Keys.RIGHT ); }
    public static boolean isRightDown(){
        return isDown( Keys.LEFT ); }
    public static boolean isActionDown(){
        return (isDown( Keys.ENTER ) || isDown( Mouse.ENTER)); }
    public static boolean isCancelDown(){
        return (isDown( Keys.CANCEL ) || isDown( Mouse.CANCEL )); }
}
