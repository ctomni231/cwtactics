package com.cwt;

import com.jslix.Slix;

/**
 * JMain.java
 * 
 * The handles displaying a game to the Screen using the JSlix engine.
 * 
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 11.07.10
 */
public class JMain extends Slix {

	private static final long serialVersionUID = 2452945053572843636L;

	/** Title of the game */
	public static String GAME_TITLE = "Custom Wars Tactics";
	/** Current verion */
	public static String GAME_VERSION = "Pre-Alpha 0.6";
	/** Width of the window normal */
	public final static int GAME_WIDTH = 640; // 480, 640
	/** Height of the window normal */
	public final static int GAME_HEIGHT = 480; // 320, 480

	/**
	 * The main class for starting a Java2D Frame or a Slick Frame window for
	 * the JSlix version of the game
	 * 
	 * @param argv
	 *            Arguments: slick=Slick2D window, java=java2D window,
	 *            full=Slick full screen (no resize)
	 */
	public static void main(String[] argv) {

		JMain game = new JMain(GAME_WIDTH, GAME_HEIGHT);
		game.changeTitle(GAME_TITLE + " " + GAME_VERSION);

		if (argv.length > 0) {
			if (argv[0].equals("java"))
				game.showWindow();
			else if (argv[0].equals("slick"))
				game.showSlick();
			else if (argv[0].equals("full"))
				game.showFull();
		} else
			game.showWindow();
	}

	/**
	 * This class contains the data for creating Screens that use the JSlix
	 * resizing screens for display.
	 * 
	 * @param width
	 *            Starting width for the screen
	 * @param height
	 *            Starting height for the screen
	 */
	public JMain(int width, int height) {
		super(width, height);
		// SlixLibrary.removeFrameScreen(0);
		changeGame(new JSGMain());
	}
}