package com.meowEngine.language.brigdes;

/**
 * Interface description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 07.05.2011
 */
public interface ViewBrigde
{
	public static int TRY_TO_CENTER = 0;
	public static int ON_SCREEN = 1;

	int screenX();
	int screenY();

	int mapX();
	int mapY();

	int screenWidth();
	int screenHeight();

	void setScreenPos( int x , int y , int mode );
	void invokeEffect( int effectCode, Object... args );
}
