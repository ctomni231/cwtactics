package com.cwt.graphic.tools;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;
import java.util.ArrayList;
import org.newdawn.slick.Graphics;

/**
 * VerticalMenu.java
 *
 * A remix of PixVertMenu, this class organizes a regular menu class into
 * one that positions items in a vertical menu.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.18.10
 */

public class VerticalMenu extends MovingMenu{

    private ArrayList<Integer> vertPos;//Position of Menu Items
    private ArrayList<Integer> vertPart;//Reference to Menu Item
    private ArrayList<Integer> curList;//Current visible List of Menu Items
    private int maxPos;//How many positions there are total
    private int maxItems;//The max number of items to show on the screen
    private int arrowloc;//Used to justify the arrows to a position
    private int arrowPos;//Used to store where the arrow is located
    private int itemMin;//Used to track where you are in the vertical menu
    private int change;//Used to track the vertical menu shifts
    private int spacingY;//The amount of space between each item
    private boolean generate;//Redoes the vertical menu if true
    private double lx;//Used to keep track of justifying picture text
    public int track;//Tracks the position of the menu

    /**
     * The vertical menu class expands the functionality of the Moving
     * Menu class to create a vertical menu of items. It still allows you
     * to use the old methods as well making it very versatile.
     * @param locx The x-axis location of the menu
     * @param locy The y-axis location of the menu
     * @param speed The movement speed of the menu
     */
    public VerticalMenu(int locx, int locy, double speed){
        super(locx, locy, speed);
        vertPos = new ArrayList<Integer>();
        vertPart = new ArrayList<Integer>();
        curList = new ArrayList<Integer>();
        maxItems = 10;
        itemMin = 0;
        maxPos = 0;
        spacingY = 0;
        generate = true;
        lx = 0;
        track = -100;
    }

    /**
     * This function adds a vertical menu item to the menu list. This item
     * lines itself into a vertical menu when added
     * @param position The menu position of this menu item
     * @param select The select index this item interacts with
     * @param selectable Whether the user can interact with the menu item
     */
    public void addVertItem(int position, int select, boolean selectable){
        addVertical(position);
        addMenuItem(select, selectable);
    }

    /**
     * This function tells you how many Vertical items are currently stored
     * @return The number of Vertical items stored
     */
    public int getVertSize(){
        return vertPart.size();
    }

    /**
     * This returns the current menu item of a vertical menu
     * @return The current menu item of a vertical menu
     */
    public int getVertIndex(){
        return curList.isEmpty() ? 0: curList.get(track);
    }

    /**
     * This function adds a rounded filled box that follows the rules
     * of a vertical menu
     * @param position The menu position of this menu item
     * @param select The select index associated with this item
     * @param theColor The color of this rounded box
     * @param sizex The width of this rounded box
     * @param sizey The height of this rounded box
     * @param arc The arc length of this rounded box
     * @param selectable Whether the user can interact with the menu item
     */
    public void addVertRound(int position, int select, Color theColor,
            int sizex, int sizey, int arc, boolean selectable){
        addVertical(position);
        addRoundBox(select, theColor, sizex, sizey, arc, selectable);
    }

    /**
     * This function adds a rounded border that follows the rules of
     * a vertical menu
     * @param position The menu position of this menu item
     * @param select The select index associated with this item
     * @param theColor The color of this rounded border
     * @param sizex The width of this rounded border
     * @param sizey The height of this rounded border
     * @param arc The arc length of this rounded border
     * @param selectable Whether the user can interact with the menu item
     */
    public void addVertRoundBorder(int position, int select, Color theColor,
            int sizex, int sizey, int arc, boolean selectable){
        addVertical(position);
        addRoundBorder(select, theColor, sizex, sizey, arc, selectable);
    }

    /**
     * This function adds a rectangle colored box that follows the rules
     * of a vertical menu
     * @param position The menu position of this menu item
     * @param select The select index associated with this item
     * @param theColor The color of this rectangle
     * @param sizex The width of this rectangle
     * @param sizey The height of this rectangle
     * @param selectable Whether the user can interact with the menu item
     */
    public void addVertBox(int position, int select, Color theColor,
            int sizex, int sizey, boolean selectable){
        addVertical(position);
        addBox(select, theColor, sizex, sizey, selectable);
    }

