package com.jslix.image;

import java.awt.Color;
import java.util.ArrayList;
import java.util.HashMap;
import org.newdawn.slick.Image;

/**
 * ImgHolder.java
 *
 * A remix of ImageHolder. The ImgHolder helps store images in an
 * ImageLibrary.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.21.10
 */

public class ImgHolder {
    /** Stores a Java Image */
    public java.awt.Image image;
    /** Stores a Slick Image */
    public Image sImage;
    /** Stores a pixel representation of an image */
    public int[] pixels;
    /** Stores the current width of this image */
    public int sizex;
    /** Stores the current height of this image */
    public int sizey;
    /** Stores the original width of this image (when loaded) */
    public int origx;
    /** Stores the original height of this image (when loaded) */
    public int origy;

    /**
     * This class holds one image and the image information of an image
     * library class (ImgLibrary). This function initializes all variables
     * to default values.
     */
    ImgHolder(){
        image = null;
        sImage = null;
        pixels = null;
        sizex = 1;
        sizey = 1;
        origx = 1;
        origy = 1;
    }

    /**
     * This function indexes all pixel changes in a HashMap<fromThisColor,
     * toThisColor> and uses them to change the colors of pixels
     * representing an image.
     * @param colorChange The HashMap of default colors and changes
     * @return An array list of altered pixels
     */
    public int[] setColorChange(HashMap<Integer, Integer> colorChange){
        int[] change = pixels;
        for(int i = 0; i < change.length; i++){
            if(colorChange.containsKey(change[i]))
                change[i] = colorChange.get(change[i]);
        }
        return change;
    }

    /**
     * This function takes the first member of a list of colors and
     * blends it into the pixels. THe rest of the list is used to prevent
     * default colors from being blended. The amount of blending is determined
     * by the amount of opacity (0-1) you decide.
     * @param colorBlend The color blend and the list of colors to ignore
     * @param opacity The intensity of the blend from 0.0 - 1.0
     * @return An array list of altered pixels
     */
    public int[] setColorBlend(ArrayList<Integer> colorBlend, double opacity){
        int[] change = pixels;
        int blend = colorBlend.remove(0);
        int red, green, blue, alpha;
        for(int i = 0; i < change.length; i++){
            if(colorBlend.contains(change[i]))   continue;
            alpha = (change[i] >> 24) & 0xff;
            red = (change[i] >> 16) & 0xff;
            green = (change[i] >> 8) & 0xff;
            blue = (change[i]) & 0xff;
            red += (((blend >> 16) & 0xff)-
                    ((change[i] >> 16) & 0xff))*opacity;
            green += (((blend >> 8) & 0xff)-
                    ((change[i] >>  8) & 0xff))*opacity;
            blue += (((blend) & 0xff)-((change[i]) & 0xff))*opacity;
            change[i] = new Color(red, green, blue, alpha).getRGB();
        }
        return change;
    }

    /**
     * This function performs a x-axis horizontal flip to the pixels
     * @return An array list of altered pixels
     */
    public int[] setFlipX(){
        int[] change = new int[pixels.length];
        for(int i = 0; i < origx; i++){
            for(int j = 0; j < origy; j++)
                change[(origx-i-1)+(j*origx)] = pixels[i+j*origx];
        }
        return change;
    }

    /**
     * This function performs a y-axis vertical flip to the pixels
     * @return An array list of altered pixels
     */
    public int[] setFlipY(){
        int[] change = new int[pixels.length];
        for(int i = 0; i < origx; i++){
            for(int j = 0; j < origy; j++)
                change[i+((origy-j-1)*origx)] = pixels[i+j*origx];
        }
        return change;
    }

    /**
     * This function performs a 90 degree rotation to the pixels
     * @return An array list of altered pixels
     */
    public int[] rotateClockwise(){
        int[] change = new int[pixels.length];
        for(int i = 0; i < origy; i++){
            for(int j = 0; j < origx; j++)
                change[i+(j*origy)] = pixels[j+i*origx];
        }

        int temp = origy;
        origy = origx;
        origx = temp;

        return change;
    }
}
