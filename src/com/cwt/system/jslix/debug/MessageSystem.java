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
 * @version 12.17.11
 */
public class MessageSystem implements ScreenSkeleton{

    private final int DELAY = 1;//The length of one iteration (1000/DELAY ms)
    private final int TEXTSPD = 0;//The speed which the log text moves
    private final Color BOXCLR = new Color(0, 0, 0, 64);//Default background

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
    private int max;//Controls the maximum amount of displayable items
    private double opacity;//Controls the opacity of the backgorund box

    /**
     * This class is used to display temporary log messages on the screen
     */
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
        max = 0;
        opacity = 0.7;
    }

    /**
     * This function adds a message to the list of Log messages
     * @param type The severity of the message (controls the color)
     * @param message The text to send to the writer
     * @param delay How long the message remains visible (1000/DELAY ms)
     */
    public void addMessage(Level type, String message, int delay){
        addMessage(type.intValue(), message, delay);
    }

    /**
     * This function adds a message to the list of Log messages
     * @param level The severity of the message (controls the color)
     * @param message The text to send to the writer
     * @param delay How long the message remains visible (1000/DELAY ms)
     */
    public void addMessage(int level, String message, int delay){
        addMessage((level >= 0 && level <= 1000) ?
            imgSort.getColor(Color.getHSBColor((float)((double)level/1000), 
            (float).25, (float).25), (int)(opacity*255)) : null,
            (level >= 0 && level <= 1000) ? 
            Color.getHSBColor((float)((double)level/1000), 1, 1) : null,
            message, delay);
    }

    /**
     * This function adds a message to the list of log messages
     * @param boxColor The color of the background box
     * @param textColor The color of the text
     * @param message The text to send to the writer
     * @param delay How long the message remains visible (1000/DELAY ms)
     */
    public void addMessage(Color boxColor, Color textColor, String message,
        int delay){
        noteObj.setVar(boxColor != null ? boxColor : BOXCLR, message, delay);
        noteObj.setPos(justifyRight ? scrsx-offsetx : offsetx,
                flowUp ? scrsy-offsety : offsety, TEXTSPD);
        noteSys.add(noteObj.acquireObject());
        imgSort.setPixelChange(Color.white, textColor);
        imgSort.addImage(message, imgSort.getTextPicture(message+" "));
    }

    /**
     * This function is used for getting the last message inputted
     * @return The last message inputted into the system
     */
    public String getLastMessage(){
        return note.note;
    }

    /**
     * This sets the justification and positioning of the log messages
     * @param right Whether to display on the right(T) or left(F)
     */
    public void setJustify(boolean right){
        justifyRight = right;
    }

    /**
     * This sets the flow direction of the log messages
     * @param upward Whether to flow upward(T) or downward(F)
     */
    public void setFlow(boolean upward){
        flowUp = upward;
    }

    /**
     * This sets how far the messages will be away from the edge of the screen
     * @param x The x-axis distance away from edge
     * @param y The y-axis distance away from edge
     */
    public void setOffset(int x, int y){
        offsetx = (x > 0) ? x : 0;
        offsety = (y > 0) ? y : 0;
    }

    /**
     * This function sets the maximum amount of messages (0 = unlimited)
     * @param newMax The maximum amount of messages to be displayed
     */
    public void setMax(int newMax){
        max = newMax;
    }

    /**
     * This function sets the opacity of the background box color
     * @param newOpacity The new opacity of the background box
     */
    public void setOpacity(double newOpacity){
        opacity = (newOpacity >= 0 && newOpacity <= 1) ? newOpacity : opacity;
    }

    /**
     * This function updates all the elements
     * @param width The current width of the screen
     * @param height The current height of the screen
     * @param sysTime The current time in milliseconds
     * @param mouseScroll The current scroll wheel mouse position
     */
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll){
        if(noteSys.size() > 0){
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
    }

    /**
     * This function renders the Slick2D screen
     * @param g The Slick2D graphics object
     */
    @Override
    public void render(Graphics g) {
        if(noteSys.size() > 0){
            for(int i = 0; i < noteSys.size(); i++){
                if(max > 0 && i >= max)
                    break;
                note = noteSys.get(i);
                note.fposx = justifyRight ?
                    scrsx-offsetx-imgSort.getX(note.note) : offsetx;
                note.fposy = flowUp ? -(i+1)*imgSort.getY(0)+scrsy-offsety :
                    i*imgSort.getY(0)+offsety;
                g.setColor(imgSort.getColor(imgSort.getColor(note.boxClr), 
                        note.boxClr.getAlpha()));
                g.fillRect((int)note.posx, (int)note.posy,
                   imgSort.getX(note.note), imgSort.getY(note.note));
                g.drawImage(imgSort.getSlickImage(note.note),
                        (int)note.posx, (int)note.posy);
                
            }
        }
    }

    /**
     * This function renders the Java2D screen
     * @param g The Java2D graphics object
     * @param dthis The Java2D Component
     */
    @Override
    public void render(Graphics2D g, Component dthis) {
        if(noteSys.size() > 0){
            for(int i = 0; i < noteSys.size(); i++){
                if(max > 0 && i >= max)
                    break;
                note = noteSys.get(i);
                note.fposx = justifyRight ?
                    scrsx-offsetx-imgSort.getX(note.note) : offsetx;
                note.fposy = flowUp ? -(i+1)*imgSort.getY(0)+scrsy-offsety :
                    i*imgSort.getY(0)+offsety;
                g.setColor(imgSort.getColor(note.boxClr, 
                        note.boxClr.getAlpha()));
                g.fillRect((int)note.posx, (int)note.posy,
                   imgSort.getX(note.note), imgSort.getY(note.note));
                g.drawImage(imgSort.getImage(note.note),
                        (int)note.posx, (int)note.posy, dthis);
                
            }
        }
    }

    @Override
    public void init() {}

    @Override
    public void update(int timePassed) {}

    @Override
    public void update(String name, int index, boolean isApplet,
            boolean seethru) {}
}
