package com.jslix.image;

import java.awt.Component;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.MemoryImageSource;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import javax.imageio.ImageIO;
import java.awt.AlphaComposite;
import java.awt.Color;

/**
 * ImgLibrary.java
 *
 * A remix of ImageSorter, ImgLibrary helps with organizing and sectioning
 * images. It performs recolors, resizes images, stores images, and sets
 * optional references for images. Combines TextImg, PixtureMap, Animated GIF, 
 * and the original ImgLibrary into one big huge verbose package
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 08.04.20
 */

public class ImgLibrary extends Component{

	private static final long serialVersionUID = 1L;

	// Image Library Stuff
	/** Helps with loading images */
    protected ImgLoader il;
    /** Helps store a list of images by index */
    private ImgHolder[] sortedImg;
    /** Helps turn an image list into a String reference */
    private HashMap<String, Integer> hashImg;
    /** Holds values so you can change colors within images */
    private HashMap<Integer, Integer> colorChanger;
    /** Holds values that will be blended into image */
    private ArrayList<Integer> colorBlend;
    /** Used to set the width for an image */
    private int sizex;
    /** Used to set the height for an image */
    private int sizey;
    /** Used to set the blend opacity */
    private double opacity;
    /** Lets the user choose whether to store a filename image */
    private boolean storeFileRef;
    /** Lets the user quickly flip this image horizontally */
    private boolean mirrorX;
    /** Lets the user quickly flip this image vertically */
    private boolean mirrorY;
    /** Lets the user rotate this image clockwise 90 degrees */
    private boolean rotNine;
    /** A temporary item to help store images */
    private ImgHolder tempImg;
    /** Holds which scaling algorithm to use **/
    private int imgscale;

    // PixtureMap stuff
    /** The default font type */
    public final String FONT = "DIALOG";
    /** The graphics class used for creating images */
    private Graphics2D g;
    /** The Image class used to store the creations */
    private BufferedImage pimg;
    /** The width of the edit image portion */
    private int editSizeX;
    /** The height of the edit image portion */
    private int editSizeY;
    /** The transparent color of the image */
    private Color transparent;
    /** The pixel representation of the grid for editing */
    private int[][] editgrid;
    /** The current opacity of an update */
    private double editOpacity;

    // Text Image Library Stuff
    /** Contains all the letters for the combine image */
    public final String ASCII_COMBINE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,'-=_";
    /** Holds the textual slicing info for an stored image */
    private HashMap<Integer, String[]> textInfo;

    /**
     * This class holds a library of images for both Slick2D and Java2D
     * windows. It also allows you to perform resizes, recolors, blends,
     * pixel flips, and image rotates to the image. The class also allows
     * you to index images by name, and cut images to specific sizes.
     */
    public ImgLibrary(){
        sortedImg = new ImgHolder[0];
        hashImg = new HashMap<String, Integer>();
        il = new ImgLoader();
        colorChanger = new HashMap<Integer, Integer>();
        colorBlend = new ArrayList<Integer>();
        sizex = 0;
        sizey = 0;
        opacity = 0.5;
        storeFileRef = true;
        mirrorX = false;
        mirrorY = false;
        rotNine = false;
        tempImg = new ImgHolder();
        imgscale = Image.SCALE_AREA_AVERAGING;

        // PixtureMap
        editOpacity = 1.0;
        createImage(1, 1);
        editSizeX = 1;
        editSizeY = 1;
        transparent = Color.BLACK;

        // TextImgLibrary
        textInfo = new HashMap<Integer, String[]>();
    }

    //-------
    //SETTERS
    //-------

    /**
     * This function sets the next loaded image to the size you specify.
     * Therefore this must be called before an image is added. The size
     * is reset after an image is added. Image size can only be set once.
     *
     * @param x The x-axis width
     * @param y The y-axis length
     */
    public void setImageSize(int x, int y) {
       sizex = x;
       sizey = y;
    }

    /**
     * This function is used to flip an image about its x-axis in the
     * next loaded image. Therefore, this must be called before an image
     * added. The mirror is reset after an image is added. Calling this
     * forces an image to flip along the x-axis.
     */
    public void setFlipX(){
        mirrorX = true;
    }

    /**
     * This function is used to flip an image about its y-axis in the
     * next loaded image. Therefore, this must be called before an image
     * added. The mirror is reset after an image is added. Calling this
     * forces an image to flip along the y-axis.
     */
    public void setFlipY(){
        mirrorY = true;
    }

    /**
     * This function is used to rotate an image clockwise in the
     * next loaded image. Therefore, this must be called before an image
     * added. The rotation is reset after an image is added.
     */
    public void setRotateNinety(){
        rotNine = true;
    }

    /**
     * This function changes the preference of storing file type strings
     * as references to the image. This function must be called before
     * adding an image to apply to that image. Default is true.
     * @param store Whether to store a file reference(T) or not(F)
     */
    public void setReference(boolean store){
        storeFileRef = store;
    }

    /**
     * This function changes all pixels of the matching color to another
     * color in the next loaded image using the java2D color object.
     * Therefore this must be called before an image is added. The colors
     * are reset after an image is added. More than one color can be changed
     * with multiple calls to this function.
     *
     * @param fromThisColor The pixel color in this image
     * @param toThisColor What to change the pixel in this image to
     */
    public void setPixelChange(Color fromThisColor, Color toThisColor){
        if(toThisColor != null && fromThisColor != null)
            colorChanger.put(fromThisColor.getRGB(), toThisColor.getRGB());
    }

    /**
     * This function will blend the color chosen into every pixel
     * within the image. The opacity controls how deep the blend
     * will be in the picture. This action occurs only in the next
     * loaded image. The colors are reset after an image is added.
     * More than one color can be blended with multiple calls to this
     * function.
     *
     * @param blendColor The color to blend in
     */
    public void setPixelBlend(Color blendColor){
        setPixelBlend(blendColor, 0.5);
    }

    /**
     * This function will blend the color chosen into every pixel
     * within the image. The opacity controls how deep the blend
     * will be in the picture. This action occurs only in the next
     * loaded image. The colors are reset after an image is added.
     * More than one color can be blended with multiple calls to this
     * function.
     *
     * @param blendColor The color to blend in
     * @param opacity How deep the blend should be
     * [lowest = 0: highest = 1.0]
     */
    public void setPixelBlend(Color blendColor, double opacity){
        if(blendColor != null)  colorBlend.add(0, blendColor.getRGB());
        if(opacity >= 0 && opacity <= 1)  this.opacity = opacity;
    }

