package com.jslix.system;

import java.awt.Canvas;
import org.lwjgl.LWJGLException;
import org.lwjgl.opengl.Display;
import org.lwjgl.opengl.PixelFormat;
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
 * @version 01.31.12
 */
public class SlixCanvas extends Canvas{

    /** The container being displayed on this canvas */
    private SlixCanvasPanel container;
    /** Alpha background supported */
    protected boolean alphaSupport = true;
    /** The thread that is looping for the game */
    protected Thread gameThread;
    /** The container running for this game */
    private SlixCanvasPanel contain;

    /**
     * This function creates a new panel
     * @param container The currently running container
     */
    public SlixCanvas(SlixCanvasPanel container) {
        this.container = container;
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
            alphaSupport = true;
        } catch (Exception e) {
            // if we couldn't get alpha, let us know
            alphaSupport = false;
            Display.destroy();
            // create display without alpha
            Display.create();
        } finally {
            container.alphaSupport = alphaSupport;
        }

    }

    /**
     * Start the game container
     *
     * @throws Exception Failure to create display
     */
    public void start(int width, int height) throws Exception {
        Display.setParent(this);
        Display.setVSyncEnabled(true);

        try {
            createDisplay();
        } catch (LWJGLException e) {
            Log.error(e);
            // failed to create Display, apply workaround (sleep for 1 second) and try again
            Thread.sleep(1000);
            createDisplay();
        }

        initGL();
        this.requestFocus();
        container.runloop(width, height);
    }

    /**
     * This sets up a separate Thread for LWJGL to run in
     */
    @Override
    public final void addNotify() {
        super.addNotify();
        if (gameThread != null) {
            return;
        }

        gameThread = new Thread() {
            @Override
            public void run() {
                try {
                    start();
                } catch (Exception e) {
                    System.err.println(e);
                    if (Display.isCreated()) {
                        Display.destroy();
                    }
                    setVisible(false);//removeAll();
                    //add(new ConsolePanel(e));
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
        contain.stopApplet();
        try {
            gameThread.join();
        } catch (InterruptedException e) {
            System.err.println(e);
        }
        super.removeNotify();
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