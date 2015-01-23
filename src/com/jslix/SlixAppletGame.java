package com.jslix;

import java.applet.Applet;
import java.awt.BorderLayout;
import java.awt.Canvas;
import java.nio.ByteBuffer;
import org.lwjgl.BufferUtils;
import org.lwjgl.LWJGLException;
import org.lwjgl.input.Cursor;
import org.lwjgl.input.Mouse;
import org.lwjgl.opengl.Display;
import org.lwjgl.opengl.DisplayMode;
import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.PixelFormat;
import org.newdawn.slick.AppletGameContainer;
import org.newdawn.slick.Game;
import org.newdawn.slick.GameContainer;
import org.newdawn.slick.Graphics;
import org.newdawn.slick.Image;
import org.newdawn.slick.SlickException;
import org.newdawn.slick.openal.SoundStore;
import org.newdawn.slick.opengl.CursorLoader;
import org.newdawn.slick.opengl.ImageData;
import org.newdawn.slick.opengl.InternalTextureLoader;
import org.newdawn.slick.util.Log;

/**
 * SlixAppletGame.java
 *
 * This is used to make a general slick applet for the JSlix Screens
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.22.11
 */
public class SlixAppletGame extends AppletGameContainer {

    private SlixGame game;//Holds the game of the CanvasGameContainer
    private SlixAppletGame.Container contain;//Holds the game container
    private SlixAppletGame.ContainerPanel can;//Holds the Canvas

    /**
     * This class controls the creation and visuals of a Java2D Applet
     */
    public SlixAppletGame(){
        game = new SlixGame();
        game.startTimer(false);
    }

    /**
     * This changes the BasicGame associated with a Slick2D and Java2D game
     * @param newGame The new Slick game to associate with the applet
     */
    public final void changeGame(SlixGame newGame){
        if(newGame != null){
            game = newGame;
            game.startTimer(false);
        }
    }

    /**
     * Start a thread to run LWJGL in
     */
    @Override
    public void startLWJGL() {
        if (gameThread != null) {
            return;
        }

        gameThread = new Thread() {
            @Override
            public void run() {
                try {
                    can.start();
                } catch (Exception e) {
                    e.printStackTrace();
                    if (Display.isCreated()) {
                        Display.destroy();
                    }
                    displayParent.setVisible(false);//removeAll();
                    add(new ConsolePanel(e));
                    validate();
                }
            }
        };

        gameThread.start();
    }

    /**
     * By Kevin of Slick2D: Altered by JSR.
     */
    @Override
    public void init() {
        removeAll();
        setLayout(new BorderLayout());
        setIgnoreRepaint(true);

        try {
            contain = new Container(game);
            can = new ContainerPanel(contain);
            displayParent = new Canvas() {
                @Override
                public final void addNotify() {
                    super .addNotify();
                    startLWJGL();
                }

                @Override
                public final void removeNotify() {
                    destroyLWJGL();
                    super .removeNotify();
                }

            };

            displayParent.setSize(getWidth(), getHeight());
            add(displayParent);
            displayParent.setFocusable(true);
            displayParent.requestFocus();
            displayParent.setIgnoreRepaint(true);
            setVisible(true);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Unable to create game container");
        }
    }


    private void destroyLWJGL() {
        contain.stopApplet();
        try {
            gameThread.join();
        } catch (InterruptedException e) {
        }
    }

    /**
     * Create a new panel to display the GL context
     *
     * @author kevin
     */
    public class ContainerPanel {
        /** The container being displayed on this canvas */
        private Container container;

        /**
         * Create a new panel
         *
         * @param container The container we're running
         */
        public ContainerPanel(Container container) {
            this .container = container;
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
            }
        }