    /**
     * This function sets the default colors to ignore while the image
     * is blending. This action occurs only in the next
     * loaded image. The colors are reset after an image is added.
     * More than one color can be ignored with multiple calls to this
     * function.
     * @param ignoreColor The default color pixel to ignore
     */
    public void setPixelIgnore(Color ignoreColor){
        if(ignoreColor != null)  colorBlend.add(ignoreColor.getRGB());
    }

    /**
     * Sets the image scale to a particular scale
     * @param scale The scale algorithm to use
     */
    public void setScale(int scale) {
    	imgscale = scale;
    }

    /**
     * Set the scaling quality of the image [* => Default choice]
     * @param value 0-Default, 1-fast, 2-Replicate, 3-ScaleAreaAveraging*, 4-Smooth
     */
    public void setQuality(int value) {
    	if(value <= 0) {
    		imgscale = Image.SCALE_DEFAULT;
    	}else if(value == 1) {
    		imgscale = Image.SCALE_FAST;
    	}else if(value == 2) {
    		imgscale = Image.SCALE_REPLICATE;
    	}else if(value == 3) {
    		imgscale = Image.SCALE_AREA_AVERAGING;
    	}else {
    		imgscale = Image.SCALE_SMOOTH;
    	}
    }

    //------
    //ADDERS
    //------

    /**
     * This function attempts to add an image to the ImageSorter
     * using only a filename, will also search for references.
     *
     * @param filename The location where the image is located
     * @return Image was stored if true
     */
    public boolean addImage(String filename){
        return addImage(-1, filename, null);
    }

    /**
     * This function attempts to overwrite an image in an index
     * with the index you specify.
     *
     * @param index Where to place this image in the array (negative for new)
     * @param filename The location where the image is located
     *
     * @return Image was stored if true
     */
    public boolean addImage(int index, String filename){
        return addImage(index, filename, null);
    }

    /**
     * This function stores an image within the ImgLibrary at the next
     * array. The image is unnamed, so it'll be impossible to reference
     * from a filename. Instead, you'll have to store the reference to
     * this image by index using length()
     *
     * @param desImg A pre-rendered image to put into ImgLibrary
     * @return Image was stored if true
     */
    public boolean addImage(Image desImg){
        return addImage(-1, "", desImg);
    }

    /**
     * This function overwrites an image within the ImgLibrary at the next
     * array. The image is unnamed, so it'll be impossible to reference
     * from a filename. Instead, you'll have to store the reference to
     * this image by index using length()
     *
     * @param index Where to place this image in the array (negative for new)
     * @param desImg A pre-rendered image to put into ImgLibrary
     * @return Image was stored if true
     */
    public boolean addImage(int index, Image desImg){
        return addImage(index, "", desImg);
    }

    /**
     * This function stores an image within the ImgLibrary at the next
     * array. The imgRef is how this image will be referenced in a
     * HashMap.
     *
     * @param imgRef The reference name to this image
     * @param desImg A pre-rendered image to put into ImageSorter
     * @return Image was stored if true
     */
    public boolean addImage(String imgRef, Image desImg){
        return addImage(-1, imgRef, desImg);
    }

    /**
     * This function stores or overwrites images and pixel arrays
     * within ImgLibrary<p>
     * If a non-null desiredImage is passed in, this function
     * will store this image with a reference equal to filename
     * within the ImgLibrary. If the desiredImage is invalid or
     * null, this function attempts to load an image from the filename.
     * If that fails, it then tries to load the file from the
     * resource. If an image fails to load, nothing is stored to the
     * ImageSorter and it returns false.
     *
     * @param index Where to place this image in the array (negative for new)
     * @param filename The location where the image is located
     * @param desiredImage A pre-rendered image to put into ImgLibrary
     *
     * @return Image was stored if true
     */
    public boolean addImage(int index, String filename,
            Image desiredImage){
        //Checks whether key exists
        if(hashImg.containsKey(filename))
            index = hashImg.get(filename);
        //Loads an image using the file path
        tempImg.image = (desiredImage == null) ?
            il.getFileImage(filename) : desiredImage;
        //Loads a reference image, if no file image
        if(tempImg.image.getHeight(this) == -1)
            tempImg.image = il.getThreadResource(filename);
        //Loads no image if nothing is found
        if(tempImg.image == null)
            return false;
        //Makes image searchable by filename
        if(!filename.equals("") && storeFileRef)
            hashImg.put(filename, (index == -1) ? sortedImg.length : index);
        storeFileRef = true;
        //Either makes a new image or overwrites an older one.
        if(index >= 0 && index < sortedImg.length)
            sortedImg[index] = storeImage();
        else{
            ImgHolder[] temp = sortedImg;
            sortedImg = new ImgHolder[temp.length+1];
            System.arraycopy(temp, 0, sortedImg, 0, temp.length);
            sortedImg[sortedImg.length-1] = storeImage();
        }
        return true;
    }

    /**
     * This function adds a reference string to an image for naming.
     * References are stored in a hash so images can be referenced
     * from these names using the getImage Function.<p>
     * Searches for the image in the HashMap given by storedImg and
     * adds another reference to that image with that same name.
     *
     * @param imgName A new reference name for the image
     * @param storedImg Any old reference name for an image stored
     * @return If image reference was stored
     */
    public boolean addReference(String imgName, String storedImg){
        return hashImg.containsKey(storedImg) ?
            addReference(imgName, hashImg.get(storedImg)) : false;
    }

    /**
     * This function adds a reference string to an image for naming.
     * References are stored in a hash so images can be referenced
     * from these names using the getImage() Function.
     *
     * @param imgName A reference name for the image
     * @param index Where the image is located in the array
     *
     * @return If image reference was stored
     */
    public boolean addReference(String imgName, int index){
        if(!imgName.equals("") && index >= 0 && index < sortedImg.length){
            hashImg.put(imgName, index);
            return true;
        }
        return false;
    }

    //-------
    //GETTERS
    //-------

