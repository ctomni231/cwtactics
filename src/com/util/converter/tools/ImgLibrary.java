package com.util.converter.tools;

import java.awt.Component;
import java.awt.Image;
import java.awt.image.MemoryImageSource;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * ImgLibrary.java
 *
 * A remix of ImageSorter, ImgLibrary helps with organizing and sectioning
 * images. It performs recolors, resizes images, stores images, and sets
 * optional references for images.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.03.11
 */

public class ImgLibrary extends Component{
    
    //Helps with loading images
    protected ImgLoader il;
    //Helps store a list of images by index
    private ImgHolder[] sortedImg;
    //Helps turn that list into a String reference
    private HashMap<String, Integer> hashImg;
    //Holds values so you can change colors within images
    private HashMap<Integer, Integer> colorChanger;
    //Holds values that will be blended into image
    private ArrayList<Integer> colorBlend;
    //Used to set the width for an image
    private int sizex;
    //Used to set the height for an image
    private int sizey;
    //Used to set the blend opacity
    private double opacity;
    //Lets the user choose whether to store a filename image
    private boolean storeFileRef;
    //Lets the user quickly flip this image horizontally
    private boolean mirrorX;
    //Lets the user quickly flip this image vertically
    private boolean mirrorY;
    //Lets the user rotate this image clockwise 90 degrees
    private boolean rotNine;
    //A temporary item to help store images
    private ImgHolder tempImg;

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
     * This function will blend the color chosen into every pixel
     * within the image. The opacity controls how deep the blend
     * will be in the picture. This action occurs only in the next
     * loaded image. The colors are reset after an image is added.
     * More than one color can be blended with multiple calls to this
     * function.
     *
     * @param blendColor The color to blend in
     */
    public void setPixelBlend(java.awt.Color blendColor){
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
    public void setPixelBlend(java.awt.Color blendColor, double opacity){
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
    public void setPixelIgnore(java.awt.Color ignoreColor){
        if(ignoreColor != null)  colorBlend.add(ignoreColor.getRGB());
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
    public Image getColorBox(java.awt.Color theColor, int sizex, int sizey){
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
            sortedImg[index].image : getColorBox(java.awt.Color.RED,1,1);
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
            sizex, sizey, Image.SCALE_AREA_AVERAGING);
        }

        il.loadImage(heldImg.image);
        heldImg.sizex = sizex;
        heldImg.sizey = sizey;

        sizex = 0;
        sizey = 0;
        return heldImg;
    }
}