        /**
         * Start the game container
         *
         * @throws Exception Failure to create display
         */
        public void start() throws Exception {
            Display.setParent(displayParent);
            Display.setVSyncEnabled(true);

            try {
                createDisplay();
            } catch (LWJGLException e) {
                e.printStackTrace();
                // failed to create Display, apply workaround (sleep for 1 second) and try again
                Thread.sleep(1000);
                createDisplay();
            }

            initGL();
            displayParent.requestFocus();
            container.runloop();
        }

        /**
         * Initialize GL state
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


    /**
     * A game container to provide the Applet context
     *
     * @author kevin
     */
    public class Container extends GameContainer {

        /** The original display mode before we tampered with things */
        protected DisplayMode originalDisplayMode;
        /** The display mode we're going to try and use */
        protected DisplayMode targetDisplayMode;
            
        /**
         * Create a new container wrapped round the game
         *
         * @param game The game to be held in this container
         */
        public Container(Game game) {
            super (game);

            width = SlixAppletGame.this .getWidth();
            height = SlixAppletGame.this .getHeight();
        }

        /**
         * Initialize based on Applet init
         *
         * @throws SlickException Indicates a failure to initialize the basic framework
         */
        public void initApplet() throws SlickException {
            initSystem();
            enterOrtho();

            try {
                getInput().initControllers();
            } catch (SlickException e) {
                Log.info("Controllers not available");
            } catch (Throwable e) {
                Log.info("Controllers not available");
            }

            game.init(this );
            getDelta();
        }

        /**
         * Check if the applet is currently running
         *
         * @return True if the applet is running
         */
        public boolean isRunning() {
            return running;
        }

        /**
         * Stop the applet play back
         */
        public void stopApplet() {
            running = false;
        }

        /**
         * @see org.newdawn.slick.GameContainer#getScreenHeight()
         */
        @Override
        public int getScreenHeight() {
            return 0;
        }

        /**
         * @see org.newdawn.slick.GameContainer#getScreenWidth()
         */
        @Override
        public int getScreenWidth() {
            return 0;
        }

        /**
         * Check if the display created supported alpha in the back buffer
         *
         * @return True if the back buffer supported alpha
         */
        public boolean supportsAlphaInBackBuffer() {
            return alphaSupport;
        }

        /**
         * @see org.newdawn.slick.GameContainer#hasFocus()
         */
        @Override
        public boolean hasFocus() {
            return true;
        }

        /**
         * Returns the Applet Object
         * @return Applet Object
         */
        public Applet getApplet() {
            return SlixAppletGame.this ;
        }

        /**
         * @see org.newdawn.slick.GameContainer#setIcon(java.lang.String)
         */
        @Override
        public void setIcon(String ref) throws SlickException {
            // unsupported in an applet
        }

        /**
         * @see org.newdawn.slick.GameContainer#setMouseGrabbed(boolean)
         */
        @Override
        public void setMouseGrabbed(boolean grabbed) {
            MouseInputBean.setGrabbed(grabbed);
        }

        /**
         * @see org.newdawn.slick.GameContainer#isMouseGrabbed()
         */
        @Override
        public boolean isMouseGrabbed() {
            return MouseInputBean.isGrabbed();
        }

        /**
         * @see org.newdawn.slick.GameContainer#setMouseCursor(java.lang.String,
         *      int, int)
         */
        @Override
        public void setMouseCursor(String ref, int hotSpotX,
                int hotSpotY) throws SlickException {
            try {
                Cursor cursor = CursorLoader.get().getCursor(ref,
                        hotSpotX, hotSpotY);
                MouseInputBean.setNativeCursor(cursor);
            } catch (Throwable e) {
                Log.error("Failed to load and apply cursor.", e);
                throw new SlickException("Failed to set mouse cursor",
                        e);
            }
        }

        /**
         * Get the closest greater power of 2 to the fold number
         *
         * @param fold The target number
         * @return The power of 2
         */
        private int get2Fold(int fold) {
            int ret = 2;
            while (ret < fold) {
                ret *= 2;
            }
            return ret;
        }

