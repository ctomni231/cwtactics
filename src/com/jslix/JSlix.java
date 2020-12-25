package com.jslix;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
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

public class JSlix extends JComponent implements Runnable, KeyListener,
MouseListener, MouseMotionListener, MouseWheelListener {
	
	private static final long serialVersionUID = 2452945053572843636L;
	
	/**
     * This class allows you to create Java2D or Slick2D frames from
     * a list of screens contained in a SlixGame extended class. The
     * Slick2D frame requires natives in order to run.
     * @param argv "java" = java2D, "slick" = Slick2D (req natives)
     */
    public static void main(String[] argv) {      
    	JSlix game = new JSlix(480, 320);
    	game.showWindow();
    	
    }
	
	//Width of the window for fullscreen
    public final int FULL_WIDTH = 800;
    //Height of the window for fullscreen
    public final int FULL_HEIGHT = 600;
    //F9 to toggle the frameRate visibility
    private final int FPS_KEY = 120;
    //Can use this globally to time objects by system time
    public static Timer timer;
    /**
     * The window that holds the frame of the game
     */
    private JFrame window;
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
     * Holds the background color
     */
    private Color bgcolor;
    
    private Screen tempScreen;//Holds a temporary Screen
    private int scrStart;//Holds a variable so only the top screen displays
    
    /**
     * This class creates a Java2D or Slick2D screen with a starting
     * width and height
     * @param width The x-axis length of the screen
     * @param height The y-axis length of the screen
     */
    public JSlix(int width, int height){
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
     * This function initializes and displays a java2D frame
     */
    public void showWindow(){
        addKeyListener(this);
        addMouseListener(this);
        addMouseMotionListener(this);
        addMouseWheelListener(this);
        startTimer(false);
        Thread looper = new Thread(this);
        looper.start();
        window.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
        window.addWindowListener(new WindowAdapter() {
           @Override
            public void windowClosing(WindowEvent e) {
                cleanExit();
            }
        });
        window.add(this, BorderLayout.CENTER);
        window.validate();
        window.setVisible(true);
        window.pack();
    }
    
    /**
     * This function is used to exit cleanly from JSlix
     */
    public void cleanExit() {
    	ScreenLibrary.removeAllScreens();
        ScreenLibrary.updateScreens();
        window.dispose();
        System.exit(0);
    }
    
    /**
     * This function sets whether the user is allowed to resize the window
     * @param resize Whether the user can resize the window(T) or not(F)
     */
    public void setResizeableWindow(boolean resize){
        window.setResizable(resize);
    }
    
    /**
     * This gets the outside frame of the JSlix window
     * @return The frame outside the JSlix window
     */
    public JFrame getWindow(){
        return window;
    }
    
    /**
     * This function sets the visibility of the FPS for the Java2D screen
     */
    public void toggleFPS(){
        showRate = !showRate;
    }
    
    /**
     * Changes the background color
     * @param theColor The color to change the background to
     */
    public void changeBackground(Color theColor) {
    	bgcolor = theColor;
    }
    
    /**
     *The function re-scales the background image when screen is
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
        g2.setColor(bgcolor);
        g2.fillRect(0, 0, w, h);
        
        drawJava(g2, w, h);
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
        ScreenLibrary.updateScreens();

        //Displays nothing when there are no more screens
        if(ScreenLibrary.size() == 0) {
        	// If someone exits, you must handle it in the screens using cleanExit()
        	return;
        }

        for(int i = 0; i < ScreenLibrary.size(); i++){
            scrStart = i;
            tempScreen = ScreenLibrary.scrOrder.get(i);

            if(!tempScreen.scr_link)
                break;
        }

        for(int i = scrStart; i >= 0; i--){
            tempScreen = ScreenLibrary.scrOrder.get(i);
            tempScreen.scr_mouseScroll = KeyPress.mouseScroll;
            tempScreen.scr_index = i;
            tempScreen.scr_width = w;
            tempScreen.scr_height = h;
            tempScreen.scr_sysTime = getTime();
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
            g2.drawString("FPS: "+getFPS(), 0, getSize().height);   
        }
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
        System.out.println("SizeX: "+sizex);
        System.out.println("SizeY: "+sizey);
        bgcolor = Color.BLACK;
        showRate = false;
        window = new JFrame(mainTitle);
        window.setBackground(bgcolor);
        setBackground(bgcolor);
        timer = new Timer(true);
        ScreenLibrary.setFrame();
    }
    
    /**
     * This function adds a screen to the ScreenLibrary
     * @param theScreen The screen to add to the ScreenLibrary
     */
    public void addScreen(Screen theScreen) {
    	ScreenLibrary.addFrameScreen(theScreen);
    }
    
    // --------------------------------------------------
    // Timer Functions
    // --------------------------------------------------
    
    /**
     * This starts the global timer to regulate animation
     * @param selfStart Whether to start the timers internal timekeeper
     */
    public void startTimer(boolean selfStart){
        timer = new Timer(selfStart);
    }

    /**
     * This sets how often the timer resets
     * @param updateTime How often the animation time updates
     */
    public void setFrameTime(int updateTime){
        timer.setFrameTime(updateTime);
    }

    /**
     * Gives you the update time for the Timer
     * @return the update time for the timer
     */
    public int getFrameTime(){
        return timer.getFrameTime();
    }

    /**
     * The amount of millisecs that elapsed per frame (1/1000)
     * @return millisecs of time
     */
    public int getTime(){
        return timer.getTime();
    }

    /**
     * Gets Java FPS time
     * @return Java FPS
     */
    public int getFPS(){
        return timer.getFPS();
    }

    /**
     * This is used to regulate the timer if internal timer isn't running
     */
    protected void setFrameRate(){
        timer.setFrameRate();
    }
    
    // --------------------------------------------------
    // Override Functions
    // --------------------------------------------------
    
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
                //System.out.println("Key Code:" + e.getKeyCode());
                //System.out.println("Key Location:" + e.getKeyLocation());
                KeyPress.addKeyPress(e.getKeyCode());
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
                KeyPress.addMouseClick(e.getButton());
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
     * This is the runnable for JSlix
     */
    //@Override
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

    //@Override
    public void keyTyped(KeyEvent e) {
        handleKeyboard(e);
    }
    //@Override
    public void keyPressed(KeyEvent e) {
        handleKeyboard(e);
    }
    //@Override
    public void keyReleased(KeyEvent e) {
        handleKeyboard(e);
    }
    //@Override
    public void mouseClicked(MouseEvent e) {
        handleMouse(e, 0);
    }
    //@Override
    public void mousePressed(MouseEvent e) {
        handleMouse(e, 0);
    }
    //@Override
    public void mouseReleased(MouseEvent e) {
        handleMouse(e, 0);
    }
    //@Override
    public void mouseEntered(MouseEvent e) {
        handleMouse(e, 0);
    }
    //@Override
    public void mouseExited(MouseEvent e) {
        handleMouse(e, 0);
    }
    //@Override
    public void mouseDragged(MouseEvent e) {
        handleMouse(e, 0);
    }
    //@Override
    public void mouseMoved(MouseEvent e) {
        handleMouse(e, 0);
    }
    //@Override
    public void mouseWheelMoved(MouseWheelEvent e) {
        handleMouse(e, e.getWheelRotation());
    }

}
