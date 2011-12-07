package com.cwt.graphic;

import com.cwt.graphic.tools.TextPix;
import com.cwt.graphic.tools.VerticalMenu;
import com.cwt.io.KeyControl;
import com.cwt.system.jslix.tools.MouseHelper;
import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;
import java.awt.event.KeyEvent;
import org.newdawn.slick.Graphics;

/**
 * KeyGUI.java
 *
 * This class controls the key configure for the entire game for both Java
 * and Slick Screens. This is fully geared toward changing keyboard actions.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 04.03.11
 */

public class KeyGUI extends VerticalMenu{

    public final int MAX_ITEMS = 6;//The maximum items a vertical menu has
    public final int DELAY = 30;//The delay time of keyboard scrolling
    public final int SCROLL_SPEED = 2;//How fast the menu scrolls
	
    private String[] help;//Keeps the help associated with the actions
    private Color[] dfltColors;//Default colors for the letters
    private Color[] chngColors;//Colors to change the letters to
    private double counter;//This controls the opacity of the image
    private MouseHelper helper;//Regulates the mouse focus
    private VerticalMenu keyItems;//Holds the keys associated with the actions
    private int space;//Holds the amount of spacing between each picture
    private boolean keySelect;//How this class reacts to key presses
    private boolean curSelect;//The current keySelect of the window
    private boolean haltPress;//This keeps the user from pressing anything
    private int change;//Holds whether the menu selection has changed
    private int[] colors;//Integer representation of the multiple colors
    private int keyCount;//This helps regulate scrolling for keyboard
    private int[] keys;//This stores the keys for the key changes
    private String backHelp;//This stores the help value for back

    /**
     * This class completely controls editing all the keyboard actions for
     * the game. Each key is forced to be different.
     * @param alphaPath The path to the alphabet image file
     * @param numberPath The path to the number image file
     * @param spacing The amount of spacing between each menu list item
     * @param locx The x-axis location of the menu
     * @param locy The y-axis location of the menu
     * @param speed The movement speed of this menu
     */
    public KeyGUI(String help, int spacing, int locx, int locy, double speed){
        super(locx, locy, speed);
        keys = new int[KeyControl.Keys.values().length];
        keyItems = new VerticalMenu(locx, locy, speed);
        space = spacing;
        change = 0;
        setSpacingY(space);
        keyItems.setSpacingY(space);
        setMaxItems(MAX_ITEMS);
        keyItems.setMaxItems(MAX_ITEMS);
        keyItems.setOpacity(0.6);
        helper = new MouseHelper();
        helper.setScrollIndex(SCROLL_SPEED);
        dfltColors = new Color[]{new Color(128, 128, 128),
        new Color(160, 160, 160)};
        chngColors = new Color[]{new Color(200, 200, 200),
        new Color(255, 255, 255)};
        counter = 0;
        keySelect = false;
        curSelect = false;
        haltPress = false;
        keyCount = 0;
        backHelp = help;
    }