        /**
         * {@inheritDoc}
         */
        @Override
        public void setMouseCursor(Image image, int hotSpotX,
                int hotSpotY) throws SlickException {
            try {
                Image temp = new Image(get2Fold(image.getWidth()),
                        get2Fold(image.getHeight()));
                Graphics g = temp.getGraphics();

                ByteBuffer buffer = BufferUtils.createByteBuffer(temp
                        .getWidth()
                        * temp.getHeight() * 4);
                g.drawImage(image.getFlippedCopy(false, true), 0, 0);
                g.flush();
                g.getArea(0, 0, temp.getWidth(), temp.getHeight(),
                        buffer);

                Cursor cursor = CursorLoader.get().getCursor(buffer,
                        hotSpotX, hotSpotY, temp.getWidth(),
                        temp.getHeight());
                MouseInputBean.setNativeCursor(cursor);
            } catch (Throwable e) {
                Log.error("Failed to load and apply cursor.", e);
                throw new SlickException("Failed to set mouse cursor",
                        e);
            }
        }

        /**
         * @see org.newdawn.slick.GameContainer#setIcons(java.lang.String[])
         */
        @Override
        public void setIcons(String[] refs) throws SlickException {
            // unsupported in an applet
        }

        /**
         * @see org.newdawn.slick.GameContainer#setMouseCursor(org.newdawn.slick.opengl.ImageData, int, int)
         */
        @Override
        public void setMouseCursor(ImageData data, int hotSpotX,
                int hotSpotY) throws SlickException {
            try {
                Cursor cursor = CursorLoader.get().getCursor(data,
                        hotSpotX, hotSpotY);
                MouseInputBean.setNativeCursor(cursor);
            } catch (Throwable e) {
                Log.error("Failed to load and apply cursor.", e);
                throw new SlickException("Failed to set mouse cursor",
                        e);
            }
        }

        /**
         * @see org.newdawn.slick.GameContainer#setMouseCursor(org.lwjgl.input.Cursor, int, int)
         */
        @Override
        public void setMouseCursor(Cursor cursor, int hotSpotX,
                int hotSpotY) throws SlickException {
            try {
                MouseInputBean.setNativeCursor(cursor);
            } catch (Throwable e) {
                Log.error("Failed to load and apply cursor.", e);
                throw new SlickException("Failed to set mouse cursor",
                        e);
            }
        }

        /**
         * @see org.newdawn.slick.GameContainer#setDefaultMouseCursor()
         */
        @Override
        public void setDefaultMouseCursor() {
        }

        @Override
        public boolean isFullscreen() {
            return Display.isFullscreen();
        }

        @Override
        public void setFullscreen(boolean fullscreen)
                throws SlickException {
            if (fullscreen == isFullscreen()) {
                return;
            }

            try {
                if (fullscreen) {
                    // get current screen resolution
                    int screenWidth = Display.getDisplayMode()
                            .getWidth();
                    int screenHeight = Display.getDisplayMode()
                            .getHeight();

                    // calculate aspect ratio
                    float gameAspectRatio = (float) width / height;
                    float screenAspectRatio = (float) screenWidth
                            / screenHeight;

                    int newWidth;
                    int newHeight;

                    // get new screen resolution to match aspect ratio

                    if (gameAspectRatio >= screenAspectRatio) {
                        newWidth = screenWidth;
                        newHeight = (int) (height / ((float) width / screenWidth));
                    } else {
                        newWidth = (int) (width / ((float) height / screenHeight));
                        newHeight = screenHeight;
                    }

                    // center new screen
                    int xoffset = (screenWidth - newWidth) / 2;
                    int yoffset = (screenHeight - newHeight) / 2;

                    // scale game to match new resolution
                    GL11.glViewport(xoffset, yoffset, newWidth,
                            newHeight);

                    enterOrtho();

                    // fix input to match new resolution
                    this .getInput().setOffset(
                            -xoffset * (float) width / newWidth,
                            -yoffset * (float) height / newHeight);

                    this .getInput().setScale((float) width / newWidth,
                            (float) height / newHeight);

                    width = screenWidth;
                    height = screenHeight;
                    Display.setFullscreen(true);
                } else {
                    // restore input
                    this .getInput().setOffset(0, 0);
                    this .getInput().setScale(1, 1);
                    width = SlixAppletGame.this .getWidth();
                    height = SlixAppletGame.this .getHeight();
                    GL11.glViewport(0, 0, width, height);

                    enterOrtho();

                    Display.setFullscreen(false);
                }
            } catch (LWJGLException e) {
                Log.error(e);
            }

        }

