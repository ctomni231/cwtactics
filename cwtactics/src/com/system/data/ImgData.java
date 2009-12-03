package com.system.data;

import java.util.ArrayList;

/**
 * This is an image data file for the graphics model. It is designed
 * to hold and store as much information as possible about images.
 *
 * direction
 * 0: Normal; 1:N; 2:S; 3:E; 4:W;
 * weather
 * c: clear s: Snow r: Rain d: Sandstorm
 *
 * @author Crecen
 */
public class ImgData {
    public final byte TERRAIN = 0;
    public final byte PROPERTY = 1;
    public final byte UNIT = 2;
    public final byte COMMANDER = 3;
    public final byte ARROW = 4;
    public final byte CURSOR = 5;
    public final byte ATTRIBUTE = 6;//For explosions and other short effects

    public byte code;//What type of image is it
    public byte grid;//How many sides a single tile has for this image
    public byte direction;//Which way is this image facing
    public char weather;//What weather this image is for
    public boolean map;//Whether it is a map image, or a battle image
    //In pixels, where an image is located and the size
    public ArrayList<ImgFile> imgFileRef;
    //Holds multiple references for animation purposes
    public ArrayList<Byte> animRef;
    public String codeType;//What group this image belongs to (CW, MW, etc.)
    public String name;//The name of this image (a.k.a BRIDGE)
    public String group;//The main group this image belongs to (a.k.a. ROAD)
    public String army;//The army this image belongs to (a.k.a. OS)
    //Multipurpose variable used for terrain connections, explosion
    //types, and drawing minimap tiles.
    public ArrayList<String> tags;
    //Stores the default colors for the color changes
    public ArrayList<Integer> dfltColors;

    public ImgData(){
        code = -1;
        grid = 4;
        direction = 0;
        weather = 'c';
        map = true;
        imgFileRef = new ArrayList<ImgFile>();
        animRef = new ArrayList<Byte>();
        dfltColors = new ArrayList<Integer>();
        codeType = "";
        name = "";
        group = "";
        army = "";
        tags = new ArrayList<String>();
    }
}
