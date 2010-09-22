package com.client.graphic.tools;

import java.awt.Color;
import java.awt.Image;
import java.util.ArrayList;
import org.newdawn.slick.Graphics;

/**
 * MovingMenu.java
 *
 * A remix of PixMenu, this class creates and organizes menus for the
 * program.
 *
 * @author Crecen
 */
public class MovingMenu extends MovingImage{

    public final int REGULAR = 0;
    public final int ROUND_BOX = 1;
    public final int RECTANGLE = 2;
    public final int RND_BORDER = 3;
    public final int BORDER = 4;

    protected ArrayList<MovingMenuItem> menuItems;
    protected double globalOpac;
    public int select;

    private MovingMenuItem item;
    private double sx;
    private double sy;

    public MovingMenu(int locx, int locy, double speed){
        super(locx, locy, speed);
        menuItems = new ArrayList<MovingMenuItem>();
        globalOpac = 0;
        select = 0;
        item = new MovingMenuItem(locx, locy, speed);
    }

    //Makes a new item with the options you specify
    public void createNewItem(int locx, int locy, double speed){
        item = new MovingMenuItem(locx, locy, speed);
    }

    //Adds an image to this menu for display
    public void addMenuImgPart(String imgPath, double opac, Color theColor){
        setImage(imgPath);
        item.addPixPart(imgRef.getImage(0), opac, theColor);
    }
    public void addMenuImgPart(Image img, double opac, Color theColor){
        setImage(img);
        item.addPixPart(imgRef.getImage(0), opac, theColor);
    }

    //Make sure you create a new item or items might overlap each other
    public void addMenuPart(int select, boolean selectable){
        addMenuPart(select, 0, 0, selectable);
    }
    public void addMenuPart(int select, int sizex, int sizey,
            boolean selectable){
        addItem(REGULAR, select, null, sizex, sizey, 0, selectable);
    }

    //Make sure you create a new item or items might overlap each other
    public void addRoundBox(int select, Color theColor,
            int sizex, int sizey, int arc, boolean selectable){
        addItem(ROUND_BOX, select, theColor, sizex, sizey, arc, selectable);
    }

    //Make sure you create a new item or items might overlap each other
    public void addBox(int select, Color theColor, int sizex, int sizey,
            boolean selectable){
        addItem(RECTANGLE, select, theColor, sizex, sizey, 0, selectable);
    }

    //Make sure you create a new item or items might overlap each other
    public void addBorder(int select, Color theColor, int sizex, int sizey,
            boolean selectable){
        addItem(BORDER, select, theColor, sizex, sizey, 0, selectable);
    }

    //Make sure you create a new item or items might overlap each other
    public void addRoundBorder(int select, Color theColor, int sizex,
            int sizey, int arc, boolean selectable){
        addItem(RND_BORDER, select, theColor, sizex, sizey, arc, selectable);
    }

    public void clearAllItems(){
        menuItems.clear();
        select = 0;
    }

    @Override
    public void setOpacity(double opacity){
        if(opacity >= 0 && opacity <= 1)
            globalOpac = opacity;
    }

    public void setItemPosition(int index, int locx, int locy){
        setItemPosition(index, locx, locy, false);
    }
    public void setItemPosition(int index, int locx, int locy,
            boolean addPrev){
        if(index >= 0 && index < menuItems.size()){
            item = menuItems.get(index);
            if(addPrev)
                item.setFinalPosition((int)item.posx+locx,
                        (int)item.posy+locy);
            else
                item.setFinalPosition(locx, locy);
            menuItems.set(index, item);
        }
    }

    //Sets whether this item is drawable
    public void setItemDraw(int index, boolean draw){
        if(index >= 0 && index < menuItems.size()){
            item = menuItems.get(index);
            item.drawthis = draw;
            menuItems.set(index, item);
        }
    }

    @Override
    public void setOrigScreen(int scrX, int scrY) {
        super.setOrigScreen(scrX, scrY);
        for(int i = 0; i < menuItems.size(); i++)
            setOrigScreenSize(i, scrX, scrY);
    }