         /**
         * Check the dimensions of the canvas match the display
         */
        public void checkDimensions() {
            if ((width != SlixAppletGame.this .getWidth())
                    || (height != SlixAppletGame.this .getHeight())) {

                try {
                    this.setDisplayMode(SlixAppletGame.this .getWidth(),
                            SlixAppletGame.this .getHeight(), false);
                } catch (SlickException e) {
                    Log.error(e);
                }
            }
        }

        /**
         * Set the display mode to be used
         *
         * @param width The width of the display required
         * @param height The height of the display required
         * @param fullscreen True if we want fullscreen mode
         * @throws SlickException Indicates a failure to initialize the display
         */
        public void setDisplayMode(int width, int height, boolean fullscreen)
                throws SlickException {
            if ((this .width == width) && (this .height == height)
                    && (isFullscreen() == fullscreen)) {
                return;
            }

            try {
                targetDisplayMode = null;
                if (fullscreen) {
                    DisplayMode[] modes = Display
                            .getAvailableDisplayModes();
                    int freq = 0;

                    for (int i = 0; i < modes.length; i++) {
                        DisplayMode current = modes[i];

                        if ((current.getWidth() == width)
                                && (current.getHeight() == height)) {
                            if ((targetDisplayMode == null)
                                    || (current.getFrequency() >= freq)) {
                                if ((targetDisplayMode == null)
                                        || (current.getBitsPerPixel() > targetDisplayMode
                                                .getBitsPerPixel())) {
                                    targetDisplayMode = current;
                                    freq = targetDisplayMode.getFrequency();
                                }
                            }

                            // if we've found a match for bpp and frequency against the
                            // original display mode then it's probably best to go for this one
                            // since it's most likely compatible with the monitor
                            if ((current.getBitsPerPixel() == originalDisplayMode
                                    .getBitsPerPixel())
                                    && (current.getFrequency() == originalDisplayMode
                                            .getFrequency())) {
                                targetDisplayMode = current;
                                break;
                            }
                        }
                    }
                } else {
                    targetDisplayMode = new DisplayMode(width, height);
                }

                if (targetDisplayMode == null) {
                    throw new SlickException("Failed to find value mode: "
                            + width + "x" + height + " fs=" + fullscreen);
                }

                this .width = width;
                this .height = height;

                Display.setDisplayMode(targetDisplayMode);
                Display.setFullscreen(fullscreen);

                if (Display.isCreated()) {
                    initGL();
                    enterOrtho();
                }

                if (targetDisplayMode.getBitsPerPixel() == 16) {
                    InternalTextureLoader.get().set16BitMode();
                }
            } catch (LWJGLException e) {
                throw new SlickException("Unable to setup mode " + width
                        + "x" + height + " fullscreen=" + fullscreen, e);
            }

            getDelta();
        }

        /**
         * The running game loop
         *
         * @throws Exception Indicates a failure within the game's loop rather than the framework
         */
        public void runloop() throws Exception {
            while (running) {
                int delta = getDelta();

                updateAndRender(delta);

                checkDimensions();

                updateFPS();
                Display.update();
            }

            Display.destroy();
        }
    }
}