    /**
     * This function initializes the graphics used for the menu class.
     * @param keyItem The list of text used as references for the keys
     * @param keyHelp The list of help text associated with the options
     */
    public void init(String[] keyItem, String[] keyHelp){
        help = keyHelp;
    	int length = 0;
    	
        for(int i = 0; i < MAX_ITEMS; i++){
            if(length < keyItem[i].length())
                length = keyItem[i].length();
        }
        
        for(int i = 0; i < MAX_ITEMS; i++){
            while(keyItem[i].length() <= length)
                keyItem[i] += " ";
            keyItem[i] += "-";
        }    

        createNewItem(20,0,0);
        addRoundBox(0, imgRef.getColor(Color.LIGHT_GRAY, 127),
                590, (MAX_ITEMS+4)*20-5, 10, false);
        createNewItem(25,5,0);
        addRoundBox(0, imgRef.getColor(Color.DARK_GRAY, 127),
                590-10, (MAX_ITEMS+4)*20-15, 10, false);
        
        createNewItem(0, (MAX_ITEMS+2)*space+5, 0);
    	addBox(6, imgRef.getColor(Color.DARK_GRAY, 127),
                640, 7, true);
    	createNewItem(30, (MAX_ITEMS+2)*space, 0);
    	addImagePart(TextPix.getTextImg(keyItem[6]), 0.7);
        addImagePart(TextPix.getTextImg(keyItem[7],
                 dfltColors, chngColors), 0.7);
        addMenuItem(6, true);
        
        for(int i = 0; i < KeyControl.Keys.values().length; i++){
            keyItems.createNewItem(30, 0, 0);
            keyItems.addImagePart(TextPix.getTextImg(
                    KeyEvent.getKeyText(KeyControl.Keys.values()[i]
                    .javaValue()).toUpperCase()), 0.7);
            keyItems.addVertItem(i, i, false);
        }

        keyItems.setJustify(600, 0, 'R');
        
        keyItems.createNewItem(0, (MAX_ITEMS+2)*space+5, 0);
    	keyItems.addBox(6, imgRef.getColor(Color.DARK_GRAY, 127),
                640, 7, false);
        keyItems.createNewItem(30, (MAX_ITEMS+2)*space, 0);
        keyItems.addImagePart(TextPix.getTextImg(keyItem[8],
                dfltColors, chngColors), 0.7);
        keyItems.addMenuItem(6, false);
        
        keyItems.setItemDraw(MAX_ITEMS, false);
        keyItems.setItemDraw(MAX_ITEMS+1, false);
        
    	for(int i = 0; i < MAX_ITEMS; i++){
            createNewItem(0, 5, 0);
            addVertBox(i, i, imgRef.getColor(Color.DARK_GRAY, 127),
                    640, 7, true);
            createNewItem(30, 0, 0);
            addImagePart(TextPix.getTextImg(keyItem[i]), 0.7);
            addVertItem(i, i, true);
            keyItems.createNewItem(30, 0, 0);
            keyItems.addImagePart(TextPix.getTextImg(keyItem[i],
                    dfltColors, chngColors), -1);
            keyItems.addMenuItem(i, true);
            
            keyItems.setItemPosition(i+MAX_ITEMS+2, 0, space*(i+1), true);
            keyItems.setItemChoice(i+MAX_ITEMS+2, -1);
        }

        select = 6;
    }

    /**
     * This function gets all the user defined actions and uses them to
     * control the functions within the menu.
     * @param column The current column this menu is associated with
     * @param mouseScroll The current mouse scroll wheel
     * @return The new column value if it was changed
     */
    public int control(int column, int mouseScroll){
        if(KeyControl.isUpDown() || KeyControl.isDownDown() ||
            KeyControl.isLeftDown() || KeyControl.isRightDown()){
            helper.setMouseLock(KeyControl.getMouseX(),
                    KeyControl.getMouseY());
        }

        if(curSelect != keySelect){
            change = -1;
            setItemDraw(2, curSelect);
            setItemDraw(3, curSelect);
            keyItems.setItemDraw(MAX_ITEMS, keySelect);
            keyItems.setItemDraw(MAX_ITEMS+1, keySelect);
            haltPress = true;
            curSelect = keySelect;
        }
        return curSelect ? keyControl(column) :
            basicControl(column, mouseScroll);
    }

    /**
     * This function deals with the key commands when you are not dealing
     * with assigning a new key to an item
     * @param column The current column this menu is associated with
     * @param mouseScroll The current mouse scroll wheel
     * @return The new column value if it was changed
     */
    public int basicControl(int column, int mouseScroll){
        keyItems.select = select;

        if(KeyControl.isUpClicked())
            select--;

        if(KeyControl.isDownClicked())
            select++;

        if(keyCount > DELAY && helper.getScroll())
            select--;
        else if(keyCount < -DELAY && helper.getScroll())
            select++;

        if(KeyControl.isUpDown())
            keyCount++;
        else if(KeyControl.isDownDown())
            keyCount--;
        else
            keyCount = 0;

        if(!helper.getMouseLock())
            mouseAllSelect(KeyControl.getMouseX(), KeyControl.getMouseY());

        if(mouseScroll != 0){
            helper.setMouseLock(KeyControl.getMouseX(),
                    KeyControl.getMouseY());
            select += mouseScroll;
        }

        if(select < 0)			select = MAX_ITEMS;
        else if(select > MAX_ITEMS)	select = 0;

        if(KeyControl.isActionClicked()){
            if(select == 6){
                storeKeys();
                column = 1;
            }else
                keySelect = true;
        }

        if(KeyControl.isCancelClicked())
            column = 1;

        return column;
    }

