package com.jslix.system;

import com.jslix.state.Screen;
import java.applet.Applet;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.event.MouseWheelEvent;
import java.awt.event.MouseWheelListener;
import java.awt.image.BufferedImage;

/**
 * SlixApplet.java
 * 
 * This is used to make a general java applet for the JSlix Screens
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.21.10
 * @todo TODO Finish commenting this class
 */

public class SlixApplet extends Applet implements Runnable, KeyListener,
        MouseListener, MouseMotionListener, MouseWheelListener{

	private static final long serialVersionUID = 2452945053572843636L;
	
    private Thread looper;
    private int id;
    private SlixGame game;
    private boolean showRate;
    private Screen tempScreen;
    private int scrStart;
    /**
     *The image used for Graphics (BackgroundImage)
     */
    private BufferedImage bimg;

    public SlixApplet(){        
        game = new SlixGame();
        game.startTimer(false);
        looper = new Thread(this);
        looper.start();
    }

    public final void changeGame(SlixGame newGame){
        if(newGame != null){
            game = newGame;
            game.startTimer(false);
        }
    }

    public void toggleFPS(){
        showRate = !showRate;
    }

    @Override
    public void init(){
        KeyPress.setConv(false);        
        showRate = false;
        addKeyListener(this);
        addMouseListener(this);
        addMouseMotionListener(this);
        addMouseWheelListener(this);
        setBackground(Color.BLACK);
        SlixLibrary.updateScreens();
    }

    @Override
    public void start() {
        looper = new Thread(this);
        looper.start();
    }

    @Override
    public void stop() {
        looper = null;
    }

    @Override
    public void update(Graphics g){        
        paint(g);
    }

    @Override
    public void paint(Graphics g){
        createGraphics(g, getSize().width, getSize().height);
        //Draws a non-flickering image
        g.drawImage(bimg, 0, 0, this);
    }

    private void createGraphics(Graphics g, int w, int h){
        if (bimg == null || bimg.getWidth() != w || bimg.getHeight() != h)
            bimg = (BufferedImage) createImage(w, h);

        g = bimg.createGraphics();
        g.setColor(Color.BLACK);
        g.fillRect(0, 0, w, h);

        drawJava(g, w, h);
        showRate(g);
    }

    private void drawJava(Graphics g, int w, int h){
        SlixLibrary.updateScreens();

        //Quits game when there are no more screens
        if(SlixLibrary.size() == 0)
            System.exit(0);

        for(int i = 0; i < SlixLibrary.size(); i++){
            scrStart = i;
            tempScreen = SlixLibrary.scrOrder.get(i);

            if(!tempScreen.scr_link)
                break;
        }

        for(int i = scrStart; i >= 0; i--){
            tempScreen = SlixLibrary.scrOrder.get(i);
            tempScreen.scr_mouseScroll = KeyPress.mouseScroll;
            tempScreen.scr_index = i;
            tempScreen.scr_width = w;
            tempScreen.scr_height = h;
            tempScreen.scr_sysTime = game.getTime();
            tempScreen.update(-100);
            tempScreen.render((Graphics2D)g, this);
            tempScreen.scr_mouseScroll = 0;

            if(!tempScreen.scr_link)
                break;
        }
    }

    //Handles various keyboard actions and stores them to values (expandable)
    private void handleKeyboard(KeyEvent e){
        id = e.getID();
        if (id == KeyEvent.KEY_PRESSED){
            //System.out.println("Key Code:" + keycode);
            //System.out.println("Key Location:" + keylocation);
            KeyPress.addKeyPress(e.getKeyCode(), false);
            if(e.getKeyCode() == 120)
                toggleFPS();
        }
        if (id == KeyEvent.KEY_TYPED){}
        if (id == KeyEvent.KEY_RELEASED){
            //System.out.println("RKey Code:" + e.getKeyCode());
            //System.out.println("RKey Location:" + e.getKeyLocation());
            KeyPress.removeKeyPress(e.getKeyCode());
        }

    }

    //Handles various mouse actions and stores them to actions (expandable)
    private void handleMouse(MouseEvent e, int wheelScroll){
        id = e.getID();
        if (id == MouseEvent.MOUSE_CLICKED){}
        if (id == MouseEvent.MOUSE_PRESSED){
            //System.out.println("Mouse Button:" + mousebutton);
            //System.out.println("X Mouse:" + (mouseX*scalex));
            //System.out.println("Y Mouse:" + (mouseY*scaley));
            //System.out.println("Mouse Clicked:" + mouseclick);
            KeyPress.addMouseClick(e.getButton(), false);
        }
        KeyPress.mouseScroll = wheelScroll;
        if (id == MouseEvent.MOUSE_RELEASED){
            KeyPress.removeMouseClick(e.getButton());
        }
        if (id == MouseEvent.MOUSE_MOVED){
            KeyPress.mouseX = e.getX();
            KeyPress.mouseY = e.getY();
        }
        if (id == MouseEvent.MOUSE_DRAGGED){
            KeyPress.mouseX = e.getX();
            KeyPress.mouseY = e.getY();
        }
        if (id == MouseEvent.MOUSE_ENTERED){}
        if (id == MouseEvent.MOUSE_EXITED){}
        if (id == MouseEvent.MOUSE_WHEEL){}
    }
    
    public void setFrameRate(){
        game.setFrameRate();
    }
    
    private void showRate(Graphics g){
        if(showRate){
            g.setColor(Color.WHITE);
            g.drawString("FPS: "+game.getFPS(), 0, getSize().height);
        }
    }

    public void run() {
        Thread me = Thread.currentThread();
        while (looper == me) {
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                System.out.println(e.getStackTrace());
            }
            setFrameRate();
            repaint();
        }
    }

    public void keyTyped(KeyEvent e) {
        handleKeyboard(e);
    }
    public void keyPressed(KeyEvent e) {
        handleKeyboard(e);
    }
    public void keyReleased(KeyEvent e) {
        handleKeyboard(e);
    }
    public void mouseClicked(MouseEvent e) {
        handleMouse(e, 0);
    }
    public void mousePressed(MouseEvent e) {
        handleMouse(e, 0);
    }
    public void mouseReleased(MouseEvent e) {
        handleMouse(e, 0);
    }
    public void mouseEntered(MouseEvent e) {
        handleMouse(e, 0);
    }
    public void mouseExited(MouseEvent e) {
        handleMouse(e, 0);
    }
    public void mouseDragged(MouseEvent e) {
        handleMouse(e, 0);
    }
    public void mouseMoved(MouseEvent e) {
        handleMouse(e, 0);
    }
    public void mouseWheelMoved(MouseWheelEvent e) {
        handleMouse(e, e.getWheelRotation());
    }
}
