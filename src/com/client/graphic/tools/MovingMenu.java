package com.client.graphic.tools;

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
 * @author Crecen
 */
public class MovingMenu extends MovingImage{

    public final int REGULAR = 0;
    public final int ROUND_BOX = 1;
    public final int RECTANGLE = 2;
    public final int RND_BORDER = 3;
    public final int BORDER = 4;

    private MenuItem[] allItems;
    private ArrayList<Integer> resetImage;
    public int select;
    private MenuItem item;

    public MovingMenu(int locx, int locy, double speed){
        super(locx, locy, speed);
        active = false;
        select = 0;
        resetImage = new ArrayList<Integer>();
        allItems = new MenuItem[0];
        item = new MenuItem(locx, locy, speed);
    }

    //Creates a new item to be drawn on the screen
    public void createNewItem(int locx, int locy, double speed){
        item = new MenuItem(locx, locy, speed);
    }

    //Adds an image onto the item
    public void addImagePart(String imgPath, double opacity){
        if(resetImage.isEmpty()){
            item.addReference(imgRef.length());
            setImage(imgPath);
        }else{
            imgRef.addImage(resetImage.get(0), imgPath);
            item.addReference(resetImage.remove(0));
        }
        item.opacity = opacity;
    }

    //Adds an image onto the item
    public void addImagePart(Image img, double opacity){
        if(resetImage.isEmpty()){
            item.addReference(imgRef.length());
            setImage(img);
        }else{
            imgRef.addImage(resetImage.get(0), img);
            item.addReference(resetImage.remove(0));
        }
        item.opacity = opacity;
    }

    //Adds/Replaces the item to/on the list of items (do once per menu item)
    public void addMenuItem(int select, boolean selectable){
        addMenuItem(-1, select, selectable);
    }
    public void addMenuItem(int index, int select, boolean selectable){
        addItem(index, REGULAR, select, null, imgRef.getX(allItems.length),
                imgRef.getY(allItems.length), 0, true);
    }

    //Adds a Rounded Filled Box to the Menu items list
    public void addRoundBox(int select, Color theColor,
            int sizex, int sizey, int arc, boolean selectable){
        addRoundBox(-1, ROUND_BOX, theColor,
                sizex, sizey, arc, selectable);
    }
    public void addRoundBox(int index, int select, Color theColor,
            int sizex, int sizey, int arc, boolean selectable){
        addItem(index, ROUND_BOX, select, theColor,
                sizex, sizey, arc, selectable);
    }

    //Adds a rectangle Filled Box to the Menu Items list
    public void addBox(int select, Color theColor, int sizex, int sizey,
            boolean selectable){
        addBox(-1, RECTANGLE, theColor, sizex, sizey, selectable);
    }
    public void addBox(int index, int select, Color theColor,
            int sizex, int sizey, boolean selectable){
        addItem(index, RECTANGLE, select, theColor,
                sizex, sizey, 0, selectable);
    }

    //Adds a rectangle border box to the Menu Items list
    public void addBorder(int select, Color theColor, int sizex, int sizey,
            boolean selectable){
        addItem(-1, BORDER, select, theColor, sizex, sizey, 0, selectable);
    }

    //Adds a rounded border box to the menu items list
    public void addRoundBorder(int select, Color theColor, int sizex,
            int sizey, int arc, boolean selectable){
        addItem(-1, RND_BORDER, select, theColor,
                sizex, sizey, arc, selectable);
    }

    public void setItemPosition(int index, int locx, int locy){
        setItemPosition(index, locx, locy, false);
    }
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

    //Sets whether this item is drawable
    public void setItemDraw(int index, boolean draw){
        if(index >= 0 && index < allItems.length){
            item = allItems[index];
            item.drawthis = draw;
            allItems[index] = item;
        }
    }

    //This changes how selected items react in a menu
    public void setItemChoice(int index, int choice){
        if(index >= 0 && index < allItems.length){
            item = allItems[index];
            item.choice = choice;
            allItems[index] = item;
        }
    }