    //Adds a border pinned to the vertical menu
    /**
     * This function adds a rectangular colored border that follows the rules
     * of a vertical menu
     * @param position The menu position of this menu item
     * @param select The select index associated with this item
     * @param theColor The color of this rectangle border
     * @param sizex The width of this rectangle border
     * @param sizey The height of this rectangle border
     * @param selectable Whether the user can interact with the menu item
     */
    public void addVertBorder(int position, int select, Color theColor,
            int sizex, int sizey, boolean selectable){
        addVertical(position);
        addBorder(select, theColor, sizex, sizey, selectable);
    }

    /**
     * This function sets the amount of height between each menu item
     * @param spacing The distance between each menu item
     */
    public void setSpacingY(int spacing){
        if(spacing > 0)
            spacingY = spacing;
    }

    /**
     * This function sets the max menu items visible in the screen
     * at any given time. Other items will be selectable via scrolling.
     * @param change How many items are visible in the screen
     */
    public void setMaxItems(int change){
        if(change > 0)
            maxItems = change;
    }

    /**
     * This function sets the arrow picture arrow up for scrolling, it
     * then flips the picture to attain the other directions.
     * @param arrow The file path to the arrow picture
     */
    public void setArrowUp(String arrow){
        setArrowUp(arrow, null, null);
    }

    /**
     * This function sets the arrow picture arrow up for scrolling, it
     * then flips the picture to attain the other directions.
     * @param arrow The file path to the arrow picture
     * @param fromColor The default colors for the arrow picture
     * @param toColor The colors to change the arrow picture to
     */
    public void setArrowUp(String arrow, Color[] fromColor, Color[] toColor){
        arrowPos = imgRef.length();
        if(fromColor != null && toColor != null){
            for(int j = 0; j < fromColor.length; j++)
                imgRef.setPixelChange(fromColor[j], toColor[j]);
        }
        imgRef.addImage(arrow);
        imgRef.setFlipY();
        imgRef.addImage(imgRef.getImage(arrowPos));
    }

    //Changes the position of a vertical menu item (negative= non-display)
    /**
     * This changes the order of the menu items according to the position
     * number. The lower the number, the higher the position. Negative
     * position numbers cause the item not to appear in the menu list.
     * @param index The position of the item in the menu list
     * @param position The place in the list you want the item to display
     */
    public void changePosition(int index, int position){
        if(index >= 0 && index < allItems.length){
            for(int i = 0; i < vertPart.size(); i++){
                if(vertPart.get(i) == index)
                    vertPos.set(i, position);
            }
        }
        if(position > maxPos)
            maxPos = position;
        generate = true;
    }

    /**
     * This function swaps two items positions in the menu list
     * @param index The index location of the menu item
     * @param change The new location of the menu item
     */
    @Override
    public void swapItems(int index, int change) {
        super.swapItems(index, change);
        for(int i = 0; i < vertPart.size(); i++){
            if(vertPart.get(i) == index)
                vertPart.set(i, change);
            else if(vertPart.get(i) == change)
                vertPart.set(i, index);
        }
        generate = true;
    }

    /**
     * This function deletes an item you specify
     * @param index The index location of the menu item
     */
    @Override
    public void deleteItem(int index) {
        super.deleteItem(index);
        for(int i = 0; i < vertPart.size(); i++){
            if(vertPart.get(i) == index){
                vertPart.remove(i);
                vertPos.remove(i);
                return;
            }
        }
        generate = true;
    }

    /**
     * This function moves the track cursor one down in the list. This is
     * a complementary function to changePosition, and will make sure the
     * menu scrolls correctly in order.
     */
    public void moveDown(){
        track++;
        if(track >= curList.size())
            track = 0;
        for(int i = 0; i < vertPart.size(); i++){
            if(vertPos.get(i) == curList.get(track)){
                select = allItems[vertPart.get(i)].select;
                return;
            }
        }
    }

    /**
     * This function moves the track cursor one up in the list. This is
     * a complementary function to changePosition, and will make sure the
     * menu scrolls correctly in order.
     */
    public void moveUp(){
        track--;
        if(track < 0)
            track = curList.size()-1;
        for(int i = 0; i < vertPart.size(); i++){
            if(vertPos.get(i) == curList.get(track)){
                select = allItems[vertPart.get(i)].select;
                return;
            }
        }
    }

    /**
     * This function sets the track cursor according to a select value.
     * This is a complementary function to changePosition, and will make
     * sure the menu scrolls correctly in order.
     * @param sel The select value to set the track value to
     */
    public void setSelect(int sel){
        select = sel;
        setSelect();
    }

