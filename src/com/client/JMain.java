package com.client;

import com.jslix.system.Slix;


/**
 * JMain
 *
 * The handles displaying a game to the Screen using the JSlix engine.
 *
 * @author Crecen
 */
public class JMain extends Slix{

    public static String GAME_TITLE = "Custom Wars Tactics Pre-Alpha 0.6";

    public static void main(String[] argv) {
        JMain game = new JMain(640, 480);
        game.changeTitle(GAME_TITLE);

        if(argv.length > 0){
            if(argv[0].matches("java"))         game.showWindow();
            else if(argv[0].matches("slick"))   game.showSlick();
        }else
            game.showSlick();
    }

    public JMain(int width, int height){
        super(width, height);
        //SlixLibrary.removeFrameScreen(0);
        changeGame(new JSGMain());
    }
}
