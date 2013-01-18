package com.jslix.tools;

/**
 * Timer.java
 *
 * A regulation for the amount of time taken regulated by system time
 * instead of a frame rate. Counts to 1000 milliseconds and restarts.
 * Using this class to regulate scrolling speed for objects and user input.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.25.10
 */

public class Timer extends Thread{
	/** The current time valued (1-1000) in milliseconds */
    private int animTime;
    /** Keeps track of the system time in milliseconds */
    private long millisec;
    /** How often the System sleeps (Updates) */
    private int frametime;
    /** Calculates the number of frames per second for java2D */
    private int control;
    /** This stores the number of frames per second */
    private int FPS;

    /**
     * This class sets a system timer for both Java2D and Slick2D windows
     * @param start Whether to start running the thread
     */
    public Timer(boolean start){
        millisec = System.currentTimeMillis();
        frametime = 10;
        control = 0;
        if(start)  startThread();
    }

    /**
     * This class sets a system timer for both Java2D and Slick2D windows
     * This starts the thread immediately
     * @param updateTime How often the system sleeps
     */
    public Timer(int updateTime){
        millisec = System.currentTimeMillis();
        frametime = updateTime;
        if(frametime < 0)
            frametime = 10;
        control = 0;
        startThread();
    }

    /**
     * This function gets the current milliseconds of the system
     * @return The milliseconds from 0-999
     */
    public int getTime(){
        return animTime;
    }

    /**
     * The runnable for the Timer class
     */
    @Override
    public final void run() {
        try{           
            while(true){
                Thread.sleep(frametime);
                setFrameRate();
            }
        }catch(Exception e){
        	System.err.println(e.getMessage());
            System.exit(0);
        }
    }

    /**
     * This sets how often the system sleeps (updates)
     * @param time the time for the system to update
     */
    public void setFrameTime(int time){
        frametime = (time < 0) ? 10 : time;
    }

    /**
     * This gets how often the system sleeps (updates)
     * @return The time the system sleeps
     */
    public int getFrameTime(){
        return frametime;
    }

    /**
     * This function gets the Frame per Second of Java2D Timer
     * @return The Frames per second
     */
    public int getFPS(){
        return FPS;
    }

    /**
     * This function is used to change the timer values from any
     * runnable. Otherwise, it just updates from the current one
     */
    public void setFrameRate(){
        control++;
        animTime = (int)(System.currentTimeMillis() - millisec);
        if(animTime > 999){
            millisec = System.currentTimeMillis();
            FPS = control;
            control = 0;
        }
    }

    /**
     * This is a filler function for starting a thread
     */
    private void startThread(){
        this.start();
    }
}
