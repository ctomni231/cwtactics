package com.client.tools;

import java.util.Date;

/**
 * Timer
 * A regulation for the amount of time taken regulated by system time
 * instead of a framerate. Counts to 1000 milliseconds and restarts.
 * Using this class to regulate scrolling speed for objects and user input.
 *
 * @author Crecen
 */
public class Timer extends Thread{
    private int animTime;
    private long millisec;
    private int frametime;
    
    public Timer(int updateTime){
        millisec = System.currentTimeMillis();
        frametime = updateTime;
        if(frametime < 0)
            frametime = 10;
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

    private void setFrameRate(){
        animTime = (int)(System.currentTimeMillis() - millisec);
        if(animTime > 999)
            millisec = System.currentTimeMillis();
    }
}
