package com.jslix.system;

import com.jslix.state.Screen;
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
import javax.swing.JComponent;
import javax.swing.JFrame;
import org.newdawn.slick.SlickException;

/**
 * This class contains the basics for the screen system
 * @author Crecen
 */
public class Slix extends JComponent implements Runnable, KeyListener,
        MouseListener, MouseMotionListener, MouseWheelListener {

    public static void main(String[] argv) {       
        Slix game = new Slix(480, 320);
        if(argv.length > 0){
            if(argv[0].matches("java"))         game.showWindow();
            else if(argv[0].matches("slick"))   game.showSlick();
        }else
            game.showWindow();
    }

    /**
     * The window that holds the frame of the game
     */
    private JFrame window;
    /**
     * This holds the Slick version of the game
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
     * Holds the keyboard and mouse id actions
     */
    private int id;
    //Holds a temporary Screen
    private Screen tempScreen;
    //Holds a variable so only the top screen displays
    private int scrStart;

    public Slix(int width, int height){
        initialize(width, height);
    }

    public void changeTitle(String newTitle){
        mainTitle = newTitle;
        window.setTitle(mainTitle);
    }

    public void showSlick(){
    	if(game == null)
    		game = new SlixGame();
        try {
            contain = new SlixContainer(game);
            contain.setBackground(Color.BLACK);

            window.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
            window.addWindowListener(new WindowAdapter() {
               @Override
                public void windowClosing(WindowEvent e) {
                    contain.dispose();
                    window.dispose();
                    System.exit(0);
                }
            });
            contain.addComponentListener(new ComponentAdapter() {
                @Override
                public void componentHidden(ComponentEvent e) {
                    contain.dispose();
                    window.dispose();
                    System.exit(0);
                }
            });

            window.setSize(sizex, sizey);
            window.getContentPane().add(contain);
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
    
    public void showWindow(){
    	if(game == null)
    		game = new SlixGame();
        window.addKeyListener(this);
        addMouseListener(this);
        addMouseMotionListener(this);
        addMouseWheelListener(this);
        game.startTimer(false);
        Thread looper = new Thread(this);
        looper.start();
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.add(this);
        window.validate();
        window.setVisible(true);
        window.pack();
        KeyPress.setConv(false);
    }
    
    public void setResizeableWindow(boolean resize){
        window.setResizable(resize);
    }

    public final void changeGame(SlixGame newGame){
        if(newGame != null)
            game = newGame;
    }

    public JFrame getWindow(){
        return window;
    }

    public void setFrameTime(int updateTime){
        game.setFrameTime(updateTime);
    }

    public void toggleFPS(){
        showRate = !showRate;
    }

    /**
     * The starting size of the window is deciphered here
     * @return The preferred size
     */
    @Override
    public Dimension getPreferredSize(){
        return new Dimension(sizex, sizey);
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

    @Override
    public void repaint() {
        super.repaint();
    }

    /**
     * This function handles drawing screens to the frame
     * @param g Graphics object binded to this function
     */
    @Override
    public void paintComponent(Graphics g){
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
        showRate(g2);
    }

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
            tempScreen.update(-100);
            tempScreen.render(g2, this);
            tempScreen.scr_mouseScroll = 0;
        }
    }

    private void showRate(Graphics g2){
        if(showRate){
            g2.setColor(Color.WHITE);
            g2.drawString("FPS: "+game.getFPS(), 0, getSize().height);
        }
    }

    private void setFrameRate(){
        game.setFrameRate();
    }

    private int getFrameTime(){
        return game.getFrameTime();
    }
    
    private void initialize(int width, int height){
    	mainTitle = "JSlix Window";
        sizex = width;
        sizey = height;
        showRate = true;
        window = new JFrame(mainTitle);
        window.setBackground(Color.BLACK);
        setBackground(Color.BLACK);
        SlixLibrary.setFrame();
    }

    public final void run() {
        try{
            while(true){
                Thread.sleep(getFrameTime());
                setFrameRate();
                repaint();
            }
        }catch(Exception e){
            System.out.println(e.getStackTrace());
            System.exit(0);
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
