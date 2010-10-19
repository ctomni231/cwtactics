package com.client.graphic.tools;

import com.jslix.tools.ImgLibrary;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;
import java.awt.Image;
import java.util.ArrayList;
import org.newdawn.slick.Graphics;

/**
 * MovingMenu.java
 *
 * A remix of PixMenu, helps you to create a menu of selectable image items
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.15.10
 * @todo TODO Finish commenting this class
 */

public class MovingMenu extends MovingImage{

    public final int REGULAR = 0;//MenuItem regular item index
    public final int ROUND_BOX = 1;//MenuItem round box item index
    public final int RECTANGLE = 2;//MenuItem rectangle item index
    public final int RND_BORDER = 3;//MenuItem round border item index
    public final int BORDER = 4;//ManuItem border item index

    protected MenuItem[] allItems;//All Items for this menu
    private ArrayList<Integer> resetImage;//Helps better index images
    public int select;//This highlights a menu item
    private MenuItem item;//A temp item for storing various enhancements
    private double sx;//A temp value for rescaling
    private double sy;//A temp value for rescaling
    protected ImgLibrary imgResize;//This holds all resized images

    /**
     * This class organizes a group of images into click-able boxes for
     * easy menu management. Each menu item is binded to a select value
     * for easy selection of the items
     * @param locx The x-axis location of the menu
     * @param locy The y-axis location of the menu
     * @param speed The speed this menu moves
     */
    public MovingMenu(int locx, int locy, double speed){
        super(locx, locy, speed);
        active = false;
        select = 0;
        resetImage = new ArrayList<Integer>();
        allItems = new MenuItem[0];
        item = new MenuItem(locx, locy, speed);
        imgResize = new ImgLibrary();
        sx = 0;
        sy = 0;
    }

    /**
     * This creates a new empty menu item to be filled
     * @param locx The x-axis location of this menu item
     * @param locy The y-axis location of the menu item
     * @param speed How quickly this menu item moves
     */
    public void createNewItem(int locx, int locy, double speed){
        item = new MenuItem(locx, locy, speed);
    }

    /**
     * This adds an image onto the created menu item based on file path
     * @param imgPath The file path to the image
     * @param opacity The opacity of this image (0-1)
     */
    public void addImagePart(String imgPath, double opacity){
        addImgPart(imgPath, null, opacity);
    }

    /**
     * This adds an image onto the created menu item based on an image
     * @param img The image to add to this menu item
     * @param opacity The opacity of this image (0-1)
     */
    public void addImagePart(Image img, double opacity){
    	addImgPart("", img, opacity);
    }

    /**
     * This adds the menu item on a list so it'll be displayed.
     * @param select The select index associated with this item
     * @param selectable Whether this item changes when selected
     */
    public void addMenuItem(int select, boolean selectable){
        addItem(REGULAR, select, null, imgRef.getX(allItems.length),
                imgRef.getY(allItems.length), 0, selectable);
    }

    /**
     * This function adds a rounded filled box to the menu list
     * @param select The select index associated with this item
     * @param theColor The color of this rounded box
     * @param sizex The width of this rounded box
     * @param sizey The height of this rounded box
     * @param arc The arc length of this rounded box
     * @param selectable Whether this item changes when selected
     */
    public void addRoundBox(int select, Color theColor,
            int sizex, int sizey, int arc, boolean selectable){
        addItem(ROUND_BOX, select, theColor,
                sizex, sizey, arc, selectable);
    }

    /**
     * This function adds a filled rectangle to the menu list
     * @param select The select index associated with this item
     * @param theColor The color of this rectangle
     * @param sizex The width of this rectangle
     * @param sizey The height of this rectangle
     * @param selectable Whether this item changes when selected
     */
    public void addBox(int select, Color theColor, int sizex, int sizey,
            boolean selectable){
        addItem(RECTANGLE, select, theColor,
                sizex, sizey, 0, selectable);
    }