    /**
     * This function deals with the key commands when you are dealing
     * with assigning a new key to an item
     * @param column The current column this menu is associated with
     * @return The new column value if it was changed
     */
    public int keyControl(int column){
        if(KeyControl.getLastKey() == -1)
            haltPress = false;

        if(haltPress)
            return column;

        if(!KeyControl.isMouseFocused() && KeyControl.getLastKey() != -1){
            int key = KeyControl.getLastKey();

            //If keys are matching, it switches the keys
            for(int i = 0; i < keys.length; i++){
                if(key == keys[i])
                    keys[i] = keys[select];
            }

            //Sets the value of the key
            keys[select] = key;
 
            //Changes the visuals of all keys
            displayKeys();

            KeyControl.isUpClicked();
            KeyControl.isDownClicked();
            
            keySelect = false;
        }

        if(KeyControl.isActionClicked() ||
            KeyControl.isCancelClicked())
            keySelect = false;

        return column;
    }
    
    /**
     * This function keeps track of whether a menu option changes
     * @return whether a menu option changes(true) or not(false)
     */
    public boolean getMenuChange(){
        if(change != select){
            change = select;
            return true;
        }
        return false;
    }

    /**
     * This function keeps track of the scroll bar display
     * @return Whether it is okay to display the scroll bar(T) or not{F)
     */
    public boolean getScrollDisplay(){
        return (select != MAX_ITEMS) ? !keySelect : !match();
    }

    /**
     * This function gets the current scrolling text for the item selected
     * @return The current scrolling text
     */
    public String getScrollText(){
        return (select != 6) ? help[MAX_ITEMS] : help[MAX_ITEMS+1];
    }

    /**
     * This function gets the current help bar text for the item selected
     * @return The current help bar text
     */
    public String getHelpText(){
        return keySelect ? help[MAX_ITEMS+2] : (select != 6) ? help[select] :
            backHelp;
    }