    public void setItemImage(int index, int itemIndex, String imgPath){
        if(index >= 0 && index < allItems.length){
            if(item.getIndexExists(itemIndex)){
            item = allItems[index];
                imgRef.addImage(item.refPath[itemIndex], imgPath);
                allItems[index] = item;
            }
        }
    }

    //TODO (JSLIX) Menu items need to resize with the screen
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll){
        super.update(width, height, sysTime, mouseScroll);
        for(int i = 0; i < allItems.length; i++)
            allItems[i].renderSpeed();
        //If scroll is different, you'll have to resize all images
    }

    //TODO (JSLIX) Check to see if select is working
    @Override
    public void render(Graphics g){
        for(MenuItem itm: allItems){
            if(!itm.drawthis)
                continue;

            switch(itm.id){
                case REGULAR:
                    g.drawImage(imgRef.getSlickImage(itm.getPicture(
                            itm.index == select)),
                            (int)(posx+itm.posx), (int)(posy+itm.posy));
                    break;
                default:
                    if(select == itm.index || !itm.selectable){
                        if(itm.theColor != null)
                            g.setColor(imgRef.getColor(itm.theColor));
                        if(itm.index == RECTANGLE)
                            g.fillRect((int)(posx+itm.posx), (int)
                                 (posy+itm.posy), itm.sizex, itm.sizey);
                        else if(itm.index == ROUND_BOX)
                            g.fillRoundRect((int)(posx+itm.posx),
                                (int)(posy+itm.posy), itm.sizex,
                                itm.sizey, itm.arc);
                        else if(itm.index == BORDER)
                            g.drawRect((int)(posx+itm.posx), (int)
                               (posy+itm.posy), itm.sizex, itm.sizey);
                        else if(itm.index == RND_BORDER)
                            g.drawRoundRect((int)(posx+itm.posx),
                                (int)(posy+itm.posy), itm.sizex,
                                itm.sizey, itm.arc);
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
                    g.drawImage(imgRef.getImage(itm.getPicture(
                            itm.index == select)),
                            (int)(posx+itm.posx), (int)(posy+itm.posy), dthis);
                    break;
                default:
                    if(select == itm.index || !itm.selectable){
                        if(itm.theColor != null)
                            g.setColor(itm.theColor);
                        if(itm.index == RECTANGLE)
                            g.fillRect((int)(posx+itm.posx), (int)
                                 (posy+itm.posy), itm.sizex, itm.sizey);
                        else if(itm.index == ROUND_BOX)
                            g.fillRoundRect((int)(posx+itm.posx),
                                (int)(posy+itm.posy), itm.sizex,
                                itm.sizey, itm.arc, itm.arc);
                        else if(itm.index == BORDER)
                            g.drawRect((int)(posx+itm.posx), (int)
                               (posy+itm.posy), itm.sizex, itm.sizey);
                        else if(itm.index == RND_BORDER)
                            g.drawRoundRect((int)(posx+itm.posx),
                                (int)(posy+itm.posy), itm.sizex,
                                itm.sizey, itm.arc, itm.arc);
                    }
            }
        }
    }

    //Cleanly deletes items for the menu List
    public void deleteItems(){
        for(int i = 0; i < allItems.length; i++){
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
                else if(i > index)
                    allItems[i] = temp[i+1];
            }
        }
    }

    //This universally adds an item to the list
    private void addItem(int index, int id, int select, Color theColor,
         int sizex, int sizey, int arc, boolean selectable){
        item.id = id;
        item.index = select;
        item.theColor = theColor;
        item.selectable = selectable;
        item.sizex = sizex;
        item.sizey = sizey;
        item.arc = arc;
        if(index < 0 || index >= allItems.length)
            addItem();
        else
            replaceItem(index);
    }

    private void addItem(){
        //Adds an item onto the item array
        MenuItem[] temp = allItems;
        allItems = new MenuItem[temp.length+1];
        System.arraycopy(temp, 0, allItems, 0, temp.length);
        allItems[allItems.length-1] = item;
    }

    private void replaceItem(int index){
        if(index >= 0 && index < allItems.length)
            allItems[index] = item;
    }


}
