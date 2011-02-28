package com.cwt.system.jslix.debug;

import com.cwt.system.jslix.state.ScreenSkeleton;
import com.cwt.system.jslix.tools.MouseHelper;
import com.cwt.system.jslix.tools.PixtureMap;
import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;
import java.util.ArrayList;
import java.util.logging.Level;
import org.newdawn.slick.Graphics;

/**
 * MessageSystem.java
 *
 * This class uses images and scaling text to represent the notifications.
 * It organizes the notifications in an array like display system and also
 * prepares them to be used in a menu like function by using PixAnimate to
 * handle sizing.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.27.11
 */
public class MessageSystem implements ScreenSkeleton{

    private final int DELAY = 1;//The length of one iteration (1000/DELAY ms)
    private final int TEXTSPD = 0;//The speed which the log text moves
    private final Color BOXCLR = new Color(0, 0, 0, 0);//Default background
    private final Color TXTCLR = new Color(255, 255, 255);//Default text color

    private PixtureMap imgSort;//The image organizer for notifications
    private ArrayList<Notification> noteSys;//The list of Notifications
    private Notification note;//The temporary holder for Notifications
    private NotificationPool noteObj;//The Object Pool for Notifications
    private MouseHelper helper;//This helps regulate timing control
    private int scrsx;//The current x-axis screen size
    private int scrsy;//The current y-axis screen size
    private int offsetx;//The x-axis pixel distance from screen edge
    private int offsety;//The y-axis pixel distance from screen edge
    private boolean justifyRight;//Justifies the text right(T) or left(F)
    private boolean flowUp;//Forces the flow upwards(T) or downwards(F)
    private boolean countDown;//Holds the update countdown for the objects

    public MessageSystem(){
        imgSort = new PixtureMap();
        noteSys = new ArrayList<Notification>();
        noteObj = new NotificationPool();
        helper = new MouseHelper();
        helper.setScrollIndex(DELAY);
        countDown = false;
        justifyRight = false;
        flowUp = false;
        offsetx = 0;
        offsety = 0;
        scrsx = 0;
        scrsy = 0;
    }

    public void addMessage(Level type, String message, int delay){
        addMessage(null, null, message, delay);
    }

    public void addMessage(Color boxColor, Color textColor, String message,
        int delay){
        noteObj.setVar(
            boxColor != null ? boxColor.getRGB() : BOXCLR.getRGB(),
            textColor != null ? textColor.getRGB() : TXTCLR.getRGB(),
            message, delay);
        noteObj.setPos(justifyRight ? scrsx-offsetx : offsetx,
                flowUp ? scrsy-offsety : offsety, TEXTSPD);
        noteSys.add(noteObj.acquireObject());
        imgSort.addImage(message, imgSort.getTextPicture(message+" "));
    }
            
    public void setJustify(boolean right){
        justifyRight = right;
    }

    public void setFlow(boolean upward){
        flowUp = upward;
    }

    public void setOffset(int x, int y){
        offsetx = (x > 0) ? x : 0;
        offsety = (y > 0) ? y : 0;
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
        if(noteSys.size() > 0){
            for(int i = 0; i < noteSys.size(); i++){
                note = noteSys.get(i);
                note.fposx = justifyRight ?
                    scrsx-offsetx-imgSort.getX(note.note) : offsetx;
                note.fposy = flowUp ? -i*imgSort.getY(0)+scrsy-offsety :
                    (i+1)*imgSort.getY(0)+offsety;
                g.setColor(imgSort.getColor(Color.white));
                g.drawString(note.note, (int)note.posx, (int)note.posy);
            }
        }
    }

    public void render(Graphics2D g, Component dthis) {
        if(noteSys.size() > 0){
            for(int i = 0; i < noteSys.size(); i++){
                note = noteSys.get(i);
                note.fposx = justifyRight ?
                    scrsx-offsetx-imgSort.getX(note.note) : offsetx;
                note.fposy = flowUp ? -i*imgSort.getY(0)+scrsy-offsety :
                    (i+1)*imgSort.getY(0)+offsety;
                g.setColor(Color.white);
                g.drawString(note.note, (int)note.posx, (int)note.posy);
            }
        }
    }

    public void init(){}

    public void update(int timePassed) {}

    public void update(String name, int index, boolean isApplet,
            boolean seethru) {}
}
