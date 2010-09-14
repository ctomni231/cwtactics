package com.client.tools;

import com.jslix.state.ScreenSkeleton;

/**
 * GameSkeleton
 *
 * Gives greater control for Screen in controlling the implementing
 * ScreenSkeleton objects.
 *
 * @author Crecen
 */
public interface GameSkeleton extends ScreenSkeleton{

    //Gets the width, height, name, and index of the screen
    public void getScreen(String name, int index, int width, int height);

    //Gets whether this screen is an Applet(true) or not(false),
    //internal millisecond timer, and whether this Screen is see through
    public void getSystem(int time, boolean isApplet, boolean seethru);

    //Gets the mouseScroll value
    public void getMouse(int mouseScroll);

    //Gets whether this Screen is scheduled for deletion
    public void getDelete(boolean delete);

}
