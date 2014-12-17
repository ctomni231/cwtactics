package com.jslix.nightly;

import java.nio.ByteBuffer;
import org.lwjgl.BufferUtils;
import org.lwjgl.LWJGLException;
import org.lwjgl.input.Cursor;
import org.lwjgl.input.Mouse;
import org.lwjgl.opengl.Display;
import org.lwjgl.opengl.DisplayMode;
import org.lwjgl.opengl.GL11;
import org.newdawn.slick.Game;
import org.newdawn.slick.GameContainer;
import org.newdawn.slick.Graphics;
import org.newdawn.slick.Image;
import org.newdawn.slick.SlickException;
import org.newdawn.slick.opengl.CursorLoader;
import org.newdawn.slick.opengl.ImageData;
import org.newdawn.slick.opengl.InternalTextureLoader;
import org.newdawn.slick.util.Log;

/**
 * SlixCanvasPanel.java
 *
 * A shell game class that holds the Slick Applet and also controls
 * the screens for all Slick Frames and Applets. It helps provide the
 * Applet Context. Used huge chunks of code from Slick2D to help form
 * the functionality of this class.
 *
 * @author <ul><li>Glass, Kevin</li>
 *          <li>Carr, Crecen</li></ul>
 * @license Look into "LICENSE" file for further information
 * @version 02.19.12
 */
public class NSlixCanvasPanel extends GameContainer {

    /** The original display mode before we tampered with things */
    protected DisplayMode originalDisplayMode;
    /** The display mode we're going to try and use */
    protected DisplayMode targetDisplayMode;
    /** Alpha background supported */
    protected boolean alphaSupport;

    /**
     * This class uses a Game Container to provide the Applet Context
     * @param game The current Game Container
     * @param w The frame width
     * @param h The frame height
     */
    public NSlixCanvasPanel(Game game, int w, int h){
        super(game);
        width = w;
        height = h;
    }



    /**
     * This initializes the frame based on Java Applet initialization
     * @throws SlickException Indicates a failure to initialize the framework
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
        game.init(this);
        getDelta();
    }

    /**
     * This function checks if the applet is currently running
     * @return Whether this applet is running (T) or not (F)
     */
    public boolean isRunning() {
        return running;
    }

    /**
     * This function stops the applet playback
     */
    public void stopApplet() {
        running = false;
    }

    /**
     * This function gets the current height of the frame
     * @return The current height
     */
    @Override
    public int getScreenHeight() {
        return height;
    }

    /**
     * This function gets the current width of the frame
     * @return The current width
     */
    @Override
    public int getScreenWidth() {
        return width;
    }

    /**
     * This function checks if the display created supports alpha in the
     * back buffer
     * @return Whether the back buffer supports alpha (T) or not (F)
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
    //public Applet getApplet() {
    //    return SlixAppletGame.this ;
    //}

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
        Mouse.setGrabbed(grabbed);
    }

    /**
     * @see org.newdawn.slick.GameContainer#isMouseGrabbed()
     */
    @Override
    public boolean isMouseGrabbed() {
        return Mouse.isGrabbed();
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
            Mouse.setNativeCursor(cursor);
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
            Mouse.setNativeCursor(cursor);
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
     * @see org.newdawn.slick.GameContainer#setMouseCursor(
     * org.newdawn.slick.opengl.ImageData, int, int)
     */
    @Override
    public void setMouseCursor(ImageData data, int hotSpotX,
            int hotSpotY) throws SlickException {
        try {
            Cursor cursor = CursorLoader.get().getCursor(data,
                    hotSpotX, hotSpotY);
            Mouse.setNativeCursor(cursor);
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
            Mouse.setNativeCursor(cursor);
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
        //Not supported in Applet
    }

    /**
     * This function checks to see if the Slick window is full screen
     * @return Whether the Slick window is full screen (T) or not (F)
     */
    @Override
    public boolean isFullscreen() {
        return Display.isFullscreen();
    }

    /**
     * @see org.newdawn.slick.GameContainer#setFullScreen(boolean fullscreen)
     */
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
                GL11.glViewport(0, 0, width, height);

                enterOrtho();

                Display.setFullscreen(false);
            }
        } catch (LWJGLException e) {
            Log.error(e);
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

                        // if we've found a match for bpp and frequence against the
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
     * This is the running game loop
     * @param w The frame width
     * @param h The frame height
     * @throws Exception Indicates a failure within the game loop
     */
    public void runloop(int w, int h) throws Exception {
        if(running){
            int delta = getDelta();

            updateAndRender(delta);

            if(w > 0 && h > 0)
                setDisplayMode(w, h, false);

            updateFPS();
            Display.update();
        }else
            Display.destroy();
    }
}