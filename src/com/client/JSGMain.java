package com.client;

import com.client.screen.MainMenuScreen;
import com.jslix.system.SlixGame;
import com.jslix.system.SlixLibrary;
import org.newdawn.slick.AppGameContainer;
import org.newdawn.slick.SlickException;

/**
 * JMainGame
 *
 * This gives functionality to all JSlix Windows including all Java and
 * Slick frames and applets. Specifically, this class runs the Slick applet
 * and allows you to add Screens to the game.
 *
 * @author Crecen
 */
public class JSGMain extends SlixGame{

    public static void main(String[] args){
        try{
            AppGameContainer app = new AppGameContainer(new JSGMain());

            //YOU MAY SET NEW SIZE VALUES FOR THE APPLET HERE
            //Make sure you match them in the .html, or it won't work.
            app.setDisplayMode( 480, 320, false );
            app.start();
        } catch ( SlickException e ) {
            e.printStackTrace();
        }
    }

    @Override
    public void loadGame(){
        //DO ALL YOUR INITIALIZATIONS FOR YOUR SCREENS HERE!!!
        SlixLibrary.addFrameScreen(new MainMenuScreen());
        //Make sure you use SlixLibrary to add the Screens
        //Also a good place to do all the initialzation stuff
    }
}
