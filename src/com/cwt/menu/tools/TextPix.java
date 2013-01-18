package com.cwt.menu.tools;

import com.jslix.image.ImgLibrary;
import com.jslix.image.TextImgLibrary;

import java.awt.Color;
import java.awt.Image;

/**
 * TextPix.java
 *
 * This class was made to down size the amount of times I have to
 * make a whole new library in order to store and draw text pictures.
 * It also contains tools for cutting images.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.31.11
 */
public class TextPix {

    /** The path to the alphabet text */
    private static String txtPath;
    /** The path to the number text */
    private static String numPath;

    /**
     * This function sets the path to the text
     * @param path The path to the alphabet text
     */
    public static void setTextPath(String path){
        txtPath = path;
    }

    /**
     * This function sets the path to the numbers
     * @param path The path to the number picture
     */
    public static void setNumPath(String path){
        numPath = path;
    }

    /**
     * This function turns a String into a picture
     * @param text The text to convert into a picture
     * @return An image representing the text
     */
    public static Image getTextImg(String text){
        return getTextImg(text, null, null);
    }

    /**
     * This function turns a String into a picture
     * @param text The text to convert into a picture
     * @param fromColor A list of default colors
     * @param toColor A list of re-color values
     * @return An image representing the text
     */
    public static Image getTextImg(String text,
            Color[] fromColor, Color[] toColor){
        TextImgLibrary txtLib = new TextImgLibrary();
        txtLib.addImage(txtPath);
        txtLib.addImage(numPath);
        txtLib.addAllCapitalLetters(txtLib.getImage(0), "", 6, 5, 0);
        txtLib.addLetter('-', txtLib.getImage(0), "", 6, 5, 29);
        txtLib.addLetter('\'', txtLib.getImage(0), "", 6, 5, 28);
        txtLib.addLetter(',', txtLib.getImage(0), "", 6, 5, 27);
        txtLib.addLetter('.', txtLib.getImage(0), "", 6, 5, 26);

        txtLib.addAllNumbers(txtLib.getImage(1), "", 10, 1, 0);
        txtLib.setString(text, "", 0, 0, 0, 0);
        if(fromColor != null && toColor != null){
            for(int j = 0; j < fromColor.length; j++)
                txtLib.setPixelChange(fromColor[j], toColor[j]);
        }
        txtLib.addImage(text, txtLib.getTextImage());
        return txtLib.getImage(text);
    }

    /**
     * This function takes an image an cuts it into a smaller image
     * @param imgPath The String path to the image
     * @param lx The x-axis pixel position in the image to start the cut
     * @param ly The y-axis pixel position in the image to start the cut
     * @param sx The width of the cut in pixels
     * @param sy The height of the cut in pixels
     * @return An image with the specified dimensions
     */
    public static Image getCutImage(String imgPath,
            int lx, int ly, int sx, int sy){
        ImgLibrary tempImg = new ImgLibrary();
        tempImg.addImage(imgPath);
        return tempImg.getImage(0, lx, ly, sx, sy);
    }

    /**
     * This function gets the pixels of an image
     * @param imgPath The path to the image
     */
    public static int[] getImgPixels(String imgPath){
        ImgLibrary tempImg = new ImgLibrary();
        tempImg.addImage(imgPath);
        return tempImg.getPixels(0);
    }
}
