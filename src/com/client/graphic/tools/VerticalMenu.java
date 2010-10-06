package com.client.graphic.tools;

import java.awt.Color;
import java.util.ArrayList;

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
    private int spacingY;//The amount of space between each item
    private boolean generate;//Redoes the vertical menu if true

    public int track;//Tracks the position of the menu

    public VerticalMenu(int locx, int locy, double speed){
        super(locx, locy, speed);
        vertPos = new ArrayList<Integer>();
        vertPart = new ArrayList<Integer>();
        curList = new ArrayList<Integer>();
        maxItems = 1;
        maxPos = 0;
        spacingY = 0;
        generate = true;
    }

    //Adds a Vertical Item to the Menu
    public void addVertItem(int position, int select, boolean selectable){
        addVertical(position);
        addMenuItem(select, selectable);
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

    //CHanges the position of a vertical menu item (negative= non-display)
    public void changePosition(int index, int position){
        if(index >= 0 && index < allItems.length){
            for(int i = 0; i < vertPart.size(); i++){
                if(vertPart.get(i) == index)
                    vertPos.set(i, position);
            }
        }
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

    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);
        if(generate)
            generateMenu();
    }


    //Generates a new Menu
    private void generateMenu(){
        curList.clear();
        for(int i = 0; i < maxPos; i++){
            if(vertPos.contains(i))
                curList.add(i);
        }
        for(int i = 0; i < vertPart.size(); i++){
            track = vertPos.get(i);
            if(curList.contains(track)){
                setItemPosition(track, 0, -(i*spacingY));
                setItemDraw(track, i < maxItems);
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
}