    /**
     * Makes a java2D color box with the specified size. This is used to keep
     * images from ever becoming null.
     *
     * @param theColor The color of the box
     * @param sizex The height of the box
     * @param sizey The width of the box
     * @return An image containing a colored box
     */
    public Image getColorBox(Color theColor, int sizex, int sizey){
        if(sizex < 1) sizex = 100;
        if(sizey < 1) sizey = 100;
        int[] colorbox = new int[sizex*sizey];
        for(int i = 0; i < colorbox.length; i++)
            colorbox[i] = theColor.getRGB();
        return createImage(new MemoryImageSource(sizex, sizey, colorbox,
                0, sizex));
    }

    /**
     * This function returns a java2D image stored within an ImgLibrary
     * using an String reference
     *
     * @param ref The image reference or filename of the image
     * @return An image from the index if true; a red dot if false
     */
    public Image getImage(String ref){
        return getImage(getIndex(ref));
    }

    /**
     * This function returns a java2D image stored within an ImgLibrary
     * using an array index
     *
     * @param index The index where this image is located
     * @return An image from the index if true; a red dot if false
     */
    public Image getImage(int index){
        return index >= 0 && index < sortedImg.length ?
            sortedImg[index].image : getColorBox(Color.RED,1,1);
    }

    /**
     * This will cut out an image from a pixel picture stored within
     * the ImgLibrary. The image is displayed as an entirely new Image,
     * while the old image is left unaltered.
     * @param index The index where this image is located
     * @param cutlx The location of the x-axis top-left
     * corner to start cutting
     * @param cutly The location of the y-axis top-left
     * corner to start cutting
     * @param cutsx The width of the cut
     * @param cutsy The height of the cut
     * @return A cut image to specifications
     */
    public Image getImage(int index, int cutlx, int cutly,
            int cutsx, int cutsy){
        return il.cutImage(getImage(index), cutlx, cutly, cutsx, cutsy);
    }
    
    /**
     * This function returns an ImageIcon, allowing Java to be able to 
     * handle Animated GIFs. Not part of the regular image pipeline.
     * 
     * @param filename The file location where the image is kept
     * @return An animated GIF image if true, a blue dot if false
     */
    public Image getGIFImage(String filename){
        return il.getImageIcon(filename);
    }

     /**
     * This function returns pixels stored within an ImageSorter
     * using an String reference
     *
     * @param ref The image name or filename of the image
     * @return The array of pixels from this image
     */
    public int[] getPixels(String ref){
        return getPixels(getIndex(ref));
    }

     /**
     * This function returns pixels stored within an ImageSorter
     * using an array index
     *
     * @param index The index where this image is located
     * @return The array of pixels from this image
     */
    public int[] getPixels(int index){
        int[] temp = (index >= 0 && index < sortedImg.length) ?
            sortedImg[index].pixels : new int[0];
        if(index >= 0 && index < sortedImg.length && temp == null){
            ImgHolder heldImg = sortedImg[index];
            heldImg.pixels = il.handlePixels(heldImg.image,
                    0, 0, heldImg.sizex, heldImg.sizey);
            sortedImg[index] = heldImg;
            temp = heldImg.pixels;
        }
        return temp;
    }

    /**
     * This function returns the original x-axis size of the image
     * stored within an ImgLibrary using a string reference
     *
     * @param ref The image reference or filename of the image
     * @return The original x-axis size of the image
     */
    public int getOrigX(String ref){
        return getOrigX(getIndex(ref));
    }

    /**
     * This function returns the original x-axis size of the image
     * stored within an ImgLibrary using an array index
     *
     * @param index The index where this image is located
     * @return The original x-axis size of the image
     */
    public int getOrigX(int index){
        return index >= 0 && index < sortedImg.length ?
            sortedImg[index].origx : 0;
    }

    /**
     * This function returns the original y-axis size of the image
     * stored within an ImgLibrary using a string reference
     *
     * @param ref The image reference or filename of the image
     * @return The original y-axis size of the image
     */
    public int getOrigY(String ref){
        return getOrigY(getIndex(ref));
    }

    /**
     * This function returns the original y-axis size of the image
     * stored within an ImgLibrary using an array index
     *
     * @param index The index where this image is located
     * @return The original y-axis size of the image
     */
    public int getOrigY(int index){
        return index >= 0 && index < sortedImg.length ?
            sortedImg[index].origy : 0;
    }

    /**
     * This function returns the current x-axis size of the image
     * stored within an ImageSorter using a string reference
     *
     * @param ref The image reference or filename of the image
     * @return The resized x-axis image size
     */
    public int getX(String ref){
        return getX(getIndex(ref));
    }

    /**
     * This function returns the current x-axis size of the image
     * stored within an ImageSorter using an array index
     *
     * @param index The index where this image is located
     * @return The resized x-axis image size
     */
    public int getX(int index){
        return index >= 0 && index < sortedImg.length ?
            sortedImg[index].sizex : 0;
    }

    /**
     * This function returns the current y-axis size of the image
     * stored within an ImageSorter using a string reference
     *
     * @param ref The image reference or filename of the image
     * @return The resized y-axis image size
     */
    public int getY(String ref){
        return getY(getIndex(ref));
    }

    /**
     * This function returns the current x-axis size of the image
     * stored within an ImageSorter using an array index
     *
     * @param index The index where this image is located
     * @return The resized x-axis image size
     */
    public int getY(int index){
        return index >= 0 && index < sortedImg.length ?
            sortedImg[index].sizey : 0;
    }

    /**
     * This function returns an image index that matches the reference
     *
     * @param ref The image name or filename of the image
     * @return An integer stating where this picture is in the array
     * of the ImageSorter
     */
    public int getIndex(String ref){
        return hashImg.containsKey(ref) ? hashImg.get(ref): -1;
    }

    /**
     * This function gets the number of elements of the array in
     * ImgLibrary of stored images
     *
     * @return The number of stored images
     */
    public int length(){
        return sortedImg.length;
    }

    /**
     * This function gets the number of elements of the references
     * to the images. There actually might be more references than
     * images themselves.
     *
     * @return The total number of references
     */
    public int hashSize(){
        return hashImg.size();
    }

