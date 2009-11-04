package com.client.tools;

import java.util.HashMap;
import org.newdawn.slick.Image;

/**
 * ImgHolder
 * A remix of ImageHolder. The ImgHolder helps store images in an
 * ImageLibrary.
 *
 * @author Crecen
 */
public class ImgHolder {
    //Stores a Java Image
    public java.awt.Image image;
    //Stores a Slick Image
    public Image sImage;
    //Stores a pixel representation of an image
    public int[] pixels;
    //Stores the current width of this image
    public int sizex;
    //Stores the current height of this image
    public int sizey;
    //Stores the original width of this image (when loaded)
    public int origx;
    //Stores the original height of this image (when loaded)
    public int origy;

    //Init
    ImgHolder(){
        image = null;
        sImage = null;
        pixels = null;
        sizex = 1;
        sizey = 1;
        origx = 1;
        origy = 1;
    }

    //Indexes pixel changes in a HashMap<fromThisColor, toThisColor>
    public int[] setColorChange(HashMap<Integer, Integer> colorChange){
        int[] change = pixels;
        for(int i = 0; i < change.length; i++){
            if(colorChange.containsKey(change[i]))
                change[i] = colorChange.get(change[i]);
        }
        return change;
    }

    //Flips pixels along the x-axis (horizontal flip)
    public int[] setFlipX(){
        int[] change = pixels;
        for(int i = 0; i < origx; i++){
            for(int j = 0; j < origy; j++)
                change[(origx-i-1)+(j*origx)] = pixels[i+j*origx];
        }
        return change;
    }

    //Flips pixels along the y-axis (vertical flip)
    public int[] setFlipY(){
        int[] change = pixels;
        for(int i = 0; i < origx; i++)
            for(int j = 0; j < origx; j++)
                change[i+((origy-j-1)*origx)] = pixels[i+j*origx];
        return change;
    }

    //Rotates an image 90 degrees clockwise
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