    /**
     * This function updates all the graphical elements in the menu
     * @param width The current width of the screen
     * @param height The current height of the screen
     * @param sysTime The current system time in milliseconds
     * @param mouseScroll The current mouse scroll wheel value
     */
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);
        keyItems.update(width, height, sysTime, mouseScroll);
        if(helper.getMouseLock())
    		helper.setMouseRelease(KeyControl.getMouseX(),
    			KeyControl.getMouseY());
        if(keySelect){
            counter = (((double)sysTime/1000)-.5);
            if(counter > 1 || counter < -1)
                counter = 1;
            if(counter < 0)
                counter *= -1;
            keyItems.setOpacity(counter);
        }else
            keyItems.setOpacity(0.6);

        helper.setMouseControl(sysTime);
    }

    /**
     * This function gets a list of color changes for menu items
     * @param colorPath The path to the color list
     */
    public void setColorPath(String colorPath){
        colors = TextPix.getImgPixels(colorPath);
    }

    /**
     * This function changes the color based on the menu colors
     * @param index Which index of colors to use for this menu
     */
    public void setColor(int index){
        index *= 16;
        resetColor();
        if(index >= 0 && index < colors.length){
            addColor(new Color(160, 160, 160), new Color(colors[index+9+3]));
            addColor(new Color(128, 128, 128), new Color(colors[index+9+4]));
            addColor(new Color(255, 255, 255), new Color(colors[index+9+0]));
            addColor(new Color(200, 200, 200), new Color(colors[index+9+2]));
        }
        setItemColor(0, imgRef.getColor(index >= 0 && index < colors.length ?
            new Color(colors[index+9+1]) : Color.LIGHT_GRAY, 127));
        setItemColor(1, imgRef.getColor(index >= 0 && index < colors.length ?
            new Color(colors[index+9+5]) : Color.DARK_GRAY, 127));
        for(int i = 0; i < getVertSize()+2; i+=2)
            setItemColor(2+i, imgRef.getColor(
                index >= 0 && index < colors.length ?
                new Color(colors[index+9+5]) : Color.DARK_GRAY, 127));
        resetScreen();
    }

    /**
     * This function removes all color changing variables from the list
     */
    @Override
    public void resetColor() {
        super.resetColor();
        keyItems.resetColor();
    }

    /**
     * This is used to refresh the visibility of all items
     */
    @Override
    public void resetScreen() {
        super.resetScreen();
        keyItems.resetScreen();
    }

    /**
     * This function is used to stretch images to the window size
     * @param scrX The width of the window
     * @param scrY The height of the window
     */
    @Override
    public void setOrigScreen(int scrX, int scrY) {
        super.setOrigScreen(scrX, scrY);
        keyItems.setOrigScreen(scrX, scrY);
    }

    /**
     * This draws a menu using the graphics object
     * @param g The Java2D graphics object
     * @param dthis The Java2D Component object
     */
    @Override
    public void render(Graphics2D g, Component dthis) {
        super.render(g, dthis);
        keyItems.render(g, dthis);
    }

    /**
     * This draws the menu using a graphics object
     * @param g The Slick2D Graphics object
     */
    @Override
    public void render(Graphics g) {
        super.render(g);
        keyItems.render(g);
    }

    /**
     * This function sets the color of the menu item
     * @param index The current position of the item in the list
     * @param theColor The color to change the item to
     */
    @Override
    public void setItemColor(int index, Color theColor) {
        super.setItemColor(index, theColor);
        keyItems.setItemColor(index, theColor);
    }

    /**
     * This function changes image colors when displayed to the window
     * @param fromColor The default color RGB to change
     * @param toColor The color to change the default RGB to
     */
    @Override
    public void addColor(Color fromColor, Color toColor) {
        super.addColor(fromColor, toColor);
        keyItems.addColor(fromColor, toColor);
    }
    
    /**
     * This function takes the current key presses and stores them to an
     * array that holds the changes.
     */
    public void getKeys(){    
        for(int i = 0; i < keys.length; i++){
             keys[i] = KeyControl.isSlickWindow() ?
                 KeyControl.Keys.values()[i].slickValue() :
                 KeyControl.Keys.values()[i].javaValue();
        }
        displayKeys();
    }

    /**
     * This function displays the keys in an orderly fashion
     */
    private void displayKeys(){
        for(int i = 0; i < KeyControl.Keys.values().length; i++)
            keyItems.setItemImage(i, 0, TextPix.getTextImg(
                KeyEvent.getKeyText(KeyControl.isSlickWindow() ?
                KeyControl.getKeyConversion(keys[i]) : keys[i]).
                toUpperCase()));
        keyItems.setJustify(600, 0, 'R');
    }

    /**
     * This function stores the new key presses within the main system
     */
    private void storeKeys(){
        for(int i = 0; i < keys.length; i++){
            if(KeyControl.isSlickWindow())
                KeyControl.Keys.values()[i].setValues(keys[i],
                    KeyControl.getKeyConversion(keys[i]));
            else
                KeyControl.Keys.values()[i].setValues(
                    KeyControl.getKeyConversion(keys[i]), keys[i]);
        }
    }

    /**
     * This function checks to see if two distinct keys match
     * @return Whether the keys match (T) or not (F)
     */
    private boolean match(){
        for(int i = 0; i < keys.length; i++){
            if(keys[i] != (KeyControl.isSlickWindow() ?
                    KeyControl.Keys.values()[i].slickValue() :
                    KeyControl.Keys.values()[i].javaValue()))
                return false;
        }
        return true;
    }
}