    /**
     * This function adds translucency to a java2D color
     * @param color The current java2D color
     * @param alpha The amount of opacity to apply (0-255)
     * @return The java2D color with the appended opacity
     */
    public Color getColor(Color color, int alpha){
        return (alpha < 0 || alpha > 255) ? color :
            new Color(color.getRed(), color.getGreen(),
            color.getBlue(), alpha);
    }

    //-----------------
    //DRAW FUNCTIONS
    //-----------------

    /**
     * This function places an image on a destination screen. Used
     * primarily for drawing items to the screen quickly.
     * @param g The Java2D Graphics Object
     * @param img The Java2D image to draw to location
     * @param dlx The destination (screen) x-axis location of the image
     * @param dly The destination (screen) y-axis location of the image
     * @param dthis The Component to draw the image to
     */
    public void placeImg(Graphics2D g, Image img, int dlx, int dly,
                        Component dthis){
        g.drawImage(img, dlx, dly, dthis);
    }

    /**
     * This function draws the image on a destination screen. Used
     * for drawing items to the screen and allowing for scaling of the
     * destination image on the fly
     * @param g The Java2D Graphics Object
     * @param img The Java2D image to draw to location
     * @param dlx The destination (screen) x-axis position of the image
     * @param dly The destination (screen) y-axis position of the image
     * @param dsx The destination (screen) horizontal width of the image
     * @param dsy The destination (screen) vertical height of the image
     * @param dthis The Component to draw the image to
     */
    public void drawImg(Graphics2D g, Image img, int dlx, int dly,
                                      int dsx, int dsy, Component dthis){
    	dlx = (dsx < 0) ? dlx-dsx : dlx;
    	dly = (dsy < 0) ? dly-dsy : dly;
    	g.drawImage(img, dlx, dly, dsx, dsy, dthis);
    }

    /**
     * This function is used for placing one shifted image on the
     * destination screen. Used for making a picture that will slide out
     * of view, or could also be used for screen shakes.
     *
     * If slx and sly are both zero, you'll return a normal image placed
     * like the function placeImg
     *
     * @param g The Java2D Graphics Object
     * @param img The Java2D image to draw to location
     * @param dlx The destination (screen) x-axis position of the image
     * @param dly The destination (screen) y-axis position of the image
     * @param slx The source (picture) x-axis cut position of the image
     * @param sly The source (picture) y-axis cut position of the image
     * @param dthis The Component to draw the image to
     */
    public void placeCropImg(Graphics2D g, Image img, int dlx, int dly,
                                           int slx, int sly, Component dthis){
    	g.drawImage(img, dlx, dly, dlx+img.getWidth(dthis), dly+img.getHeight(dthis), 
    			         slx, sly, slx+img.getWidth(dthis), sly+img.getHeight(dthis), dthis);

    }

    /**
     * This function is used for drawing one shifted image on the
     * destination screen. Used for making a picture that will slide out
     * of view, or could also be used for screen shakes. This function
     * will allow for scaling of the destination image
     *
     * If slx and sly are both zero, you'll return a normal image drawn
     * like the function drawImg
     *
     * @param g The Java2D Graphics Object
     * @param img The Java2D image to draw to location
     * @param dlx The destination (screen) x-axis position of the image
     * @param dly The destination (screen) y-axis position of the image
     * @param dsx The destination (screen) horizontal width of the image
     * @param dsy The destination (screen) vertical height of the image
     * @param slx The source (picture) x-axis cut position of the image
     * @param sly The source (picture) y-axis cut position of the image
     * @param dthis The Component to draw the image to
     */
    public void drawCropImg(Graphics2D g, Image img, int dlx, int dly, 
    		    int dsx, int dsy, int slx, int sly, Component dthis){
    	dlx = (dsx < 0) ? dlx-dsx : dlx;
    	dly = (dsy < 0) ? dly-dsy : dly;
    	g.drawImage(img, dlx, dly, dlx+dsx, dly+dsy, slx, sly, 
    			slx+img.getWidth(dthis), sly+img.getHeight(dthis), dthis);
    }

    /**
     * This function is used to place a cut image from the source picture
     * directly on the destination screen. This can be used for sprite sheets
     * as the default will make the size of the source and the destination
     * images the same so the image will not scale when drawn
     *
     * If slx and sly are both zero, ssx is the original source image width,
     * and ssy is the original image height, you'll return a normal image
     * placed like the function placeImg
     *
     * @param g The Java2D Graphics Object
     * @param img The Java2D image to draw to location
     * @param dlx The destination (screen) x-axis position of the image
     * @param dly The destination (screen) y-axis position of the image
     * @param slx The source (picture) x-axis cut position of the image
     * @param sly The source (picture) y-axis cut position of the image
     * @param ssx The source (picture) x-axis width slice of the image
     * @param ssy The source (picture) y-axis height slice of the image
     * @param dthis The Component to draw the image to
     */
    public void placeCutImg(Graphics2D g, Image img, int dlx, int dly, 
    		int slx, int sly, int ssx, int ssy, Component dthis){
    	g.drawImage(img, dlx, dly, dlx+ssx, dly+ssy, 
                slx, sly, slx+ssx, sly+ssy, dthis);
    }

    /**
     * This function is used to draw a cut image from the source picture
     * directly on the destination screen. Unlike the function above, this
     * allows you to scale the picture before it arrives at the destination
     *
     * If slx and sly are both zero, ssx is the original source image width,
     * and ssy is the original image height, you'll return a normal image
     * drawn like the function drawImg
     *
     * @param g The Java2D Graphics Object
     * @param img The Java2D image to draw to location
     * @param dlx The destination (screen) x-axis position of the image
     * @param dly The destination (screen) y-axis position of the image
     * @param dsx The destination (screen) horizontal width of the image
     * @param dsy The destination (screen) vertical height of the image
     * @param slx The source (picture) x-axis cut position of the image
     * @param sly The source (picture) y-axis cut position of the image
     * @param ssx The source (picture) x-axis width slice of the image
     * @param ssy The source (picture) y-axis height slice of the image
     * @param dthis The Component to draw the image to
     */
    public void drawCutImg(Graphics2D g, Image img, int dlx, int dly, int dsx,
    		int dsy, int slx, int sly, int ssx, int ssy, Component dthis){
    	dlx = (dsx < 0) ? dlx-dsx : dlx;
    	dly = (dsy < 0) ? dly-dsy : dly;
    	g.drawImage(img, dlx, dly, dlx+dsx, dly+dsy, 
                slx, sly, slx+ssx, sly+ssy, dthis);
    }

