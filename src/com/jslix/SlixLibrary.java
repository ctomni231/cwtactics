package com.jslix;

import com.jslix.state.Screen;

import java.util.ArrayList;

/**
 * SlixLibrary.java
 *
 * A remix of PraxisLibrary. Used to hold a list of Screens/States and store
 * them for display for both the Java2D and Slick graphic classes
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 11.07.10
 */
public class SlixLibrary {

    /**
     * Holds a list of Screens to be added to scrOrder;
     */
    private static ArrayList<Screen> scrList = new ArrayList<Screen>();
    /**
     * Holds a list of Screen to display to the window
     */
    protected static ArrayList<Screen> scrOrder = new ArrayList<Screen>();
    /**
     * Holds a list of Integers corresponding to Screen deletion
     */
    protected static ArrayList<Integer> delOrder = new ArrayList<Integer>();
    /**
     * Will force the Frame or Applet to exit
     */
    private static boolean exit = false;
    /**
     * Sets whether this is an applet or a frame
     */
    private static boolean isApplet = true;
    /**
     * This deals specifically with screen resizing for the Slick Window
     */
    private static boolean check = false;

    /**
     * Adds a screen to be displayed by the main window
     * @param theScreen The Screen to be added
     * @see Screen
     */
    public static void addFrameScreen(Screen theScreen){
        addFrameScreen(theScreen, "");
    }
    
    /**
     * Adds a screen to be displayed by the main window
     * @param theScreen The Screen to be added
     * @param name The name of the screen
     * @see Screen
     */
    public static void addFrameScreen(Screen theScreen, String name){
        theScreen.scr_name = name;
        theScreen.scr_isApplet = isApplet;
        scrList.add(theScreen);
    }
    
    /**
     * Schedules a screen for deletion using the index number
     * You can schedule as many screens for deletion as you
     * want in one sitting.
     *
     * @param index The index number screen to delete
     */
    public static void removeFrameScreen(int index){
        if(index >= 0 && index < scrOrder.size())
            delOrder.add(index);
    }

    /**
     * Schedules a Screen deletion for all Screens, therefore ending
     * the game.
     */
    public static void removeAllScreens(){
        for(int i = 0; i < scrOrder.size(); i++)
            removeFrameScreen(i);
    }

    /**
     * Attempts to return the index of the first instance of a named Screen
     * @param name The name of the Screen
     * @return The index of the named Screen
     */
    public static int getScreenIndex(String name){
        for(int i = 0; i < scrOrder.size(); i++){
            if(name.equals(scrOrder.get(i).scr_name))
                return i;
        }
        return -1;
    }

    /**
     * Brings the Screen specified by index to the front. Not tested
     * with Slick window, might bug out.
     *
     * @param index The screen to bring to the front
     */
    public static void bringScreenToFront(int index){
        moveScreen(index, 0);
    }

    /**
     * Moves the the indexed Screen to a new location in the array
     * @param index The indexed Screen
     * @param pos The new position to move it
     */
    public static void moveScreen(int index, int pos){
        if(scrOrder.size() > 1){
            if(index >= 0 && index < scrOrder.size() &&
                    pos >= 0 && pos < scrOrder.size())
                scrOrder.add(pos, scrOrder.remove(index));
        }
    }

    /**
     * This deletes screens from the list if they are scheduled
     */
    protected static void updateScreens(){
        //Checks if any of the Screen needs to be deleted
        while(delOrder.size() > 0)
            scrOrder.get(delOrder.remove(0)).scr_delete = true;

        //Stacks new screens onto the scrOrder
        while(scrList.size() > 0)
            scrOrder.add(0, scrList.remove(0));

        if(scrOrder.size() > 0){
            for(int i = 0; i < scrOrder.size(); i++){
                //New screens run their initialization when created
                if(scrOrder.get(i).scr_getNew())
                    scrOrder.get(i).scr_init();

                //Destroys screens that have been marked
                if(scrOrder.get(i).scr_delete){
                    scrOrder.get(i).scr_close();
                    scrOrder.remove(i);
                    i--;
                }
            }
        }
    }

    /**
     * How many screens are actively displaying to the window
     *
     * @return The number of displayable screens
     */
    public static int size(){
        return scrOrder.size();
    }

    /**
     * This function tells you whether this screen is an applet
     * @return Whether this screen is an applet(T) or not(F)
     */
    public static boolean isApplet(){
        return isApplet;
    }

    /**
     * Used to help a frame or applet quit
     */
    public static void quit(){
        exit = true;
    }

    /**
     * Used to see if it is okay to quit
     * @return If it is okay to quit
     */
    protected static boolean quitNow(){
        return exit;
    }

    /**
     * Used to help a frame resize
     */
    public static void check(){
        check = true;
    }

    /**
     * Used to see if it is okay to resize the screen
     * @return If it is okay to resize the screen
     */
    protected static boolean checkNow(){
        if(check){
            check = false;
            return !check;
        }
        return check;
    }

    /**
     * Sets the current screens as frame screens rather than applet screens
     */
    protected static void setFrame(){
        isApplet = false;
    }
}
