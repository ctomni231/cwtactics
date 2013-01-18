package com.cwt.menu.tools;

import com.jslix.image.ImgLibrary;

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
 * @version 12.10.11
 */

public class MovingMenu extends MovingImage{

    /** MenuItem regular item index */
    public final int REGULAR = 0;
    /** MenuItem round box item index */
    public final int ROUND_BOX = 1;
    /** MenuItem rectangle item index */
    public final int RECTANGLE = 2;
    /** MenuItem round border item index */
    public final int RND_BORDER = 3;
    /** MenuItem border item index */
    public final int BORDER = 4;

    /** All Items for this menu */
    protected MenuItem[] allItems;
    /** Helps better index images */
    private ArrayList<Integer> resetImage;
    /** This highlights a menu item */
    public int select;
    /** A temp item for storing various enhancements */
    private MenuItem item;
    /** This helps recycle item objects */
    private MenuItemPool itemObj;
    /** A temporary value for x-axis re-scaling */
    private double sx;
    /** A temporary value for y-axis re-scaling */
    private double sy;
    /** This holds all resized images */
    protected ImgLibrary imgResize;

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
        itemObj = new MenuItemPool();
        createNewItem(locx, locy, speed);
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
    public final void createNewItem(int locx, int locy, double speed){
        itemObj.setVar(locx, locy, speed);
        item = itemObj.acquireObject();
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
     * @param selectable Whether the user can interact with the menu item
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
     * @param selectable Whether the user can interact with the menu item
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
     * @param selectable Whether the user can interact with the menu item
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
     * @param selectable Whether the user can interact with the menu item
     */
    public void addBorder(int select, Color theColor, int sizex, int sizey,
            boolean selectable){
        addItem(BORDER, select, theColor,
                sizex, sizey, 0, selectable);
    }

    /**
     * This function adds a rounded rectangle border to the menu list
     * @param select The select index associated with this item
     * @param theColor The color of this border
     * @param sizex The width of this border
     * @param sizey The height of this border
     * @param arc The are width of this border
     * @param selectable Whether the user can interact with the menu item
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
            item.setFinalPosition(addPrev ? (int)item.posx+locx : locx,
                addPrev ? (int)item.posy+locy : locy);
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
        if(index >= -1 && index < allItems.length){
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

    /**
     * This function sets a new image within a menu item
     * @param index The current position of the item in the list
     * @param itemIndex The current position of the picture in the menu item
     * @param imgPath The file path of the new image
     */
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

    /**
     * This function sets a new image within a menu item
     * @param index The current position of the item in the list
     * @param itemIndex The current position of the picture in the menu item
     * @param img The new image to replace the current image
     */
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

    /**
     * This function sets the speed within a menu item
     * @param index The current position of the item in the list
     * @param speed The speed to change the item to
     */
    public void setItemSpeed(int index, double speed){
        if(index >= 0 && index < allItems.length){
            item = allItems[index];
            item.speed = speed;
            allItems[index] = item;
        }
    }

    /**
     * This controls how the mouse interacts with the selection of the menu
     * items
     * @param mx The x-axis position of the mouse
     * @param my The y-axis position of the mouse
     * @return Whether the mouse is overlapping a menu item(T) or not(F)
     */
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

    /**
     * This function deals with updating all the graphical features of
     * the menu
     * @param width The current width of the window
     * @param height The current height of the window
     * @param sysTime The system time in milliseconds
     * @param mouseScroll The current mouse scroll wheel value
     */
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll){
        super.update(width, height, sysTime, mouseScroll);
        for(int i = 0; i < allItems.length; i++)
            allItems[i].updatePosition();
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

    /**
     * This draws the menu using a graphics object
     * @param g The Slick2D Graphics object
     */
    @Override
    public void render(Graphics g){
        for(MenuItem itm: allItems){
            if(!itm.drawthis)
                continue;

            switch(itm.id){
                case REGULAR:
                    if(itm.choice != -1 || itm.select == select){
                        if(itm.opacity >= 0 && itm.opacity <= 1)
                           imgResize.getSlickImage(itm.getPicture(
                           itm.select == select)).setAlpha((float)itm.opacity);
                        else if(opacity < 1)
                            imgResize.getSlickImage(itm.getPicture(
                            itm.select == select)).setAlpha((float)opacity);

                        g.drawImage(imgResize.getSlickImage(
                            itm.getPicture(itm.select == select)),
                            (int)((posx+itm.posx)*scalex),
                            (int)((posy+itm.posy)*scaley));
                    }
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
                               (int)(itm.sizey*scaley), (int)(itm.arc*scaley));
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

    /**
     * This draws a menu using the graphics object
     * @param g The Java2D graphics object
     * @param dthis The Java2D Component object
     */
    @Override
    public void render(Graphics2D g, Component dthis){
        for(MenuItem itm: allItems){

            if(!itm.drawthis)
                continue;

            switch(itm.id){
                case REGULAR:
                    if(itm.opacity >= 0 && itm.opacity <= 1)
                        g.setComposite(AlphaComposite.getInstance(
                         AlphaComposite.SRC_OVER, (float)itm.opacity));
                    else if(opacity < 1)
                        g.setComposite(AlphaComposite.getInstance(
                         AlphaComposite.SRC_OVER, (float)opacity));
                    if(itm.choice != -1 || itm.select == select)
                        g.drawImage(imgResize.getImage(itm.getPicture(
                        itm.select == select)), (int)((posx+itm.posx)*scalex),
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

    /**
     * This function deletes all menu items in the item list cleanly
     */
    public void deleteItems(){
        for(int i = allItems.length; --i >= 0 ;)
            deleteItem(i);
    }

    /**
     * This function deletes all items in the menu item list of a specific
     * type
     * @param type The type of menu item to delete
     */
    public void deleteItems(int type){
        for(int i = 0; i < allItems.length; i++){
            if(item.id == type)
                deleteItem(i);
        }
    }

    /**
     * This function deletes an item you specify
     * @param index The index location of the menu item
     */
    public void deleteItem(int index){
        if(index >= 0 && index < allItems.length){
            item = allItems[index];
            for(int i = 0; i < item.refPath.length; i++)
                resetImage.add(item.refPath[i]);
            itemObj.recycleInstance(allItems[index]);

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

    /**
     * This function swaps two items positions in the menu list
     * @param index The index location of the menu item
     * @param change The new location of the menu item
     */
    public void swapItems(int index, int change){
        if(index >= 0 && index < allItems.length &&
                change >= 0 && change < allItems.length){
            MenuItem temp = allItems[index];
            allItems[index] = allItems[change];
            allItems[change] = temp;
        }
    }

    /**
     * This function is the universal hub function for adding items to a
     * menu item list for each type
     * @param id The type of item this item is associated as
     * @param select The select index this item will highlight for
     * @param theColor The color of this item
     * @param sizex The width of this item
     * @param sizey The height of this item
     * @param arc The arc length of this item
     * @param selectable Whether this item interacts with the user
     */
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

    /**
     * This function adds an item onto the menu item array
     */
    private void addItem(){
        MenuItem[] temp = allItems;
        allItems = new MenuItem[temp.length+1];
        System.arraycopy(temp, 0, allItems, 0, temp.length);
        allItems[allItems.length-1] = item;
    }

    /**
     * This function is the universal hub function for adding an image to
     * a menu item
     * @param imgPath The file path to the image
     * @param img The java2D image to add
     * @param opacity How opaque an image is from 0 - 1.
     */
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

    /**
     * This function gets the window width
     * @return The window width
     */
    public double getScaleX(){
        return scalex;
    }

    /**
     * This function gets the window height
     * @return The window height
     */
    public double getScaleY(){
        return scaley;
    }
}
