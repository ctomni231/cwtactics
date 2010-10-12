package com.client.graphic.tools;

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
 * @author Crecen
 */

//TODO (JSlix) Update and Render stuff galore to set up display.
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

    public VerticalMenu(int locx, int locy, double speed){
        super(locx, locy, speed);
        vertPos = new ArrayList<Integer>();
        vertPart = new ArrayList<Integer>();
        curList = new ArrayList<Integer>();
        maxItems = 1;
        itemMin = 0;
        maxPos = 0;
        spacingY = 0;
        generate = true;
        lx = 0;
    }

    //Adds a Vertical Item to the Menu
    public void addVertItem(int position, int select, boolean selectable){
        addVertical(position);
        addMenuItem(select, selectable);
    }

    //Returns how many Vertical Items are stored
    public int getVertSize(){
        return vertPart.size();
    }

    public int getVertIndex(){
        return curList.isEmpty() ? 0: curList.get(track);
    }

    //Adds a Round Filled Box pinned to the Vertical menu
    public void addVertRound(int position, int select, Color theColor,
            int sizex, int sizey, int arc, boolean selectable){
        addVertical(position);
        addRoundBox(select, theColor, sizex, sizey, arc, selectable);
    }

    //Adds a Round Border pinned to the Vertical menu
    public void addVertRoundBorder(int position, int select, Color theColor,
            int sizex, int sizey, int arc, boolean selectable){
        addVertical(position);
        addRoundBorder(select, theColor, sizex, sizey, arc, selectable);
    }

    //Adds a filled box pinned to the vertical menu
    public void addVertBox(int position, int select, Color theColor,
            int sizex, int sizey, boolean selectable){
        addVertical(position);
        addBox(select, theColor, sizex, sizey, selectable);
    }

    //Adds a border pinned to the vertical menu
    public void addVertBorder(int position, int select, Color theColor,
            int sizex, int sizey, boolean selectable){
        addVertical(position);
        addBorder(select, theColor, sizex, sizey, selectable);
    }

    //Sets the spacing for each item
    public void setSpacingY(int spacing){
        if(spacing > 0)
            spacingY = spacing;
    }

    //Sets how many items will be visible
    public void setMaxItems(int change){
        if(change > 0)
            maxItems = change;
    }

    public void setArrowUp(String arrow){
        setArrowUp(arrow, null, null);
    }
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

    public void setSelect(int sel){
        select = sel;
        setSelect();
    }

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
                super.setItemPosition(index, (int)lx,
                        (int)(allItems[vertPart.get(index)].posy));
        }
        lx = locx+fposx;
    }

    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);
        if(generate)
            generateMenu();
    }


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

    public void mouseScroll(int mx, int my){
        if(itemMin > 0 && my > posy-spacingY && my < posy)
            moveUp();
        if(itemMin+maxItems <= maxPos && my > posy+(spacingY*(maxItems+1)) &&
                my < posy+(spacingY*(maxItems+1))+spacingY)
            moveDown();
    }

    private void generateMenu(int change){
        for(int index: vertPart){
            super.setItemPosition(index, 0, -(change*spacingY), true);
            super.setItemDraw(index, (vertPos.get(index) >= itemMin &&
                vertPos.get(index) < itemMin+maxItems));
        }
    }
    //Generates a new Menu
    private void generateMenu(){
        curList.clear();
        for(int i = 0; i <= maxPos; i++){
            if(vertPos.contains(i))
                curList.add(i);
        }
        for(int i = 0; i < curList.size(); i++){
            track = curList.get(i);
            for(int j = 0; j < vertPart.size(); j++){
                if(vertPos.get(j) < 0){
                    setItemPosition(vertPart.get(j), 0, (i+1)*spacingY, true);
                    setItemDraw(vertPart.get(j), false);
                }else if(vertPos.get(j) == track){
                    setItemPosition(vertPart.get(j), 0, (i+1)*spacingY, true);
                    setItemDraw(vertPart.get(j), i < maxItems);
                }
            }
        }
        track = 0;
        generate = false;
    }

    //Used to set the vertical item references
    private void addVertical(int position){
        vertPart.add(allItems.length);
        vertPos.add(position);
        if(position > maxPos)
            maxPos = position;
    }

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
