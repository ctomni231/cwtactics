package com.jslix.system;

/**
 * UserSys
 *
 * A library to show users how to create your own libraries using JSlix.
 * An extended SlixGame is REQUIRED for Java and Slick frames and applets.
 * You should copy these classes exactly replacing the current names for
 * your own for instant functionality.
 *
 * JSlix
 *
 * A small tutorial on how to overwrite the Slix function to create your
 * own Screens. It requires that you already have overwritten SlixGame.
 * You can create both the Java and the Slick window here.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.12.10
 * @todo TODO Finish commenting this class
 */

public class JSlix extends Slix{

    //This function allows you to create either a Java frame or a Slick frame
    //Creating a Java frame uses JSlix.showWindow() and it does not require
    //natives.
    //Creating a Slick frame uses JSlix.showSlick() and it does require
    //natives through a classpath.
    
	public static void main(String[] argv){
        //Determine the starting size of the window here. Users can resize
        //either frame at will.
        JSlix game = new JSlix(480, 320);

        //This section of code allows you to use arguments to decipher
        //which Screen to display (optional)
        if(argv.length > 0){
            if(argv[0].matches("java"))         game.showWindow();
            else if(argv[0].matches("slick"))   game.showSlick();
        }else
            game.showWindow();
    }

    //You must extend the constructor like this. The width and the height
    //determine the starting width and height of the window.
    public JSlix(int width, int height){
        super(width, height);
        //Use this function to add your game class to Slix so it'll
        //load your screens.
        SlixLibrary.removeFrameScreen(0);
        changeGame(new JSlixGame());
    }
}
