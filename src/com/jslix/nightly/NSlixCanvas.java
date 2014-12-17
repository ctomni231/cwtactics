package com.jslix.nightly;

import java.awt.Canvas;
import org.lwjgl.LWJGLException;
import org.lwjgl.opengl.Display;
import org.lwjgl.opengl.PixelFormat;
import org.newdawn.slick.Game;
import org.newdawn.slick.SlickException;
import org.newdawn.slick.openal.SoundStore;
import org.newdawn.slick.opengl.InternalTextureLoader;
import org.newdawn.slick.util.Log;

/**
 * SlixCanvas.java
 *
 * This class allows you create a new panel to display the GL context. A
 * big chunk of this class was taken from Slick2D implementation and edited.
 *
 * @author <ul><li>Glass, Kevin</li>
 *          <li>Carr, Crecen</li></ul>
 * @license Look into "LICENSE" file for further information
 * @version 02.19.12
 */
public class NSlixCanvas extends Canvas{

    /** The container being displayed on this canvas */
    private NSlixCanvasPanel container;
    /** The thread that is looping for the game */
    protected Thread gameThread;

    /**
     * This function creates a new game container to be run inside the Canvas
     * @param game The game container to be run inside the canvas
     * @param w The starting width of the container
     * @param h The starting height of the container
     */
    public NSlixCanvas(Game game){
        container = new NSlixCanvasPanel(game, getWidth(), getHeight());
    }

    /**
     * This sets up the size of the Canvas and the Game Container within the
     * canvas
     * @param width The x-axis width of the canvas container
     * @param height The y-axis height of the canvas container
     */
    @Override
    public void setSize(int width, int height){
        super.setSize(width, height);
        try {
            container.setDisplayMode(width, height, false);
        } catch (SlickException e) {
            Log.error(e);
        }
    }

    /**
     * This sets up a separate Thread for LWJGL to run in
     */
    @Override
    public final void addNotify() {
        super.addNotify();
        if (gameThread != null)
            return;

        gameThread = new Thread() {
            @Override
            public void run() {
                try {
                    startGame();
                } catch (Exception e) {
                    System.err.println(e);
                    if (Display.isCreated()) {
                        Display.destroy();
                    }
                    setVisible(false);
                    validate();
                }
            }
        };

        gameThread.start();
    }

    /**
     * This removes the LWJGL Thread
     */
    @Override
    public final void removeNotify() {
        container.stopApplet();
        try {
            gameThread.join();
        } catch (InterruptedException e) {
            System.err.println(e);
        }
        super.removeNotify();
    }

    /**
     * Start the game container
     *
     * @throws Exception Failure to create display
     */
    private void startGame() throws Exception {
        Display.setParent(this);
        Display.setVSyncEnabled(true);

        try {
            createDisplay();
        } catch (LWJGLException e) {
            Log.error(e);
            // failed to create Display, apply workaround
            //(sleep for 1 second) and try again
            Thread.sleep(1000);
            createDisplay();
        }

        initGL();
        requestFocus();
        while(container.isRunning()){
            container.runloop(getWidth(), getHeight());
        }
    }

    /**
     * Create the LWJGL display
     *
     * @throws Exception Failure to create display
     */
    private void createDisplay() throws Exception {
        try {
            // create display with alpha
            Display.create(new PixelFormat(8, 8, 0));
            container.alphaSupport = true;
        } catch (Exception e) {
            // if we couldn't get alpha, let us know
            container.alphaSupport = false;
            Display.destroy();
            // create display without alpha
            Display.create();
        } 
    }

    /**
     * This function initializes the GL state
     */
    protected void initGL() {
        try {
            InternalTextureLoader.get().clear();
            SoundStore.get().clear();

            container.initApplet();
        } catch (Exception e) {
            Log.error(e);
            container.stopApplet();
        }
    }
}