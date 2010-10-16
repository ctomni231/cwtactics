package com.jslix.tools;

import java.awt.Component;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.ImageObserver;
import java.awt.image.MemoryImageSource;
import java.awt.image.PixelGrabber;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import javax.imageio.ImageIO;
import org.newdawn.slick.Color;
import org.newdawn.slick.SlickException;

/**
 * ImgLibrary.java
 *
 * A remix of ImageSorter, ImgLibrary helps with organizing and sectioning
 * images. It performs recolors, resizes images, stores images, and sets
 * optional references for images.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.24.10
 */

//TODO: Finish commenting this class
public class ImgLibrary extends Component{
    //Sets the default for Slick Images
    private final String IMAGE_TYPE = "png";
    //Helps with loading images
    private ImgLoader il;
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

    //Initializes all variables
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

    //SETTERS
    //Sets the image size for this image. A variable less than one
    //uses the original size for the width and/or height
    public void setImageSize(int x, int y) {
       sizex = x;
       sizey = y;
    }

    //Sets this image to flip horizontally
    public void setFlipX(){
        mirrorX = true;
    }

    //Sets this image to flip vertically
    public void setFlipY(){
        mirrorY = true;
    }
    
    //Sets this image to rotate ninety
    public void setRotateNinety(){
        rotNine = true;
    }

    //Whether to store a file reference with this image: default true
    public void setReference(boolean store){
        storeFileRef = store;
    }

    //Changes pixels using a slick.Color
    public void setPixelChange(Color fromThisColor, Color toThisColor){
        setPixelChange(getColor(fromThisColor), getColor(toThisColor));
    }

    //Changes pixels using java.awt.Color
    public void setPixelChange(java.awt.Color fromThisColor,
            java.awt.Color toThisColor){
        if(toThisColor != null && fromThisColor != null)
            colorChanger.put(fromThisColor.getRGB(), toThisColor.getRGB());
    }
    //Blends pixels using java.awt.Color
    public void setPixelBlend(java.awt.Color blendColor){
        setPixelBlend(blendColor, 0.5);
    }
    //Blends pixels using java.awt.Color
    public void setPixelBlend(java.awt.Color blendColor, double opacity){
        if(blendColor != null)  colorBlend.add(0, blendColor.getRGB());
        if(opacity >= 0 && opacity <= 1)  this.opacity = opacity;
    }
    //Sets what pixels to ignore while you are blending
    public void setPixelIgnore(java.awt.Color ignoreColor){
        if(ignoreColor != null)  colorBlend.add(ignoreColor.getRGB());
    }

    //ADDERS
    //Adds a new image to this Library
    public boolean addImage(String filename){
        return addImage(-1, filename, null);
    }
    public boolean addImage(int index, String filename){
        return addImage(index, filename, null);
    }
    public boolean addImage(Image desImg){
        return addImage(-1, "", desImg);
    }
    public boolean addImage(int index, Image desImg){
        return addImage(index, "", desImg);
    }
    public boolean addImage(String imgRef, Image desImg){
        return addImage(-1, imgRef, desImg);
    }
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
        if(!filename.matches("") && storeFileRef){
            if(index == -1)
                hashImg.put(filename, sortedImg.length);
            else
                hashImg.put(filename, index);
        }
        storeFileRef = true;
        //Either makes a new image or overwrites and older one.
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
    //Adds references to images
    public boolean addReference(String imgName, String storedImg){
        return hashImg.containsKey(storedImg) ?
            addReference(imgName, hashImg.get(storedImg)) : false;
    }
    public boolean addReference(String imgName, int index){
        if(!imgName.matches("") && index >= 0 && index < sortedImg.length){
            hashImg.put(imgName, index);
            return true;
        }
        return false;
    }

    //GETTERS
    //This is used to keep images from becoming null.
    public org.newdawn.slick.Image getColorBox(Color newColor,
            String boxName, int sizex, int sizey){
        return makeSlickImage(getColorBox(getColor(newColor),
                sizex, sizey), boxName);
    }
    public Image getColorBox(java.awt.Color theColor, int sizex, int sizey){
        if(sizex < 1) sizex = 100;
        if(sizey < 1) sizey = 100;
        int[] colorbox = new int[sizex*sizey];
        for(int i = 0; i < colorbox.length; i++)
            colorbox[i] = theColor.getRGB();
        return createImage(new MemoryImageSource(sizex, sizey, colorbox,
                0, sizex));
    }

    //Gets an image or a cut image
    public Image getImage(String ref){
        return getImage(getIndex(ref));
    }
    public Image getImage(int index){
        return index >= 0 && index < sortedImg.length ?
            sortedImg[index].image : getColorBox(java.awt.Color.RED,1,1);
    }
    public Image getImage(int index, int cutlx, int cutly,
            int cutsx, int cutsy){
        return cutImage(getImage(index), cutlx, cutly, cutsx, cutsy);
    }