    /**
     * This function justifies the menu to a pixel position according to
     * 3 popular justification methods. 'L'- left, 'R'-right, and
     * 'C'-center justify. Can be done at any time.
     * @param locx The pixel location to justify the vertical menu to
     * @param arrlocx The location of the up and down arrows
     * @param justify The justification 'L', 'R', or 'C'
     */
    public void setJustify(double locx, int arrlocx, char justify){
        arrowloc = arrlocx;
        
        for(int index: vertPart){
            lx = locx+fposx;
            if(allItems[vertPart.get(index)].refPath.length > 0){
                if(justify == 'r' || justify == 'R'){
                    lx -= imgRef.getX(allItems[
                            vertPart.get(index)].getPicture(false));
                }else if(justify == 'c' || justify == 'C'){
                    lx -= (double)(imgRef.getX(allItems[vertPart.get(index)]
                            .getPicture(false))/2.0);
                }
            }
            if(allItems[vertPart.get(index)].id == 0)
                super.setItemPosition(index, 
                        (int)(lx-allItems[vertPart.get(index)].posx), 0, true);
            else
                super.setItemPosition(index, (int)fposx, 0, true);
        }
        lx = locx+fposx;
        generate = true;
    }

    /**
     * This function updates the visuals of the moving image
     * @param width The current width of the screen
     * @param height The current height of the screen
     * @param sysTime The system time in milliseconds
     * @param mouseScroll The mouse scroll wheel value
     */
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);
        if(generate)
            generateMenu();
    }

    /**
     * This controls how the mouse interacts with the selection of the
     * vertical menu items. Works only for the pictures
     * @param mx The x-axis position of the mouse
     * @param my The y-axis position of the mouse
     * @return Whether the mouse is overlapping a menu item(T) or not(F)
     */
    @Override
    public boolean mouseSelect(int mx, int my){
    	for(MenuItem itm: allItems){
            if(!itm.drawthis)
                continue;
            if(itm.id == REGULAR && itm.selectable && select != itm.select){
            	if(itm.sizex == 0 && itm.sizey == 0){
            		itm.sizex = imgRef.getX(itm.getPicture(false));
            		itm.sizey = imgRef.getY(itm.getPicture(false));
            	}
            	if(mx > (int)((itm.posx+posx)*scalex) &&
            			mx < (int)((itm.posx+posx+itm.sizex)*scalex)){
                    if(my > (int)((itm.posy+posy)*scaley) &&
                    		my < (int)((itm.posy+posy+itm.sizey)*scaley)){

                        select = itm.select;
                        break;
                    }
                }
            }
    	}
    	return mouseSelect();
    }

    /**
     * This controls how the mouse interacts with the selection of the menu
     * items. This counts all items in the menu as selectable
     * @param mx The x-axis position of the mouse
     * @param my The y-axis position of the mouse
     * @return Whether the mouse is overlapping a menu item(T) or not(F)
     */
    public boolean mouseAllSelect(int mx, int my){
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
                        break;
                    }
                }
            }
    	}
    	return mouseSelect();
    }

    /**
     * This draws a menu using the graphics object
     * @param g The Java2D graphics object
     * @param dthis The Java2D Component object
     */
    @Override
    public void render(Graphics2D g, Component dthis) {
        super.render(g, dthis);
        if(curList.size() > maxItems){
            updateList();
            if(itemMin > 0){
                if(opacity >= 0 && opacity < 1)
                    g.setComposite(AlphaComposite.getInstance(
                	AlphaComposite.SRC_OVER, (float)opacity));
                g.drawImage(imgResize.getImage(arrowPos),
                    (int)((lx+arrowloc)*scalex),
                    (int)(posy*scaley), dthis);
                if(opacity >= 0 && opacity < 1)
                    	g.setComposite(AlphaComposite.SrcOver);
            }
            if(itemMin+maxItems < curList.size()){
                if(opacity >= 0 && opacity < 1)
                    g.setComposite(AlphaComposite.getInstance(
                	AlphaComposite.SRC_OVER, (float)opacity));
                g.drawImage(imgResize.getImage(arrowPos+1),
                    (int)((lx+arrowloc)*scalex),
                    (int)((posy+(spacingY*(maxItems+1)))*scaley), dthis);
                if(opacity >= 0 && opacity < 1)
                    	g.setComposite(AlphaComposite.SrcOver);
            }
        }
    }

    /**
     * This draws the menu using a graphics object
     * @param g The Slick2D Graphics object
     */
    @Override
    public void render(Graphics g) {
        super.render(g);
        if(curList.size() > maxItems){
            updateList();
            if(itemMin > 0){
                if(opacity >= 0 && opacity <= 1)
                    imgResize.getSlickImage(0).setAlpha((float)opacity);
                g.drawImage(imgResize.getSlickImage(0),
                        (int)((lx+arrowloc)*scalex),
                        (int)(posy*scaley));
            }
            if(itemMin+maxItems < curList.size()){
                if(opacity >= 0 && opacity <= 1)
                    imgResize.getSlickImage(1).setAlpha((float)opacity);
                g.drawImage(imgResize.getSlickImage(1),
                        (int)((lx+arrowloc)*scalex),
                        (int)((posy+(spacingY*(maxItems+1)))*scaley));
            }
        }
    }

    /**
     * This controls how the vertical menu deals with mouse selections
     * @return Whether a menu item was selected(t) or not(f)
     */
    private boolean mouseSelect(){
        for(int i = 0; i < vertPart.size(); i++){
            if(allItems[vertPart.get(i)].select == select){
                for(int j = 0; j < curList.size(); j++){
                    if(vertPos.get(i) == curList.get(j)){
                        track = j;
                        return true;
                    }
                }
            }
        }
        track = -1;
        return false;
    }

    /**
     * This function updates the display and list of menu items
     */
    private void updateList(){
        change = 0;
        while(track >= itemMin+maxItems){
            itemMin++;
            change++;
        }
        while(track < itemMin){
            itemMin--;
            change--;
        }
        
        if(change != 0)
            generateMenu(change);
    }

    /**
     * THis function controls the scrolling the list when the mouse is
     * hovering above or below the list
     * @param mx The x-axis location of the mouse
     * @param my The y-axis location of the mouse
     */
    public void mouseScroll(int mx, int my){
        if(itemMin > 0 && my > posy && my < posy+spacingY)
            moveUp();
        if(itemMin+maxItems <= maxPos && my > posy+(spacingY*(maxItems+1)) &&
                my < posy+(spacingY*(maxItems+1))+spacingY)
            moveDown();
    }

    /**
     * This function changes the look of the menu when you scroll up or
     * down the list
     * @param change The location of the menu list
     */
    private void generateMenu(int change){
        for(int index: vertPart){
            super.setItemPosition(index, 0, -(change*spacingY), true);
            super.setItemDraw(index, (vertPos.get(index) >= itemMin &&
                vertPos.get(index) < itemMin+maxItems));
        }
    }

    /**
     * This function creates a whole new menu and sets up all the visuals
     * for the menu
     */
    private void generateMenu(){
        curList.clear();
        for(int i = 0; i <= maxPos; i++){
            if(vertPos.contains(i))
                curList.add(i);
        }
        for(int i = 0; i < curList.size(); i++){
            for(int j = 0; j < vertPart.size(); j++){
                if(vertPos.get(j) < 0){
                    if(allItems[vertPart.get(j)].posy < (i+1)*spacingY)
                        setItemPosition(vertPart.get(j), 0,
                                (i+1)*spacingY, true);
                    setItemDraw(vertPart.get(j), false);
                }else if(vertPos.get(j) == curList.get(i)){
                    if(allItems[vertPart.get(j)].posy < (i+1)*spacingY)
                        setItemPosition(vertPart.get(j), 0,
                                (i+1)*spacingY, true);
                    setItemDraw(vertPart.get(j), i < maxItems);
                }
            }
        }

        generate = false;
        for(int i = 0; i < vertPart.size(); i++){
            if(select == allItems[vertPart.get(i)].select &&
                    allItems[vertPart.get(i)].drawthis)
                return;
        }
        if(select <= 0){
            track = 0;
            for(int i = 0; i < vertPart.size(); i++){
                if(vertPos.get(i) == curList.get(track)){
                    select = allItems[vertPart.get(i)].select;
                    break;
                }
            }
        }
    }

    /**
     * This function is used to set up all the vertical item references
     * @param position The position of this vertical item
     */
    private void addVertical(int position){
        vertPart.add(allItems.length);
        vertPos.add(position);
        if(position > maxPos)
            maxPos = position;
    }

    /**
     * This function is used to set the track value to the select index
     * value. If track is negative, the select value isn't binded to
     * any item.
     */
    private void setSelect(){
        for(int i = 0; i < vertPart.size(); i++){
            if(allItems[vertPart.get(i)].select == select){
                for(int j = 0; j < curList.size(); j++){
                    if(vertPos.get(i) == curList.get(j))
                        track = j;
                }
            }
        }
        track = -1;
    }
}
