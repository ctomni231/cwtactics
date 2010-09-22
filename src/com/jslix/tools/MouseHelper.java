package com.jslix.tools;

/**
 * MouseHelper.java
 *
 * This class helps you control the mouse and the scrolling of objects
 *
 * @author Crecen
 */
public class MouseHelper {

    //Mouse helper functions
    //Mouse does not register commands if within the x vicinity of this
    private int lockx = -1000;
    //Mouse does not register commands if within the y vicinity of this
    private int locky = -1000;
    //Controls whether mouse movements are registered within screens
    private boolean mouseLock = false;
    //Controls how often a mouse is able to effect menu actions
    private boolean scroll = false;
    //This sets the control of scrolling to system time
    private boolean scrollWatch = false;
    //How quick a user is able to scroll, the higher the number the quicker
    private int scrollInd = 2;

    public MouseHelper(){
        lockx = -1000;
        locky = -1000;
        mouseLock = false;
        scroll = false;
        scrollWatch = false;
        scrollInd = 2;
    }

    //Prevents mouse actions from being accepted
    public void setMouseLock(int mouseX, int mouseY){
        lockx = mouseX;
        locky = mouseY;
        mouseLock = true;
    }

    //Allows mouse actions to be accepted
    public void setMouseRelease(int mouseX, int mouseY){
        if(mouseX > lockx+5 || mouseX < lockx-5 ||
            mouseY > locky+5 || mouseY < locky-5)
            mouseLock = false;
    }

    //Sets how often you want the mouse to scroll each second. 1 is once
    //every second, 2 is twice every second, and so on...
    public void setScrollIndex(int scrollIndex){
        if(scrollIndex > 0)
            scrollInd = scrollIndex;
    }

    //This function tells you when it is okay to scroll
    public boolean getScroll(){
        if(scroll){
            scroll = !scroll;
            return !scroll;
        }
        return scroll;
    }

    //This function returns whether the mouse is locked
    public boolean getMouseLock(){
        return mouseLock;
    }

    //Gets the current scrollIndex
    public int getScrollIndex(){
        return scrollInd;
    }

    //Helps handle controlled scrolling within the screen
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
