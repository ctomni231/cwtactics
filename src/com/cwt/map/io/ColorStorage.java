package com.cwt.map.io;

import java.awt.Color;
import java.util.HashMap;
import static com.yasl.logging.Logging.*;

/**
 * ColorStorage.java
 *
 * This class stores data for the default color portion of the XML file.
 * The CWT graphic mainframe depends on this class to organize the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.15.11
 */
public class ColorStorage {

    /** Holds the default value for the colors */
    public final int BASE = 255;
    /** Holds the Hexadecimal reference value */
    public final byte HEX = 0;
    /** Holds the Red reference value */
    public final byte RED = 1;
    /** Holds the Green reference value */
    public final byte GREEN = 2;
    /** Holds the Blue reference value */
    public final byte BLUE = 3;
    /** Holds the Alpha reference value */
    public final byte ALPHA = 4;
    /** Holds the end reference value */
    public final byte END = 5;

    /** Stores references for the file items */
    private RefStore refItems;
    /** Stores the color items */
    private DataStore colorItems;
    /** Stores the temporary numbers for the values */
    private KeyStore tempKey;
    /** Stores whether reference should be stored */
    private boolean colorStore;

    /**
     * This class holds and organizes the default colors for the map
     * objects. Each object is binded to a specific default color list
     * if it exists.
     */
    public ColorStorage(){
        colorItems = new DataStore();
        refItems = new RefStore();
        refItems.add("HEX.*", HEX);
        refItems.add("R.*", RED);
        refItems.add("G.*", GREEN);
        refItems.add("B.*", BLUE);
        refItems.add("A.*", ALPHA);
        refItems.add(new String[]{"S.*","END"}, END);
        colorStore = false;
    }
    
    /**
     * This function creates a new layer to add for default colors. It'll
     * only add a new layer if the colors are different than the previous
     * colors.
     * @return The layer index where the default colors are stored
     */
    public int addItem(){
        return colorStore ? colorItems.addRefData() : -1;
    }

    /**
     * This function uses a HashMap to store data within a layer. It handles
     * both HEX and RGBA value input and gives out a color in RGB value for
     * each one.
     * @param fillData The index where this data is stored
     * @param blend Whether this is a blend color(T) or a basic color(F)
     */
    public void addItem(HashMap<String, String> fillData, boolean blend) {
        tempKey = new KeyStore();
        int temp;
        if(!colorStore)
            colorStore = true;

        for(String key: fillData.keySet()){
            //System.out.println("KEY: "+key);
            temp = refItems.get(key);
            switch(temp){
                case -1:
                    warn((blend ? "Blend" : "Color")+
                            "key '"+key+"' not recognized!");
                    break;
                case END:
                    colorStore = false;
                    return;
                case HEX:
                    tempKey.addData(HEX, getHexColor(fillData.get(key)));
                    colorItems.addData(getHexColor(fillData.get(key)));
                    return;
                default:
                    tempKey.addData(temp, Integer.parseInt(fillData.get(key)));
            }
        }

        colorItems.addData(getRGB(tempKey.getData(RED), tempKey.getData(GREEN),
            tempKey.getData(BLUE), tempKey.getData(ALPHA)));
    }

    /**
     * This function gets the color data for the index specified
     * @param index The reference index for this group of colors
     * @return The group of colors for this reference
     */
    public int[] getData(int index){
        return colorItems.getData(index);
    }

    /**
     * This function retrieves an integer RGB value from a group of integers
     * by converting it into a real color. If invalid values are specified,
     * it'll default them to the BASE color.
     * @param red The red pixel pigment color (0-255)
     * @param green The green pixel pigment color (0-255)
     * @param blue The blue pixel pigment color (0-255)
     * @param alpha The alpha transparent color (0-255)
     * @return An integer representing the colors
     */
    private int getRGB(int red, int green, int blue, int alpha){
        return new Color(getBaseColor(red), getBaseColor(green),
                getBaseColor(blue), getBaseColor(alpha)).getRGB();
    }

    /**
     * This function turns an invalid entry into an entry denoted by the
     * BASE color above.
     * @param color The color to check for validity
     * @return A valid color value
     */
    private int getBaseColor(int color){
        if(color < 0 || color > 255)
            color = BASE;
        return color;
    }

    /**
     * This function tests the validity of the Hex colors
     * @param value The String value to check for validity
     * @return An integer representing the color
     */
    private int getHexColor(String value){
        try{
            return Color.decode(value).getRGB();
        }catch(NumberFormatException ex){
            warn("Illegal Color Format! "+ex.toString());
            return -1;
        }
    }
}
