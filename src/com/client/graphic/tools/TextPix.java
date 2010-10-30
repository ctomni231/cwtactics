package com.client.graphic.tools;

import com.jslix.tools.TextImgLibrary;
import java.awt.Color;
import java.awt.Image;

/**
 * TextPix.java
 *
 * This class was made to down size the amount of times I have to
 * make a whole new library in order to store and draw text pictures.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.29.10
 */
public class TextPix {

    private static String txtPath;//The path to the alphabet text
    private static String numPath;//The path to the number text

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
     * @param toColor A list of recolor values
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
}