    /**
     * This function adds a rectangle border to the menu list
     * @param select The select index associated with this item
     * @param theColor The color of this border
     * @param sizex The width of this border
     * @param sizey The height of this border
     * @param selectable Whether this item changes when selected
     */
    public void addBorder(int select, Color theColor, int sizex, int sizey,
            boolean selectable){
        addItem(BORDER, select, theColor,
                sizex, sizey, 0, selectable);
    }

    //Adds a rounded border box to the menu items list
    /**
     * This function adds a rounded rectangle border to the menu list
     * @param select The select index associated with this item
     * @param theColor The color of this border
     * @param sizex The width of this border
     * @param sizey The height of this border
     * @param arc The are width of this border
     * @param selectable Whether this item changes when selected
     */
    public void addRoundBorder(int select, Color theColor, int sizex,
            int sizey, int arc, boolean selectable){
        addItem(RND_BORDER, select, theColor,
                sizex, sizey, arc, selectable);
    }

    /**
     * This is used to refresh the visibility of all items
     */
    public void resetScreen(){
        sx = 0;
        sy = 0;
    }

    /**
     * This function changes the position of a menu item in the list
     * @param index The current position of the item in the list
     * @param locx The new x-axis location to set this image to
     * @param locy The new y-axis location to set this image to
     */
    public void setItemPosition(int index, int locx, int locy){
        setItemPosition(index, locx, locy, false);
    }

    /**
     * This function changes the position of a menu item in the list
     * @param index The current position of the item in the list
     * @param locx The new x-axis location to set this image to
     * @param locy The new y-axis location to set this image to
     * @param addPrev Whether to add the previous image location(T) or not(F)
     */
    public void setItemPosition(int index, int locx, int locy,
            boolean addPrev){
        if(index >= 0 && index < allItems.length){
            item = allItems[index];
            if(addPrev)
                item.setFinalPosition((int)item.posx+locx,
                        (int)item.posy+locy);
            else
                item.setFinalPosition(locx, locy);
            allItems[index] = item;
        }
    }

    /**
     * This function sets the visibility and select-ability of the menu item
     * @param index The current position of the item in the list
     * @param draw Whether to draw this item(true) or not(false)
     */
    public void setItemDraw(int index, boolean draw){
        if(index >= 0 && index < allItems.length){
            item = allItems[index];
            item.drawthis = draw;
            allItems[index] = item;
        }
    }

    /**
     * This sets the position of the selected images of the menu item
     * @param index The current position of the item in the list
     * @param choice The value that controls the indexed image display
     */
    public void setItemChoice(int index, int choice){
        if(index >= 0 && index < allItems.length){
            item = allItems[index];
            item.choice = choice;
            allItems[index] = item;
        }
    }

    /**
     * This function sets the color of the menu item
     * @param index The current position of the item in the list
     * @param theColor The color to change the item to
     */
    public void setItemColor(int index, Color theColor){
        if(index >= 0 && index < allItems.length && theColor != null){
            item = allItems[index];
            item.theColor = theColor;
            allItems[index] = item;
        }
    }

    //This sets a new image within the menu item
    public void setItemImage(int index, int itemIndex, String imgPath){
        if(index >= 0 && index < allItems.length){
            if(item.getIndexExists(itemIndex)){
                sx = 0;
                item = allItems[index];
                imgRef.addImage(item.refPath[itemIndex], imgPath);
                allItems[index] = item;
            }
        }
    }

    //This sets a new image within the menu item
    public void setItemImage(int index, int itemIndex, Image img){
        if(index >= 0 && index < allItems.length){
            if(item.getIndexExists(itemIndex)){
                sx = 0;
                item = allItems[index];
                imgRef.addImage(item.refPath[itemIndex], img);
                allItems[index] = item;
            }
        }
    }

    //This deals with mouse selecting within the menu
    public boolean mouseSelect(int mx, int my){
    	for(MenuItem itm: allItems){
            if(!itm.drawthis)
                continue;
            if(itm.selectable && select != itm.select){           	
            	if(itm.sizex == 0 && itm.sizey == 0){
            		itm.sizex = imgRef.getX(itm.getPicture(false));
            		itm.sizey = imgRef.getY(itm.getPicture(false));
            	}
            	if(mx > (int)((itm.posx+posx)*scalex) && 
            			mx < (int)((itm.posx+posx+itm.sizex)*scalex)){
                    if(my > (int)((itm.posy+posy)*scaley) && 
                    		my < (int)((itm.posy+posy+itm.sizey)*scaley)){
                    	
                        select = itm.select;
                        return true;
                    }
                }
            }
    	}
    	return false;
    }

