package com.cwt.system.jslix.debug;

import com.cwt.system.jslix.state.ScreenSkeleton;
import com.cwt.system.jslix.tools.MouseHelper;
import java.awt.Component;
import java.awt.Graphics2D;
import java.util.ArrayList;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 * NotifySystem.java
 *
 * This class organizes the notifications in an array like display system
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.20.11
 */
public class NotifySystem implements ScreenSkeleton{

    public final byte INFO = 0;//The informational log message
    public final byte FINE = 1;//The fine log message
    public final byte WARN = 2;//The warning log message
    public final byte CRITICAL = 3;//The critical log message

    private final int DELAY = 1;//The length of one iteration (1000/DELAY ms)
    private final int SPACING = 10;//The space between each logged item
    private final int TEXTSPD = 0;//The speed which the log text moves

    private ArrayList<Notification> noteSys;
    private Notification note;
    private NotificationPool noteObj;
    private MouseHelper helper;
    private boolean justifyRight;
    private boolean flowUp;
    private boolean countDown;
    private int scrsx;
    private int scrsy;
    private int offsetx;
    private int offsety;
    private int max;

    public NotifySystem(){
        noteSys = new ArrayList<Notification>();
        noteObj = new NotificationPool();
        helper = new MouseHelper();
        helper.setScrollIndex(DELAY);
        justifyRight = false;
        flowUp = false;
        max = 0;
        offsetx = 0;
        offsety = 0;
        scrsx = 0;
        scrsy = 0;
        countDown = true;
    }

    public void setOffset(int x, int y){
        offsetx = (x > 0) ? x : 0;
        offsety = (y > 0) ? y : 0;
    }

    public void setJustify(boolean right){
        justifyRight = right;
    }

    public void setFlow(boolean upward){
        flowUp = upward;
    }

    public void addMessage(byte type, String message, int delay){
        noteObj.setVar(type, message, delay);
        noteObj.setPos(justifyRight ? scrsx-offsetx : offsetx,
                flowUp ? scrsy-offsety : offsety, TEXTSPD);
        noteSys.add(noteObj.acquireObject());
    }

    public void update(int width, int height, int sysTime, int mouseScroll){
        if(noteSys.isEmpty())
            return;

        helper.setMouseControl(sysTime);
        if(scrsx != width || scrsy != height){
            scrsx = width;
            scrsy = height;
        }

        countDown = helper.getScroll();
        for(int i = 0; i < noteSys.size(); i++){
            note = noteSys.get(i);
            note.updatePosition();
            if(note.time > 0 && countDown)
                note.time--;           
            noteSys.set(i, note);
            if(note.time <= 0){
                noteObj.recycleInstance(noteSys.remove(i));
                i--;
            }
        }
    }

    public void render(Graphics g) {
        if(noteSys.isEmpty())
            return;

        for(int i = 0; i < noteSys.size(); i++){
            note = noteSys.get(i);
            note.fposx = justifyRight ?
                scrsx-offsetx-g.getFont().getWidth(note.note) : offsetx;
            note.fposy = i*SPACING+(flowUp ? scrsy-offsety : offsety);
            g.setColor(Color.white);
            g.drawString(note.note, (int)note.posx, (int)note.posy);
        }
    }

    public void render(Graphics2D g, Component dthis) {
        if(noteSys.isEmpty())
            return;
        
        for(int i = 0; i < noteSys.size(); i++){
            note = noteSys.get(i);
            note.fposx = justifyRight ? scrsx-offsetx-g.getFontMetrics().
                    stringWidth(note.note) : offsetx;
            note.fposy = i*SPACING+SPACING+(flowUp ? scrsy-offsety : offsety);
            note.updatePosition();
            noteSys.set(i, note);
            g.setColor(java.awt.Color.white);
            g.drawString(note.note, (int)note.posx, (int)note.posy);
        }

    }

    public void init(){}

    public void update(int timePassed) {}

    public void update(String name, int index, boolean isApplet,
            boolean seethru) {}


}
