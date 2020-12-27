package com.cwt;

import com.cwt.screen.BattleScreen;
import com.cwt.screen.TestBed;
import com.jslix.JSlix;

public class CWTactics extends JSlix {
	
	private static final long serialVersionUID = 2452945053572843636L;
	
	/** Title of the game */
	public static String GAME_TITLE = "Custom Wars Tactics";
	/** Current version */
	public static String GAME_VERSION = "Pre-Alpha 0.1";
	/** Width of the window normal */
	public final static int GAME_WIDTH = 640; // 480, 640
	/** Height of the window normal */
	public final static int GAME_HEIGHT = 480; // 320, 480
	
	public static void main(String[] argv) {
		CWTactics game = new CWTactics(GAME_WIDTH, GAME_HEIGHT);
		game.changeTitle(GAME_TITLE + " " + GAME_VERSION);
		game.changeBackground(java.awt.Color.WHITE);
		game.showWindow();
	}
	
	/**
	 * This is a slim class to add the first screen on the list
	 * @param width The initial width of the window
	 * @param height The initial height of the window
	 */
	public CWTactics(int width, int height) {
		super(width, height);
		//addScreen(new BattleScreen());
		addScreen(new TestBed());
	}
	
}