    @Override
    public void update(int width, int height, int sysTime, int mouseScroll){
        super.update(width, height, sysTime, mouseScroll);
        for(int i = 0; i < allItems.length; i++)
            allItems[i].renderSpeed();
        if(sx != scalex || sy != scaley){
            for(int i = 0; i < imgRef.length(); i++){
                if(dfltColor != null){
                    for(int j = 0; j < dfltColor.length; j++)
                        imgResize.setPixelChange(dfltColor[j], chngColor[j]);
                }
                imgResize.setImageSize((int)((double)imgRef.getX(i)*scalex),
                    (int)((double)imgRef.getY(i)*scaley));
                imgResize.addImage(i, imgRef.getImage(i));
            }
            sx = scalex;
            sy = scaley;
        }
    }

    @Override
    public void render(Graphics g){
        for(MenuItem itm: allItems){
            if(!itm.drawthis)
                continue;

            switch(itm.id){
                case REGULAR:
                	if(itm.opacity >= 0 && itm.opacity <= 1)
                		imgResize.getSlickImage(
                                        itm.getPicture(itm.select == select))
                                        .setAlpha((float)itm.opacity);
                	else if(opacity < 1)
                		imgResize.getSlickImage(
                                        itm.getPicture(itm.select == select))
                				.setAlpha((float)opacity);
                    g.drawImage(imgResize.getSlickImage(itm.getPicture(
                            itm.select == select)),
                            (int)((posx+itm.posx)*scalex), 
                            (int)((posy+itm.posy)*scaley));
                    break;
                default:
                    if(select == itm.select || !itm.selectable){
                        if(itm.theColor != null)
                            g.setColor(imgRef.getColor(itm.theColor));
                        if(itm.id == RECTANGLE)
                            g.fillRect((int)((posx+itm.posx)*scalex), 
                                    (int)((posy+itm.posy)*scaley), 
                                    (int)(itm.sizex*scalex), 
                                    (int)(itm.sizey*scaley));
                        else if(itm.id == ROUND_BOX)
                            g.fillRoundRect((int)((posx+itm.posx)*scalex), 
                                    (int)((posy+itm.posy)*scaley), 
                                    (int)(itm.sizex*scalex), 
                                    (int)(itm.sizey*scaley), 
                                    (int)(itm.arc*scaley));
                        else if(itm.id == BORDER)
                            g.drawRect((int)((posx+itm.posx)*scalex), 
                                    (int)((posy+itm.posy)*scaley), 
                                    (int)(itm.sizex*scalex), 
                                    (int)(itm.sizey*scaley));
                        else if(itm.id == RND_BORDER)
                            g.drawRoundRect((int)((posx+itm.posx)*scalex), 
                                    (int)((posy+itm.posy)*scaley),
                                    (int)(itm.sizex*scalex), 
                                    (int)(itm.sizey*scaley), 
                                    (int)(itm.arc*scaley));
                    }
            }
        }
    }

