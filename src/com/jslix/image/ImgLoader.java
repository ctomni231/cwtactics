package com.jslix.image;

import java.awt.Component;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.MediaTracker;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.awt.image.ImageObserver;
import java.awt.image.PixelGrabber;
import java.net.URL;
import java.security.AccessControlException;
import javax.swing.ImageIcon;

import com.jslix.io.FileFind;

/**
 * ImgLoader.java
 *
 * A remix of ImageLoader. Gives functions in helping to load awtImages
 * from within the .jar, on a web page, or within a relative folder. Added
 * some stuff for the GIF to work
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 08.02.20
 */

public class ImgLoader extends Component{
	
    private static final long serialVersionUID = 2452945053572843636L;

    /**
     * Loads an Image from a image file. This is used to load images from
     * the user directory from a relative file path.
     *
     * @param filename The filename of a picture file
     * @return A loaded image (if it exists)
     */
    public Image getFileImage(String filename){
        try{
            Toolkit tk = Toolkit.getDefaultToolkit();
            return loadImage(tk.getImage(filename));
        }catch(AccessControlException ex){
            System.err.println(ex);
            return getClassResource(filename);
        }
    }

    /**
     * This will attempt to load an image from a resource file using the
     * Threads get resource method. This is used to reference images directly
     * within a .jar file
     *
     * @param filename The pathname of the resource
     * @return A loaded image (if it exists)
     */
    public Image getThreadResource(String filename){
        return getURLImage(Thread.currentThread().
                getContextClassLoader().getResource(filename));
    }

    //Gets an image for applets mostly, works like getting a thread resource
    /**
     * This will attempt to load an image from a resource file using the
     * System resource method. It retrieves an image for Applets mostly,
     * working like a thread resource.
     *
     * @param filename The pathname of the resource
     * @return A loaded image (if it exists)
     */
    public Image getClassResource(String filename){
        return getURLImage(getClass().getResource("/"+filename));
    }

    /**
     * Loads and retrieves an image from an URL
     *
     * @param urlstring The URL of the picture file
     * @return A loaded image (if it exists)
     */
    public Image getURLImage (String urlstring){
        try{
            return getURLImage(new URL(urlstring));
        } catch(Exception e){
            System.err.println(e);
            return null;
        }
    }

    /**
     * Loads and retrieves an Image from an URL location
     *
     * @param url The URL of the picture file
     * @return A loaded image (if it exists)
     */
    public Image getURLImage(URL url){
        URL imgURL = url;
        Toolkit tk = Toolkit.getDefaultToolkit();
        return (imgURL == null) ? null : loadImage(tk.getImage(url));
    }

    /**
     * Draws the entire image. It is used to make sure the full image is
     * loaded into memory before drawing it.
     *
     * @param img The image to draw
     */
    public Image loadImage(Image img){
        MediaTracker mt = new MediaTracker(this);
        mt.addImage(img, 1);
        try{
            mt.waitForAll();
        }catch(Exception e){
            System.err.println(e);
        }
        return img;
    }
    
    /**
     * Used to get an Image Icon (useful for displaying GIF animations)
     * @param filename The path to the image
     * @return An image icon of the image
     */
    public Image getImageIcon(String filename) {
    	FileFind finder = new FileFind();
    	return new ImageIcon(finder.getFileURL(filename)).getImage();
    }

    /**
     * A private class used to organize pixels into an array of integers
     * from a java2D image
     *
     * @param img The image to change into pixels
     * @param x The x position of pixel
     * @param y The y position of pixel
     * @param w Width of the image
     * @param h Height of the image
     * @return an array of RGB value integers representing the image
     */
    public int[] handlePixels(Image img, int x, int y, int w, int h) {
        int[] pixel = new int[w*h];
        PixelGrabber pg = new PixelGrabber(img, x, y, w, h, pixel, 0, w);
        try {
            pg.grabPixels();
        } catch (InterruptedException e) {
            System.err.println("Error: Interrupted Waiting for Pixels");
            return null;
        }
        if ((pg.getStatus() & ImageObserver.ABORT) != 0) {
            System.err.println("Error: Image Fetch Aborted");
            return null;
        }
        return pixel;
    }

    /**
     * This function uses java2D Buffered Image in order to crop an image
     * @param image The image to crop
     * @param locx The location of the x-axis top-left corner to start cutting
     * @param locy The location of the y-axis top-left corner to start cutting
     * @param sizex The width of the cut
     * @param sizey The height of the cut
     * @return A cut image to specifications
     */
    public Image cutImage(Image image, int locx, int locy,
            int sizex, int sizey){
        BufferedImage bimg = new BufferedImage(
                sizex, sizey, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = bimg.createGraphics();
        g2.drawImage(image, 0, 0, sizex, sizey,
                locx, locy, locx+sizex, locy+sizey, this);
        return bimg;
    }
}
