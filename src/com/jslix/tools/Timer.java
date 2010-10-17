package com.jslix.tools;
/**
 * Timer.java
 *
 * A regulation for the amount of time taken regulated by system time
 * instead of a framerate. Counts to 1000 milliseconds and restarts.
 * Using this class to regulate scrolling speed for objects and user input.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.10.10
 * @todo TODO Finish commenting this class
 */

public class Timer extends Thread{
    private int animTime;
    private long millisec;
    private int frametime;
    private int control;
    private int FPS;

    public Timer(boolean start){
        millisec = System.currentTimeMillis();
        frametime = 10;
        control = 0;
        if(start)  this.start();
    }

    public Timer(int updateTime){
        millisec = System.currentTimeMillis();
        frametime = updateTime;
        if(frametime < 0)
            frametime = 10;
        control = 0;
        this.start();
    }

    public int getTime(){
        return animTime;
    }

    @Override
    public final void run() {
        try{
            while(true){
                Thread.sleep(frametime);
                setFrameRate();
            }
        }catch(Exception e){
            System.out.println(e.getStackTrace());
            System.exit(0);
        }
    }

    public void setFrameTime(int time){
        frametime = (time < 0) ? 10 : time;
    }

    public int getFrameTime(){
        return frametime;
    }

    public int getFPS(){
        return FPS;
    }

    public void setFrameRate(){
        control++;
        animTime = (int)(System.currentTimeMillis() - millisec);
        if(animTime > 999){
            millisec = System.currentTimeMillis();
            FPS = control;
            control = 0;
        }
    }
}