    //-----------------
    //PRIVATE FUNCTIONS
    //-----------------

    /**
     * This function sets up all variables for an image
     *
     * @return An ImageHolder containing the image and variables
     */
    private ImgHolder storeImage(){
        ImgHolder heldImg = new ImgHolder();
        heldImg.origx = tempImg.image.getWidth(this);
        heldImg.origy = tempImg.image.getHeight(this);

        //This changes the pixel colors, and clears the HashMap
        if(!colorChanger.isEmpty() || !colorBlend.isEmpty() ||
                mirrorX || mirrorY || rotNine){
            tempImg.pixels = il.handlePixels(tempImg.image, 0, 0,
                heldImg.origx, heldImg.origy);

            tempImg.origx = heldImg.origx;
            tempImg.origy = heldImg.origy;
            if(!colorChanger.isEmpty()){
                tempImg.pixels = tempImg.setColorChange(colorChanger);
                colorChanger.clear();
            }
            if(!colorBlend.isEmpty()){
                tempImg.pixels = tempImg.setColorBlend(colorBlend, opacity);
                colorBlend.clear();
                opacity = 0.5;
            }
            if(mirrorX){
                tempImg.pixels = tempImg.setFlipX();
                mirrorX = false;
            }
            if(mirrorY){
                tempImg.pixels = tempImg.setFlipY();
                mirrorY = false;
            }
            if(rotNine){
                tempImg.pixels = tempImg.rotateClockwise();
                heldImg.origx = tempImg.origx;
                heldImg.origy = tempImg.origy;
                rotNine = false;
            }
            tempImg.image = createImage(new MemoryImageSource(heldImg.origx,
                    heldImg.origy, tempImg.pixels, 0, heldImg.origx));
        }
        if (sizex*sizey < 1){
            heldImg.image = tempImg.image;
            sizex = heldImg.origx;
            sizey = heldImg.origy;
        }else{
            if(sizex < 1) sizex = heldImg.origx;
            if(sizey < 1) sizey = heldImg.origy;
            heldImg.image = tempImg.image.getScaledInstance(
            sizex, sizey, imgscale);
        }

        il.loadImage(heldImg.image);
        heldImg.sizex = sizex;
        heldImg.sizey = sizey;

        sizex = 0;
        sizey = 0;
        return heldImg;
    }

    // -----------------
    // PixtureMap stuff
    // -----------------

    /**
     * This function creates the buffered image to be used with the grid
     * @param sizex The width of the buffered image
     * @param sizey The height of the buffered image
     */
     public void createImg(int sizex, int sizey){
         editSizeX = (sizex < 1) ? 1 : sizex;
         editSizeY = (sizey < 1) ? 1 : sizey;
         pimg = new BufferedImage(editSizeX, editSizeY,
                 BufferedImage.TYPE_INT_ARGB);
         g = pimg.createGraphics();
         clearGrid();
     }

