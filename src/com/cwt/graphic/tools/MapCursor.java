package com.cwt.graphic.tools;

import com.cwt.map.MapElement;
import com.cwt.map.PixAnimate;
import com.cwt.system.jslix.tools.ImgLibrary;

/*
 * MapDraw.java
 *
 * This draws the cursor for the MapDraw object. It is separated from the
 * draw class so it can be expanded to include many different types of
 * cursor objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.05.11
 */
public class MapCursor extends MovingMenu {

    public final int BASE = PixAnimate.BASE;//Holds the default base value

    private ImgLibrary imgSort;//Holds all images for the current cursor
    private int[] curImages;//Holds all possible cursor images for the cursor
    private double scale;//Holds the scale of currently drawn tiles
    private String cursorImg;//Holds the curent drawn cursor image

    public MapCursor(int locx, int locy, double speed){
        super(locx, locy, speed);
        curImages = PixAnimate.getCursor();
        System.out.println("CURSOR SIZE:"+curImages.length);
        imgSort = new ImgLibrary();
    }

    public void setCursor(int index){
        if(curImages.length > 0){
            int[] temp = PixAnimate.getMapData().getArray(
                curImages[index], MapElement.FILE);
            imgSort.addImage(0,
                PixAnimate.getMapData().getFileData().getFile(temp[0]));
        }
        updateCursor();
    }

    public void updateCursor(){
        deleteItems();
        scale = PixAnimate.getScale();       
        if(scale != 1)
            imgSort.setImageSize((int)(imgSort.getX(0)*scale),
                (int)(imgSort.getY(0)*scale));
        imgSort.addImage(1, imgSort.getImage(0));
        imgSort.setFlipX();
        imgSort.addImage(2, imgSort.getImage(1));
        imgSort.setFlipY();
        imgSort.addImage(3, imgSort.getImage(1));
        imgSort.setFlipX();
        imgSort.setFlipY();
        imgSort.addImage(4, imgSort.getImage(1));

        createNewItem(0, 0, 1);
        addImagePart(imgSort.getImage(1), 1.0);
        addMenuItem(0, true);
        createNewItem((int)(BASE*scale), 0, 1);
        addImagePart(imgSort.getImage(2), 1.0);
        addMenuItem(0, true);
        createNewItem(0, (int)(BASE*scale), 1);
        addImagePart(imgSort.getImage(3), 1.0);
        addMenuItem(0, true);
        createNewItem((int)(BASE*scale), (int)(BASE*scale), 1);
        addImagePart(imgSort.getImage(4), 1.0);
        addMenuItem(0, true);

        setFinalPosition((int)posx-(imgSort.getX(1)/2),
                (int)posy-(imgSort.getY(1)/2)+BASE*2);
    }

    @Override
    public void update(int width, int height, int sysTime, int mouseScroll){
        super.update(width, height, sysTime, mouseScroll);
        if(sysTime/10 > 50){
            this.setItemPosition(0, (int)(scale),
                (int)scale-(int)(BASE*scale));
            this.setItemPosition(1, (int)((scale*BASE)-scale),
                (int)scale-(int)(BASE*scale));
            this.setItemPosition(2, (int)scale, (int)((scale*BASE)-scale)-
                (int)(BASE*scale));
            this.setItemPosition(3, (int)((scale*BASE)-scale),
                (int)((scale*BASE)-scale)-(int)(BASE*scale));
        }else{
            this.setItemPosition(0, (int)(-scale*2),
                (int)(-scale*2)-(int)(BASE*scale));
            this.setItemPosition(1, (int)((scale*BASE)+(2*scale)),
                (int)(-scale*2)-(int)(BASE*scale));
            this.setItemPosition(2, (int)(-scale*2),
                (int)((scale*BASE)+(2*scale))-(int)(BASE*scale));
            this.setItemPosition(3, (int)((scale*BASE)+(2*scale)),
                (int)((scale*BASE)+(2*scale))-(int)(BASE*scale));
        }
    }
}