    @Override
    public void render(Graphics2D g, Component dthis){
        for(MenuItem itm: allItems){

            if(!itm.drawthis)
                continue;

            switch(itm.id){
                case REGULAR:
                	if(itm.opacity >= 0 && itm.opacity <= 1)
                		g.setComposite(AlphaComposite.getInstance(
                				AlphaComposite.SRC_OVER,
                                (float)itm.opacity));
                	else if(opacity < 1)
                		g.setComposite(AlphaComposite.getInstance(
                				AlphaComposite.SRC_OVER,
                                (float)opacity));
                    g.drawImage(imgResize.getImage(itm.getPicture(
                            itm.select == select)),
                            (int)((posx+itm.posx)*scalex), 
                            (int)((posy+itm.posy)*scaley), dthis);
                    if(opacity < 1 || itm.opacity >= 0 && itm.opacity < 1)
                    	g.setComposite(AlphaComposite.SrcOver);
                    break;
                default:
                    if(select == itm.select || !itm.selectable){
                        if(itm.theColor != null)
                            g.setColor(itm.theColor);
                        if(itm.id == RECTANGLE)
                            g.fillRect((int)((posx+itm.posx)*scalex), 
                                    (int)((posy+itm.posy)*scaley), 
                                    (int)(itm.sizex*scalex), 
                                    (int)(itm.sizey*scaley));
                        else if(itm.id == ROUND_BOX)
                            g.fillRoundRect((int)((posx+itm.posx)*scalex), 
                                    (int)((posy+itm.posy)*scaley), 
                                    (int)(itm.sizex*scalex), 
                                    (int)(itm.sizey*scaley), 
                                    (int)(itm.arc*scalex), 
                                    (int)(itm.arc*scaley));
                        else if(itm.id == BORDER)
                            g.drawRect((int)((posx+itm.posx)*scalex), 
                                    (int)((posy+itm.posy)*scaley), 
                                    (int)(itm.sizex*scalex), 
                                    (int)(itm.sizey*scaley));
                        else if(itm.id == RND_BORDER)
                            g.drawRoundRect((int)((posx+itm.posx)*scalex), 
                                    (int)((posy+itm.posy)*scaley), 
                                    (int)(itm.sizex*scalex), 
                                    (int)(itm.sizey*scaley),
                                    (int)(itm.arc*scalex), 
                                    (int)(itm.arc*scaley));
                    }
            }
        }
    }

    //Cleanly deletes items for the menu List
    public void deleteItems(){
        for(int i = allItems.length; --i >= 0 ;){
            deleteItem(i);
        }
    }
    public void deleteItems(int type){
        for(int i = 0; i < allItems.length; i++){
            if(item.id == type)
                deleteItem(i);
        }
    }
    public void deleteItem(int index){
        if(index >= 0 && index < allItems.length){
            item = allItems[index];
            for(int i = 0; i < item.refPath.length; i++)
                resetImage.add(item.refPath[i]);

            MenuItem[] temp = allItems;
            allItems = new MenuItem[temp.length-1];
            for(int i = 0; i < allItems.length; i++){
                if(i < index)
                    allItems[i] = temp[i];
                else if(i >= index)
                    allItems[i] = temp[i+1];
            }
        }
    }

    //Switchies two items
    public void swapItems(int index, int change){
        if(index >= 0 && index < allItems.length &&
                change >= 0 && change < allItems.length){
            MenuItem temp = allItems[index];
            allItems[index] = allItems[change];
            allItems[change] = temp;
        }
    }

    //This universally adds an item to the list
    private void addItem(int id, int select, Color theColor,
         int sizex, int sizey, int arc, boolean selectable){
        item.id = id;
        item.select = select;
        item.theColor = theColor;
        item.selectable = selectable;
        item.sizex = sizex;
        item.sizey = sizey;
        item.arc = arc;
        addItem();
    }

    //Adds an item onto the item array
    private void addItem(){
        MenuItem[] temp = allItems;
        allItems = new MenuItem[temp.length+1];
        System.arraycopy(temp, 0, allItems, 0, temp.length);
        allItems[allItems.length-1] = item;
    }

    //Deals with adding images to the array of images
    private void addImgPart(String imgPath, Image img, double opacity){
    	if(resetImage.isEmpty()){
            item.addReference(imgRef.length());
            if(img == null)
            	setImage(imgPath);
            else
            	setImage(img);
        }else{
            if(img == null)
                imgRef.addImage(resetImage.get(0), imgPath);
            else
            	imgRef.addImage(resetImage.get(0), img);
            item.addReference(resetImage.remove(0));
        }
        item.opacity = opacity;
    }

    //Gets the scale of the window
    public double getScaleX(){
        return scalex;
    }

    //Gets the scale of the window
    public double getScaleY(){
        return scaley;
    }

}
