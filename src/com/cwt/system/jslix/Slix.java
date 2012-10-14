package com.cwt.system.jslix;

import com.cwt.system.jslix.state.Screen;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.event.MouseWheelEvent;
import java.awt.event.MouseWheelListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.image.BufferedImage;
import java.awt.BorderLayout;
import javax.swing.JComponent;
import javax.swing.JFrame;

import org.newdawn.slick.AppGameContainer;
import org.newdawn.slick.SlickException;

/**
 * Slix.java
 *
 * This class contains the basics for the screen system
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.20.11
 */

public class Slix extends JComponent implements Runnable, KeyListener,
        MouseListener, MouseMotionListener, MouseWheelListener {

    private static final long serialVersionUID = 2452945053572843636L;

    /**
     * This class allows you to create Java2D or Slick2D frames from
     * a list of screens contained in a SlixGame extended class. The
     * Slick2D frame requires natives in order to run.
     * @param argv "java" = java2D, "slick" = Slick2D (req natives)
     */
    public static void main(String[] argv) {       
        Slix game = new Slix(480, 320);
        if(argv.length > 0){
            if(argv[0].matches("java"))         game.showWindow();
            else if(argv[0].matches("slick"))   game.showSlick();
        }else
            game.showWindow();
    }

    //Width of the window for fullscreen
    public final int FULL_WIDTH = 800;
    //Height of the window for fullscreen
    public final int FULL_HEIGHT = 600;
    //F8 to toggle the log messages visibility
    private final int LOG_KEY = 119;
    //F9 to toggle the frameRate visibility
    private final int FPS_KEY = 120;
    /**
     * The window that holds the frame of the game
     */
    private JFrame window;
    /**
     * This holds the Slick version of the game (no resize)
     */
    private AppGameContainer app;
    /**
     * This holds the Slick version of the game (resize)
     */
    private SlixContainer contain;
    /**
     * This holds the game of the CanvasGameContainer
     */
    private SlixGame game;
    /**
     *The title of the window
     */
    private String mainTitle;
    /**
     *The width of the window
     */
    private int sizex;
    /**
     *The height of the window
     */
    private int sizey;
    /**
     *The image used for Graphics (BackgroundImage)
     */
    private BufferedImage bimg;
    /**
     *Controls whether the frame rate is shown
     */
    private boolean showRate;
    /**
     * Controls whether the log messages are shown to the screen
     */
    private boolean showLog;
    /**
     * Holds the keyboard and mouse id actions
     */
    private int id;
    /**
     * Holds whether to update each frame for slick (default:false)
     */
    private boolean frameUpdate;
    
    private Screen tempScreen;//Holds a temporary Screen
    private int scrStart;//Holds a variable so only the top screen displays

    /**
     * This class creates a Java2D or Slick2D screen with a starting
     * width and height
     * @param width The x-axis length of the screen
     * @param height The y-axis length of the screen
     */
    public Slix(int width, int height){
        initialize(width, height);
    }

    /**
     * This function changes the title at the top of the JSlix window
     * @param newTitle The new title name
     */
    public void changeTitle(String newTitle){
        mainTitle = newTitle;
        window.setTitle(mainTitle);
    }

    /**
     * This function changes the update render of a Slick2D window
     * @param clear Whether to update each time(true) or not(false)
     */
    public void changeFrameClear(boolean clear){
        frameUpdate = clear;
    }

    /**
     * This function initializes and displays a Slick2D frame
     */
    public void showSlick(){
    	if(game == null)
            game = new SlixGame();

        try {
            game.setUpdateFrame(frameUpdate);
            contain = new SlixContainer(game);
            contain.setBackground(Color.BLACK);

            window.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
            window.addWindowListener(new WindowAdapter() {
               @Override
                public void windowClosing(WindowEvent e) {
                    SlixLibrary.removeAllScreens();
                    SlixLibrary.updateScreens();
                    contain.dispose();
                    window.dispose();
                    System.exit(0);
                }
            });
            contain.addComponentListener(new ComponentAdapter() {

                @Override
                public void componentHidden(ComponentEvent e) {
                    SlixLibrary.removeAllScreens();
                    SlixLibrary.updateScreens();
                    contain.dispose();
                    window.dispose();
                    System.exit(0);
                }
            });

            window.setSize(sizex, sizey);
            window.add(contain, BorderLayout.CENTER);
            window.validate();
            window.setVisible(true);
            window.pack();
            contain.start();
            game.startTimer(true);
            KeyPress.setConv(true);
        } catch (SlickException ex) {
            System.err.println(ex);
            showWindow();
        }
    }

    /**
     * This function initializes and displays a java2D frame
     */
    public void showWindow(){
    	if(game == null)
            game = new SlixGame();
        addKeyListener(this);
        addMouseListener(this);
        addMouseMotionListener(this);
        addMouseWheelListener(this);
        game.startTimer(false);
        Thread looper = new Thread(this);
        looper.start();
        window.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
        window.addWindowListener(new WindowAdapter() {
           @Override
            public void windowClosing(WindowEvent e) {
                SlixLibrary.removeAllScreens();
                SlixLibrary.updateScreens();
                window.dispose();
                System.exit(0);
            }
        });
        window.add(this, BorderLayout.CENTER);
        window.validate();
        window.setVisible(true);
        window.pack();
        KeyPress.setConv(false);
    }

    /**
     * This function initializes and displays a Slick2D full screen
     */
    public void showFull(){
    	if(game == null)
            game = new SlixGame();
    	try{ 
            app = new AppGameContainer(game);
            app.setDisplayMode( FULL_WIDTH, FULL_HEIGHT, true );
            app.start();
        } catch ( SlickException e ) { 
            System.err.println(e);
        } 
    }

    /**
     * This function sets whether the user is allowed to resize the window
     * @param resize Whether the user can resize the window(T) or not(F)
     */
    public void setResizeableWindow(boolean resize){
        window.setResizable(resize);
    }

    /**
     * This function changes the Slick window associated with the screens
     * @param newGame The new Slick BasicGame window
     */
    public final void changeGame(SlixGame newGame){
        if(newGame != null)
            game = newGame;
    }

    /**
     * This gets the outside frame of the JSlix window
     * @return The frame outside the JSlix window
     */
    public JFrame getWindow(){
        return window;
    }

    /**
     * This sets the update rate of the frames, and deals directly with
     * system time
     * @param updateTime How often to update the system time
     */
    public void setFrameTime(int updateTime){
        game.setFrameTime(updateTime);
    }

    /**
     * This function sets the redrawing of the Slick Screen
     * @param clear Whether the screen should redraw every frame(T) or not(F)
     */
    public void setUpdateClear(boolean clear){
        game.setUpdateFrame(clear);
    }

    /**
     * This function sets the visibility of the FPS for the Java2D screen
     */
    public void toggleFPS(){
        showRate = !showRate;
    }

    /**
     * This function sets the visibility of the log messages for Java2D
     */
    public void toggleLog(){
        showLog = !showLog;
        if(showLog) NotifyLibrary.addMessage();
    }

    /**
     * The starting size of the window is deciphered here
     * @return The preferred size
     */
    @Override
    public Dimension getPreferredSize(){
        return new Dimension(sizex, sizey);
    }

    /**
     * This function handles various keyboard actions and stores them to
     * values for Java2D (expandable)
     * @param e The key event to handle
     */
    private void handleKeyboard(KeyEvent e){
        id = e.getID();
        switch(id){
            case KeyEvent.KEY_PRESSED:
                //System.out.println("Key Code:" + keycode);
                //System.out.println("Key Location:" + keylocation);
                KeyPress.addKeyPress(e.getKeyCode(), false);
                if(e.getKeyCode() == LOG_KEY)
                    toggleLog();
                if(e.getKeyCode() == FPS_KEY)
                    toggleFPS();
                break;
            case KeyEvent.KEY_RELEASED:
                //System.out.println("RKey Code:" + e.getKeyCode());
                //System.out.println("RKey Location:" + e.getKeyLocation());
                KeyPress.removeKeyPress(e.getKeyCode());
                break;
        }
    }

    /**
     * This function handles various mouse actions and stores them to
     * actions for Java2D(expandable)
     * @param e The mouse action to handle
     * @param wheelScroll The mouse scroll wheel value
     */
    private void handleMouse(MouseEvent e, int wheelScroll){
        requestFocus();
        id = e.getID();
        KeyPress.mouseScroll = wheelScroll;
        switch(id){
            case MouseEvent.MOUSE_PRESSED:
                //System.out.println("Mouse Button:" + mousebutton);
                //System.out.println("X Mouse:" + (mouseX*scalex));
                //System.out.println("Y Mouse:" + (mouseY*scaley));
                //System.out.println("Mouse Clicked:" + mouseclick);
                KeyPress.addMouseClick(e.getButton(), false);
                break;
            case MouseEvent.MOUSE_RELEASED:
                KeyPress.removeMouseClick(e.getButton());
                break;
            case MouseEvent.MOUSE_MOVED:
            case MouseEvent.MOUSE_DRAGGED:
                KeyPress.mouseX = e.getX();
                KeyPress.mouseY = e.getY();
                break;
        }
    }

    /**
     * This function handles drawing screens to the frame
     * @param g Graphics object binded to this function
     */
    @Override
    public void paintComponent(Graphics g){
        super.paintComponent(g);
        createGraphics2D((Graphics2D)g, getSize().width, getSize().height);
        //Draws a non-flickering image
        g.drawImage(bimg, 0, 0, this);
    }

    /**
     *The function rescales the background image when screen is
     *resized and also creates the background image
     *
     *@param g2 The graphics object associated
     *@param w  The width of the background image
     *@param h  The height of the background image
     */
    private void createGraphics2D(Graphics2D g2, int w, int h) {
        if (bimg == null || bimg.getWidth() != w || bimg.getHeight() != h)
            bimg = (BufferedImage) createImage(w, h);

        g2 = bimg.createGraphics();
        g2.setColor(Color.BLACK);
        g2.fillRect(0, 0, w, h);

        drawJava(g2, w, h);
        showLog(g2, w, h);
        showRate(g2);
    }

    /**
     * This function draws all the screens to the Java2D window. Due to
     * Java2D frames not handling the updates in a normal way, it also handles
     * the update functions.
     * @param g2 The java2D Graphics engine
     * @param w The current width of the window
     * @param h The current height of the window
     */
    private void drawJava(Graphics2D g2, int w, int h){
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
            if(i == 0)
                tempScreen.update(-100);
            tempScreen.render(g2, this);
            tempScreen.scr_mouseScroll = 0;
        }
    }

    /**
     * This function shows the frame rate and log message graphics
     * @param g2 The Java2D graphics object
     */
    private void showRate(Graphics g2){
        if(showRate){
            g2.setColor(Color.WHITE);
            g2.drawString("FPS: "+game.getFPS(), 0, getSize().height);   
        }
    }

    /**
     * This function shows log messages in the JSlix window
     * @param g2 The Java2D graphics object
     * @param w The current width of the window
     * @param h The current height of the window
     */
    private void showLog(Graphics g2, int w, int h){
        if(showLog){
            NotifyLibrary.update(w, h, game.getTime());
            NotifyLibrary.render((Graphics2D)g2, this);
        }
    }

    /**
     * This function sets the frame rate for the Slick and Java2D game
     */
    private void setFrameRate(){
        game.setFrameRate();
    }

    /**
     * This function gets the integer value of the frame update time for the
     * Java2D and Slick2D game
     * @return The system time update rate
     */
    private int getFrameTime(){
        return game.getFrameTime();
    }

    /**
     * This function initializes the Slick and Java2D general functions,
     * but does not uses any resources for setting up the windows
     * @param width The x-axis length of the screen
     * @param height The y-axis length of the screen
     */
    private void initialize(int width, int height){
    	mainTitle = "JSlix Window";
        sizex = width;
        sizey = height;
        showRate = false;
        window = new JFrame(mainTitle);
        window.setBackground(Color.BLACK);
        setBackground(Color.BLACK);
        frameUpdate = true;
        SlixLibrary.setFrame();
    }

    /**
     * This is the runnable for JSlix
     */
    @Override
    public final void run() {
        try{           
            while(true){
                Thread.sleep(getFrameTime());
                setFrameRate();
                repaint();
            }
        }catch(Exception e){
            System.err.println(e.getMessage());
            System.exit(0);
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
        handleKeyboard(e);
    }
    @Override
    public void keyPressed(KeyEvent e) {
        handleKeyboard(e);
    }
    @Override
    public void keyReleased(KeyEvent e) {
        handleKeyboard(e);
    }
    @Override
    public void mouseClicked(MouseEvent e) {
        handleMouse(e, 0);
    }
    @Override
    public void mousePressed(MouseEvent e) {
        handleMouse(e, 0);
    }
    @Override
    public void mouseReleased(MouseEvent e) {
        handleMouse(e, 0);
    }
    @Override
    public void mouseEntered(MouseEvent e) {
        handleMouse(e, 0);
    }
    @Override
    public void mouseExited(MouseEvent e) {
        handleMouse(e, 0);
    }
    @Override
    public void mouseDragged(MouseEvent e) {
        handleMouse(e, 0);
    }
    @Override
    public void mouseMoved(MouseEvent e) {
        handleMouse(e, 0);
    }
    @Override
    public void mouseWheelMoved(MouseWheelEvent e) {
        handleMouse(e, e.getWheelRotation());
    }
}
