package com.system.data;

/**
 * This holds the path to an image. It shows where to find an image
 * in pixels. Whether an image should be flipped, the size of the
 * in pixels. And how big it should be on the map.
 *
 * Format Location: locx, locy, sizex, sizey, tilesizex, tilesizey, flip
 *
 * flip: [short=action] Key: *1: rotate90; *2:flipX; *3:flipY
 * 0=default; 1=*1; 2=*2; 3=*3; 4=*1&*2; 5=*1&*3; 6=*2&*3; 7=*1&*2&*3
 * @author Crecen
 */
public class ImgFile {
    public String filename;
    public short locx;//Location where to start a width cut in image
    public short locy;//Location where to start a height cut in image
    public short sizex;//The width of the cut (<1: for default)
    public short sizey;//The height of the cut (<1: for default)
    public short tilex;//Tile size width
    public short tiley;//Tile size height
    public byte flipEdit;//Rotates and flips a cut image

    public ImgFile(){
        filename = "";
        locx = 0;
        locy = 0;
        sizex = 0;
        sizey = 0;
        tilex = 1;
        tiley = 1;
        flipEdit = 0;
    }

    public void setLocation(short[] location){
        for(int i = 0; i < location.length; i++){
            if(i == 0)      locx = location[i];
            else if(i == 1) locy = location[i];
            else if(i == 2) sizex = location[i];
            else if(i == 3) sizey = location[i];
            else if(i == 4) tilex = location[i];
            else if(i == 5) tiley = location[i];
            else if(i == 6) flipEdit = (byte)location[i];
        }
    }
}
