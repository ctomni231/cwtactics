package com.jslix.io;

/**
 * MouseHelper.java
 *
 * This class helps you control the mouse and the scrolling of objects
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.21.10
 */

public class MouseHelper {

    /** Mouse does not register commands if within the x vicinity of this */
    private int lockx = -1000;
    /** Mouse does not register commands if within the y vicinity of this */
    private int locky = -1000;
    /** Controls whether mouse movements are registered within screens */
    private boolean mouseLock = false;
    /** Controls how often a mouse is able to effect menu actions */
    private boolean scroll = false;
    /** This sets the control of scrolling to system time */
    private boolean scrollWatch = false;
    /** How quick a user is able to scroll, the higher the number the quicker */
    private int scrollInd = 2;

    /**
     * This class helps regulate how the mouse and the keyboard integrates
     * with each other with mouse locking. It also regulates the system
     * time and helps with controlling the scrolling values so everything
     * stays in time.
     */
    public MouseHelper(){
        lockx = -1000;
        locky = -1000;
        mouseLock = false;
        scroll = false;
        scrollWatch = false;
        scrollInd = 2;
    }

    /**
     * This function prevents mouse actions from being accepted
     * @param mouseX The x-axis location of the mouse
     * @param mouseY The y-axis location of the mouse
     */
    public void setMouseLock(int mouseX, int mouseY){
        lockx = mouseX;
        locky = mouseY;
        mouseLock = true;
    }

    /**
     * This function allows mouse actions to be accepted
     * @param mouseX The x-axis location of the mouse
     * @param mouseY The y-axis location of the mouse
     */
    public void setMouseRelease(int mouseX, int mouseY){
        if(mouseX > lockx+5 || mouseX < lockx-5 ||
            mouseY > locky+5 || mouseY < locky-5)
            mouseLock = false;
    }

    /**
     * This function sets how often you want the mouse to scroll each second
     * @param scrollIndex How many times per second to scroll
     */
    public void setScrollIndex(int scrollIndex){
        if(scrollIndex > 0)
            scrollInd = scrollIndex;
    }

    /**
     * This function controls when you are allowed to scroll
     * @return Whether you are allowed to scroll
     */
    public boolean getScroll(){
        if(scroll){
            scroll = !scroll;
            return !scroll;
        }
        return scroll;
    }

    /**
     * This function returns whether the mouse is locked
     * @return Whether the mouse is locked
     */
    public boolean getMouseLock(){
        return mouseLock;
    }

    /**
     * This gets how many times per second you are allowed to scroll
     * @return The amount of times per second you are allowed to scroll
     */
    public int getScrollIndex(){
        return scrollInd;
    }

    /**
     * This function fully controls the scrolling within the screen
     * @param sysTime The amount of system time used by Timer class
     */
    public void setMouseControl(int sysTime){
        if(!scroll){
            for(int i = 0; i < scrollInd; i++){
                if(sysTime > (1000/scrollInd)*i &&
                        sysTime < (1000/scrollInd)*(i+1)){
                    if(scrollWatch && sysTime >
                            ((1000/scrollInd)*(i+1))-
                            (1000/(2*scrollInd))){
                        scroll = true;
                        scrollWatch = false;
                    }else if(!scrollWatch && sysTime <=
                            ((1000/scrollInd)*(i+1))-
                            (1000/(2*scrollInd))){
                        scroll = true;
                        scrollWatch = true;
                    }
                }
            }
        }
    }
}