    public void setOrigScreenSize(int index, int origSizeX, int origSizeY){
        if(index >= 0 && index < menuItems.size()){
            item = menuItems.get(index);
            item.setOrigScreen(origSizeX, origSizeY);
            menuItems.set(index, item);
        }
    }

    //This changes how selected items react in a menu
    public void setItemChoice(int index, int choice){
        if(index >= 0 && index < menuItems.size()){
            item = menuItems.get(index);
            item.choice = choice;
            menuItems.set(index, item);
        }
    }

    public void setItemImage(int index, int itemIndex, String imgPath){
        if(index >= 0 && index < menuItems.size()){
            item = menuItems.get(index);
            setImage(imgPath);
            item.changePixImage(itemIndex, imgRef.getImage(0));
            menuItems.set(index, item);
        }
    }

    public ArrayList<MovingMenuItem> getItems(){
        return menuItems;
    }

    public boolean mouseSelect(int mx, int my){
        sx = 0;
        sy = 0;
        for(MovingMenuItem itm: menuItems){
            if(!itm.drawthis)
                continue;

            if(itm.selectable && select != itm.select){
                sx = itm.sizex;
                sy = itm.sizey;
                if(sx*sy == 0){
                    sx = itm.imgRef.getX(0);
                    sy = itm.imgRef.getY(0);
                }

                if(mx*scalex > itm.posx+posx &&
                        mx*scalex < itm.posx+posx+sx){
                    if(my*scaley > itm.posy+posy &&
                            my*scaley < itm.posy+posy+sy){
                        select = itm.select;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);
    }


    @Override
    public void render(Graphics g){
        for(MovingMenuItem itm: menuItems){
            //Checks if this item should be drawn
            if(!itm.drawthis)
                continue;

            switch(itm.index){
                case REGULAR:
                   //This draws picture items to the screen
                    itm.changeAll(select == itm.select, globalOpac);
                    setImage(imgRef.getImage(0));
                    if(itm.theColor == null)
                        g.drawImage(imgRef.getSlickImage(1),
                                (int)((posx+itm.posx)*scalex),
                            (int)((posy+itm.posy)*scaley));
                    else
                        g.drawImage(imgRef.getSlickImage(1),
                                (int)((posx+itm.posx)*scalex),
                            (int)((posy+itm.posy)*scaley),
                            imgRef.getColor(itm.shadow));
                    break;
                default:
                    if(select == itm.select || !itm.selectable){
                        if(itm.theColor != null)
                            g.setColor(imgRef.getColor(itm.shadow));
                        if(itm.index == RECTANGLE)
                            g.fillRect((int)((posx+itm.posx)*scalex),
                            (int)((posy+itm.posy)*scaley),
                                    (int)(itm.sizex*scalex),
                                    (int)(itm.sizey*scaley));
                        else if(itm.index == ROUND_BOX)
                            g.fillRoundRect((int)((posx+itm.posx)*scalex),
                            (int)((posy+itm.posy)*scaley),
                                    (int)(itm.sizex*scalex),
                                (int)(itm.sizey*scaley), (int)(itm.arc*scalex));
                        else if(itm.index == BORDER)
                            g.drawRect((int)((posx+itm.posx)*scalex),
                            (int)((posy+itm.posy)*scaley),
                                    (int)(itm.sizex*scalex),
                                    (int)(itm.sizey*scaley));
                        else if(itm.index == RND_BORDER)
                            g.drawRoundRect((int)((posx+itm.posx)*scalex),
                            (int)((posy+itm.posy)*scaley),
                                    (int)(itm.sizex*scalex),
                                (int)(itm.sizey*scaley),
                                (int)(itm.arc*scalex));
                    }
            }
        }
    }

    private void addItem(int index, int select, Color theColor,
            int sizex, int sizey, int arc, boolean selectable){
        item.index = index;
        item.select = select;
        item.theColor = theColor;
        item.selectable = selectable;
        item.sizex = sizex;
        item.sizey = sizey;
        item.arc = arc;
        if(index != REGULAR)
            item.pixPart = null;
        menuItems.add(item);
    }
}