    public int[] getPixels(String ref){
        return getPixels(getIndex(ref));
    }
    public int[] getPixels(int index){
        int[] temp = (index >= 0 && index < sortedImg.length) ?
            sortedImg[index].pixels : new int[0];
        if(index >= 0 && index < sortedImg.length && temp == null){
            ImgHolder heldImg = sortedImg[index];
            heldImg.pixels = handlePixels(heldImg.image,
                    0, 0, heldImg.sizex, heldImg.sizey);
            sortedImg[index] = heldImg;
            temp = heldImg.pixels;
        }
        return temp;
    }
    //Gets a Slick img from the library: Stores the image... fast!
    public org.newdawn.slick.Image getSlickImage(String ref){
        return getSlickImage(getIndex(ref));
    }
    public org.newdawn.slick.Image getSlickImage(int index){
        org.newdawn.slick.Image temp = (index >= 0 && index <
                sortedImg.length) ? sortedImg[index].sImage : null;
        if(index >= 0 && index < sortedImg.length && temp == null){
            temp = makeSlickImage(getImage(index), 
                    sortedImg[index].toString());
            ImgHolder heldImg = sortedImg[index];
            heldImg.sImage = temp;
            //Causes reference problems
            //heldImg.image = null;
            sortedImg[index] = heldImg;
        }
        return (temp != null) ? temp : makeSlickImage(getColorBox(
            java.awt.Color.RED,1,1), "EMPTY");
    }

    //Gets the original and altered sizes of the image
    public int getOrigX(String ref){
        return getOrigX(getIndex(ref));
    }
    public int getOrigX(int index){
        return index >= 0 && index < sortedImg.length ?
            sortedImg[index].origx : 0;
    }
    public int getOrigY(String ref){
        return getOrigY(getIndex(ref));
    }
    public int getOrigY(int index){
        return index >= 0 && index < sortedImg.length ?
            sortedImg[index].origy : 0;
    }
    public int getX(String ref){
        return getX(getIndex(ref));
    }
    public int getX(int index){
        return index >= 0 && index < sortedImg.length ?
            sortedImg[index].sizex : 0;
    }
    public int getY(String ref){
        return getY(getIndex(ref));
    }
    public int getY(int index){
        return index >= 0 && index < sortedImg.length ?
            sortedImg[index].sizey : 0;
    }

    //Gets an index from a reference stored here
    public int getIndex(String ref){
        return hashImg.containsKey(ref) ? hashImg.get(ref): -1;
    }

    //Makes a Slick Image from this Library: does not store it... slow!
    public org.newdawn.slick.Image makeSlickImage(Image image,
            String ref){
        org.newdawn.slick.Image temp = null;
        if(image != null){
            BufferedImage bimg = new BufferedImage(image.getWidth(this),
                    image.getHeight(this), BufferedImage.TYPE_INT_ARGB);
            Graphics2D g2 = bimg.createGraphics();
            g2.drawImage(image, 0, 0, this);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            try {
                ImageIO.write(bimg, IMAGE_TYPE, out);
                temp = new org.newdawn.slick.Image(
                        convertOutput(out), ref, false);
            } catch (SlickException ex) {
                System.err.println(ex);
            } catch (IOException ex) {
                System.err.println(ex);
            }
        }
        return temp;
    }

    public int length(){
        return sortedImg.length;
    }
    public int hashSize(){
        return hashImg.size();
    }
    public java.awt.Color getColor(Color color){
        return new java.awt.Color(color.getRed(), color.getGreen(),
                color.getBlue(), color.getAlpha());
    }
    public java.awt.Color getColor(java.awt.Color color, int alpha){
        return (alpha < 0 || alpha > 255) ? color :
            new java.awt.Color(color.getRed(), color.getGreen(),
            color.getBlue(), alpha);
    }
    public Color getColor(java.awt.Color color){
        return new Color(color.getRed(), color.getGreen(),
                color.getBlue(), color.getAlpha());
    }
    public Color getColor(Color color, int alpha){
        return (alpha < 0 || alpha > 255) ? color :
            new Color(color.getRed(), color.getGreen(),
            color.getBlue(), alpha);
    }

    //PRIVATE FUNCTIONS
    private ImgHolder storeImage(){
        ImgHolder heldImg = new ImgHolder();
        heldImg.origx = tempImg.image.getWidth(this);
        heldImg.origy = tempImg.image.getHeight(this);

        //This changes the pixel colors, and clears the HashMap
        if(!colorChanger.isEmpty() || !colorBlend.isEmpty() ||
                mirrorX || mirrorY || rotNine){
            tempImg.pixels = handlePixels(tempImg.image, 0, 0,
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

    //Changes an image into an array of pixel integers
    //x = start posx: y = start posy: w = width: h = height
    private int[] handlePixels(Image img, int x, int y, int w, int h) {
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

    //Changes an inputStream to an outPutStream
    private InputStream convertOutput(ByteArrayOutputStream out)
            throws IOException{
        return new ByteArrayInputStream(out.toByteArray());
    }

    //Uses javaAPI to cut an image
    private Image cutImage(Image image, int locx, int locy,
            int sizex, int sizey){
        BufferedImage bimg = new BufferedImage(
                sizex, sizey, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = bimg.createGraphics();
        g2.drawImage(image, 0, 0, sizex, sizey,
                locx, locy, locx+sizex, locy+sizey, this);
        return bimg;
    }
}