    /**
     * Clears the grid
     */
    public void clearGrid(){
        editgrid = new int[editSizeX][editSizeY];
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                editgrid[i][j] = transparent.getRGB();
        }
    }

    /**
     * This function draws a picture to the grid and stores the picture
     * within the internal ImgLibrary. Use can use flip, color, and rotate
     * functions before this function.
     * @param img The image to be stored to the internal ImgLibrary
     * @param locx The pixel x-axis location of this image
     * @param locy The pixel y-axis location of this image
     */
    public void setImageToGrid(Image img, int locx, int locy){
        addImage(img);
        setImageToGrid(length(), locx, locy);
    }

    /**
     * This function draws a picture to the grid and stores the picture
     * within the internal ImgLibrary. Use can use flip, color, and rotate
     * functions before this function.
     * @param index The image contained within the internal ImgLibrary to use
     * @param locx The pixel x-axis location of this image
     * @param locy The pixel y-axis location of this image
     */
    public void setImageToGrid(int index, int locx, int locy){
        int[] tempGrid = new int[getPixels(index).length];
        System.arraycopy(getPixels(index), 0, tempGrid, 0, tempGrid.length);

        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++){
                if(((tempGrid[i+j*editSizeX] >> 24) & 0xff) < 200)
                    tempGrid[i+j*editSizeX] = transparent.getRGB();
                drawPermPixel(tempGrid[i+j*editSizeX],locx+i,locy+j);
            }
        }
    }

    /**
     * This function rotates the editing grid 90 degrees clockwise
     */
    public void rotateGrid(){
        int[] change = new int[editSizeX*editSizeY];
        for(int i = 0; i < editSizeY; i++){
            for(int j = 0; j < editSizeX; j++)
                change[i+(j*editSizeY)] = editgrid[i][j];
        }

        int temp = editSizeY;
        editSizeY = editSizeX;
        editSizeX = temp;
        copyArray(change);
    }

    /**
     * This function flips the editing grid along the x-axis
     */
    public void flipGridXAxis(){
        int[] change = new int[editSizeX*editSizeY];
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                change[(editSizeX-i-1)+(j*editSizeX)] = editgrid[i][j];
        }
        copyArray(change);
    }

    /**
     * This function is used to set the opacity of the editing grid images
     * @param number The opacity from (0-1)
     */
    public void setOpacity(double number){
        if(number >= 0 && number <= 1)
            editOpacity = (1-number);
    }

    /**
     * This function flips the editing grid along the y-axis
     */
    public void flipGridYAxis(){
        int[] change = new int[editSizeX*editSizeY];
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                change[i+((editSizeY-j-1)*editSizeX)] = editgrid[i][j];
        }
        copyArray(change);
    }

    /**
     * This function adds a colored box to the editing grid
     * @param theColor The color of the rectangle
     * @param sizex The width of the rectangle
     * @param sizey The height of the rectangle
     * @param locx The x-axis location in the editing grid
     * @param locy The y-axis location in the editing grid
     */
    public void addColorBoxToGrid(Color theColor,
            int sizex, int sizey, int locx, int locy){
        for(int i = 0; i < sizex; i++){
            for(int j = 0; j < sizey; j++)
                drawPermPixel(theColor.getRGB(),locx+i,locy+j);
        }
    }

    /**
     * This turns the editing grid into a image for display
     */
    public void mergeGridToImage(){
        if(pimg == null)
            createImg(editSizeX, editSizeY);

        if(editOpacity < 1)
            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER,
                (float)editOpacity));
        g.drawImage(createPixelMapImage(), 0, 0, this);
        if(editOpacity < 1)
            g.setComposite(AlphaComposite.SrcOver);
        clearGrid();
    }

    /**
     * This adds Java2D font text to an editing grid
     * @param text The String text to add to the editing grid
     * @param locx The x-axis location of the item in the editing grid
     * @param locy The y-axis location of the item in the editing grid
     * @param color The java2D color of the text
     */
    public void addTextToGridImage(String text, int locx, int locy, Color color){
        mergeGridToImage();
        if(editOpacity < 1)
            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER,
                (float)editOpacity));
        g.setColor(color);
        g.drawString(text, locx, locy);
        if(editOpacity < 1)
            g.setComposite(AlphaComposite.SrcOver);
    }

    /**
     * This function turns an editing grid into a java2D picture
     * @return An image representing the editing grid
     */
    public Image getGridImage(){
        mergeGridToImage();
        return pimg;
    }
    
    /**
     * This function creates an exact image enclosing the java2D font text
     * within it. Font is a default DIALOG font. Color is GRAY.
     * @param text The string to turn into an image
     * @return A java2D image representing the font text
     */
    public Image getTextPicture(String text){
        return getTextPicture(text, FONT, Color.GRAY);
    }
    
    /**
     * This function creates an exact image enclosing the java2D font text
     * within it. Color is GRAY.
     * @param text The string to turn into an image
     * @param font The font-type-size to use with this image
     * @return A java2D image representing the font text
     */
    public Image getTextPicture(String text, String font){
        return getTextPicture(text, font, Color.GRAY);
    }
    
    /**
     * This function creates an exact image enclosing the java2D font text
     * within it. Font is a default DIALOG font.
     * @param text The string to turn into an image
     * @param color The java.awt color to use with this font
     * @return A java2D image representing the font text
     */
    public Image getTextPicture(String text, Color color){
        return getTextPicture(text, FONT, color);
    }
    
    /**
     * This function creates an exact image enclosing the java2D font text
     * within it
     * @param text The string to turn into an image
     * @param font The font-type-size to use with this image
     * @param color The java.awt color to use with this font
     * @return A java2D image representing the font text
     */
    public Image getTextPicture(String text, String font, Color color){
        createImg(1,1);
        g.setFont(Font.decode(font));
        int width = g.getFontMetrics().stringWidth(text);
        int descent = g.getFontMetrics().getDescent();
        int height = g.getFontMetrics().getHeight()+descent;
        createImg(width, height);
        addTextToGridImage(text, 0, height-descent, color);
        return getGridImage();
    } 

    /**
     * This function moves pixels left/right
     * @param movePixel moves pixels [(+)to the right/(-)to the left]
     * @param row the Y-Row chosen
     */
    public void horizontalPixelMove(int movePixel, int row){
        moveColumnPixels(row, movePixel);
    }

    /**
     * This function moves pixels in all rows left/right
     * @param movePixel moves pixels [(+)to the right/(-)to the left]
     */
    public void horizontalPixelMove(int movePixel){
        for(int i = 0; i < editSizeY; i++)
            moveColumnPixels(i, movePixel);
    }

    /**
     * This function moves pixels left/right
     * @param movePixel moves pixels [(+)upwards/(-)downwards]
     * @param column the X-Column chosen
     */
    public void verticalPixelMove(int movePixel, int column){
        moveRowPixels(column, movePixel);
    }

    /**
     * This function moves pixels in all columns left/right
     * @param movePixel moves pixels [(+)upwards/(-)downwards]
     */
    public void verticalPixelMove(int movePixel){
        for(int i = 0; i < editSizeX; i++)
            moveRowPixels(i, movePixel);
    }

    /**
     * This function will save an image onto the computer that
     * matches the data within the PixtureMap.
     * @param prefix The picture name of the object
     * @param suffix The image format (jpg, bmp, gif, png are supported)
     */
    public void outSourceImage(String prefix, String suffix){
        if(suffix.matches(".*png") || suffix.matches(".*gif") ||
           suffix.matches(".*jpg") || suffix.matches(".*bmp")){
            //Hopefully, this draws the images correctly
            pimg = new BufferedImage(editSizeX, editSizeY,
                BufferedImage.TYPE_INT_ARGB);
            Graphics2D g2 = pimg.createGraphics();
            g2.drawImage(createPixelMapImage(), 0, 0, this);

            //This draws the image to a file
            File outputfile = new File(prefix+"."+suffix);
            try {
                ImageIO.write(pimg, suffix, outputfile);
            } catch (IOException ex) {
                System.err.println(ex);
            }
        }
    }

    /**
     * The most important function in the entire class. Makes
     * the mumble jumble of pixels into an image.
     * @return A pixtureMap completed image
     */
    private Image createPixelMapImage(){
        return createImage(new MemoryImageSource(editSizeX, editSizeY,
                getPixels(), 0, editSizeX));
    }

    /**
     * This function gets all the pixels within the editing grid
     * @return An array of editing grid pixels
     */
    private int[] getPixels(){
        int[] change = new int[editSizeX*editSizeY];
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                if(editgrid[i][j] != transparent.getRGB())
                    change[i+(j*editSizeY)] = editgrid[i][j];
        }
        return change;
    }

    /**
     * This function stores the pixel input into the editing grid
     * @param change The pixels to input into the image
     */
    private void copyArray(int[] change){
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                 editgrid[i][j] = change[i+(j*editSizeY)];
        }
    }

    /**
     * This private function fills in all the necessary variables to
     * create a transparent PixtureMap.
     * @param colorInRGB The color to be inserted
     * @param locx The x-axis position
     * @param locy The y-axis position
     */
    private void drawPermPixel(int colorInRGB, int locx, int locy){
        if(locx >= 0 && locx < editSizeX){
            if(locy >= 0 && locy < editSizeY){
                if(colorInRGB != transparent.getRGB())
                    editgrid[locx][locy] = colorInRGB;
            }
        }
    }

    /**
     * This private function can move a column of pixels to the
     * right/left according to the number chosen
     * @param column The x-axis column chosen
     * @param movePixels number of pixels to move the y-axis row
     */
    private void moveRowPixels(int column, int movePixels){
        if(column >= editSizeX || column < 0)
            return;

        int[] temp = new int[editSizeY];
        int cool = 0;

        for(int i = 0; i < editSizeY; i++){
            cool = i + movePixels;

            if(cool >= editSizeY)
                temp[i] = editgrid[column][cool-editSizeY];
            else if(cool < 0)
                temp[i] = editgrid[column][cool+editSizeY];
            else
                temp[i] = editgrid[column][cool];
        }
        System.arraycopy(temp, 0, editgrid[column], 0, editSizeY);
    }

    /**
     * This private function can move a row of pixels to the
     * right/left according to the number chosen
     * @param row The y-axis row chosen
     * @param movePixels number of pixels to move the x-axis column
     */
    private void moveColumnPixels(int row, int movePixels){
        if(row >= editSizeY || row < 0)
            return;

        int[] temp = new int[editSizeX];
        int cool = 0;

        for(int i = 0; i < editSizeX; i++){
            cool = i + movePixels;

            if(cool >= editSizeX)
                temp[i] = editgrid[cool-editSizeX][row];
            else if(cool < 0)
                temp[i] = editgrid[cool+editSizeX][row];
            else
                temp[i] = editgrid[cool][row];
        }

        for(int i = 0; i < editSizeX; i++)
            editgrid[i][row] = temp[i];
    }

    // ----------------------
    // TextImgLibrary Stuff
    // ----------------------

    // ------
    // ADDERS
    // ------

    /**
     * This adds textual split information for a specific image
     * @param index  Which image this refers to
     * @param slicex The number of horizontal slices to give an image
     * @param slicey The number of vertical slices to give an image
     * @param start Where in the grid to start from left-to-right up-to-down
     * @param chart A string containing the characters for the image
     */
    public void addTextInfo(int index, int slicex, int slicey, 
    		                int start, String chart) {
    	addTextInfo(index, 0, 0, 0, 0, slicex, slicey, start, chart);
    }
    
    /**
     * This adds textual split information for a specific image
     * @param index  Which image this refers to
     * @param posx The x-axis location where you want the slices to start
     * @param posy The y-axis location where you want the slices to start
     * @param sizex The x-axis total length of all slices
     * @param sizey The y-axis total length of all slices
     * @param slicex The number of horizontal slices to give an image
     * @param slicey The number of vertical slices to give an image
     * @param start Where in the grid to start from left-to-right up-to-down
     * @param chart A string containing the characters for the image
     */
    public void addTextInfo(int index, int posx, int posy, int sizex,
    		int sizey, int slicex, int slicey, int start, String chart) {
    	String[] temp = new String[] {""+posx, ""+posy, ""+sizex, ""+sizey,
    			""+slicex, ""+slicey, ""+start, chart};
    	textInfo.put(index, temp);
    }
    
    /**
     * This addTextImage helper function gets a letter string using the limit 
     * provided
     * @param index The index of the image (or negative for a Font) 
     * @param str The string to print out
     * @param row Used to target a specific row (negative for all)
     * @param limit In pixels, used to control how it spaces words 
     *             (negative for letters, positive for words)
     */
    public void addLetterImage(int index, String str, int limit) {
    	addTextImage(index, str, -1, -limit);
    }
    
    /**
     * This addTextImage helper function gets a paragraph using the limit 
     * provided
     * @param index The index of the image (or negative for a Font) 
     * @param str The string to print out
     * @param limit The limit in pixels a word string can travel in the 
     *              x-axis before next line
     */
    public void addParagraphImage(int index, String str, int limit) {
    	addTextImage(index, str, -1, limit);
    }
    
    /**
     * This addTextImage helper function helps get pieces of words out of 
     * a paragraph
     * @param index The index of the image (or negative for a Font) 
     * @param str The string to print out
     * @param row Used to target a specific row (negative for all)
     * @param limit The limit in pixels a word string can travel in the 
     *              x-axis before next line
     */
    public void addWordImage(int index, String str, int row, int limit) {
    	addTextImage(index, str, row, limit);
    }
    
    /**
     * This addTextImage helper function helps get pieces of words out of 
     * a line of words
     * @param index The index of the image (or negative for a Font) 
     * @param str The string to print out
     * @param row Used to target a specific row (negative for all)
     * @param limit The limit in pixels a string can travel in the 
     *               x-axis before next line
     */
    public void addTextLineImage(int index, String str, int row, int limit) {
    	addTextImage(index, str, row, -limit);
    }
    
    /**
     * This function is used to add a textInfo curated text image to the
     * Image Library
     * @param index The index of the image (or negative for a Font) 
     * @param str The string to print out
     * @param row Used to target a specific row (negative for all)
     * @param limit In pixels, used to control how it spaces words 
     *              (negative for letters, positive for words)
     */
    public void addTextImage(int index, String str) {
    	addTextImage(index, str, -1, 0);
    }
    
    // -------
    // GETTERS
    // -------
    
    /**
     * A function for getting the length and width of a text string. Will need
     * a bit more functionality for newlines
     * @param index The ImgLibrary index of the image
     * @param str The string to get the dimensions of
     * @return An array representing the width and length of a string [x, y]
     */
    public int[] getTextDim(int index, String str) {
    	int[] dim = getLetterDim(index);
    	
    	int drop = str.length();
    	int max = 0;
    	for(int i = 0; i < str.length(); i++){
    		if(str.charAt(i) == '\n') {
    			drop += 1;
    			if(i - max >= max)
    				max = i-max;
    		}
    	}
    	if(max == 0)
    		max = str.length();
    	
    	return new int[] {dim[0]*max, (dim[1]+1)*drop};
    }
    
    /**
     *  A function for getting the length and width of a letter in a textMap
     * @param index The ImgLibrary index of the image
     * @return An array representing the width and length of a letter [x, y]
     */
    public int[] getLetterDim(int index) {
    	
    	// If the index doesn't exist, return a fake dimension
    	if (index < 0) 
    		return new int[] {0, 0};
    	
    	// Get the relevant text array
    	String[] tmpInfo = textInfo.get(index);
    	
    	if (tmpInfo == null)
    		return new int[] {0, 0};
    	
    	int[] intInfo = new int[6];
    	
    	for(int i = 0; i < intInfo.length; i++)
    		intInfo[i] = Integer.valueOf(tmpInfo[i]);
    	
    	// Let's then get the size of the letter in the array
    	int tmpsx = (intInfo[2] < 1) ? getX(index) : intInfo[2];
    	int tmpsy = (intInfo[3] < 1) ? getY(index) : intInfo[3];
    	int tmpslx = (intInfo[4] < 1) ? 1 : intInfo[4];
    	int tmpsly = (intInfo[5] < 1) ? 1 : intInfo[5];

    	// Let's get the length and width of a letter first
    	int letsx = ((tmpsx/tmpslx) > 0) ? tmpsx/tmpslx : tmpsx;
    	int letsy = ((tmpsy/tmpsly) > 0) ? tmpsy/tmpsly : tmpsy;

    	System.out.println("Letter Dimensions: ("+letsx+","+letsy+")");
    	
    	return new int[] {letsx, letsy};
    }
    
    // -------
    // PRIVATE
    // -------
    
    /**
     * This function is used to add a textInfo curated text image to the
     * Image Library
     * @param index The index of the image (or negative for a Font) 
     * @param str The string to print out
     * @param row Used to target a specific row (negative for all)
     * @param limit In pixels, used to control how it spaces words (negative for letters, positive for words)
     */
    private void addTextImage(int index, String str, int row, int limit) {
    	
    	// Make sure you setup the image before trying to do text
    	if(index < 0 || textInfo.get(index) == null) {
    		addImage(getTextPicture(str));
    		if(index >= 0)
    			System.out.println("addTextImage: Image Text Information Is Not Set");
    		return;
    	}
    	
    	// Everything is the canvas way here
    	int[] textdim = getTextDim(index, str);
    	str = normalizeStr(index, str, row, limit);
    	
    	// Out with the old and in with the new
    	createImg(1,1);
        createImg(textdim[0], textdim[1]);
        
        // Get the relevant text array
    	String[] tmpInfo = textInfo.get(index);
    	int drop = 0;
    	int back = 0;
    	
    	int[] intInfo = new int[7];
    	
    	for(int i = 0; i < intInfo.length; i++)
    		intInfo[i] = Integer.valueOf(tmpInfo[i]);
    	
    	for(int i = 0; i < str.length(); i++) {
    		
    		String chart = tmpInfo[7];
    		
    		// If we have an enter, time for manipulation
    		if(str.charAt(i) == '\n') {
    			drop += 1;
    			back = i+1;
    			continue;
    		}
    		
    		int tmplps = chart.indexOf(str.charAt(i));
    		
    		if(tmplps >= 0) {
    			
    			// Let's then get the size of the letter in the array
    			int tmppx = intInfo[0];
    	 		int tmppy = intInfo[1];
    	    	int tmpsx = (intInfo[2] < 1) ? getX(index)-tmppx : intInfo[2];
    	    	int tmpsy = (intInfo[3] < 1) ? getY(index)-tmppy : intInfo[3];
    	    	int tmpslx = (intInfo[4] < 1) ? 1 : intInfo[4];
    	    	int tmpsly = (intInfo[5] < 1) ? 1 : intInfo[5];

    	    	// Let's get the length and width of a letter first
    	    	int letsx = ((tmpsx/tmpslx) > 0) ? tmpsx/tmpslx : tmpsx;
    	    	int letsy = ((tmpsy/tmpsly) > 0) ? tmpsy/tmpsly : tmpsy;
    	    	
    	    	int posx = tmplps % tmpslx;
    	 		int posy = (int)Math.floor(tmplps / tmpslx);
    	 		
    	 		System.out.println("Canvas - Letter: "+str.charAt(i)+" ("+posx+","+posy+")");
    	 		placeCutImg(g, getImage(index), tmppx+((i-back)*letsx), tmppy+(drop*(letsy+1)), posx*letsx, posy*letsy, letsx, letsy, this);
    		}
    	}
    	addImage(pimg);
    }
    
    private String normalizeStr(int index, String str, int row, int limit) {
    	
    	int[] letdim = getLetterDim(index);
    	String newstr = new String();

    	// Makes sure our Letters actually have dimensions
    	if(letdim[0] > 0 && letdim[1] > 0){
    		
    		// Sets to word mode if you write a positive limit
    		boolean wordmode = (limit > 0);
    		
    		// Make sure limit is always valid
    		if(limit <= 0)
    			limit = (limit < 0) ? -limit : str.length()*letdim[0];

    		int max = 0;

    		// This curates a string for Word mode
    		if(wordmode) {
    			int tracker = -1;
    			String word = new String();
    			for(int i = 0; i < str.length(); i++){
        			max += 1;
        			word += str.charAt(i);
        			if(str.charAt(i) == ' ' || str.charAt(i) == '-') {
        				tracker = i;
        				newstr += word;
        				word = "";
        			}
        			if(str.charAt(i) == '\n' || max*letdim[0] > limit){
        				if(tracker >= 0 ) {
        					if(str.charAt(i) != '\n')
            					newstr += '\n';
        					newstr += word;
        					max = word.length();
            				word = "";
        				}else {
        					newstr += word;
        					word = "";
        					max = 0;
            				if(str.charAt(i) != '\n') {
            					if(i+1 < str.length()) {
            						if(str.charAt(i+1) == '\n')
            							continue;
            					}
            					newstr += '\n';
            				}
        				}
        			}
        		}
    			if(word.length() > 0)
    				newstr += word;
    		}
    		// This curates a string for Letter Mode
    		else {
    			for(int i = 0; i < str.length(); i++){
        			max += 1;
        			newstr += str.charAt(i);
        			if(str.charAt(i) == '\n' || max*letdim[0] > limit){
        				max = 0;
        				if(str.charAt(i) != '\n') {
        					if(i+1 < str.length()) {
        						if(str.charAt(i+1) == '\n')
        							continue;
        					}
        					newstr += '\n';
        				}
        			}
        		}
    		}
    		
    		// If we have a row, the string is now that row (or blank)
    		if(row >= 0) {
    			String[] strArr = newstr.split("\n");
    			newstr = (row < strArr.length) ? strArr[row].trim() : "";
    		}
    	}   	
    	return newstr;
    }
}
