package com.client.graphic;

import com.client.graphic.tools.VerticalMenu;
import com.client.input.KeyControl;
import com.jslix.tools.TextImgLibrary;
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
 * @version 10.21.10
 * @todo TODO Finish commenting this class
 */

public class KeyGUI extends VerticalMenu{

	public final int MAX_ITEMS = 6;//The maximum items a vertical menu has
	
    private String[] option;//Keeps a list of keyboard action commands
    private String[] help;//Keeps the help associated with the actions
    private String arrow;//Holds the path to the arrow picture file
    private String alpha;//The path to the alpha letters
    private String numbers;//The path to the numbers text
    private Color[] dfltColors;//Default colors for the letters
    private Color[] chngColors;//Colors to change the letters to
    private int length;
    private String label;
    private VerticalMenu keyItems;
    private int space;

    public KeyGUI(String alphaPath, String numberPath, 
    		String arrowPath, int spacing,
    		int locx, int locy, double speed){
        super(locx, locy, speed);
        keyItems = new VerticalMenu(locx, locy, speed);
        alpha = alphaPath;
        numbers = numberPath;
        arrow = arrowPath;
        space = spacing;
        setSpacingY(space);
        keyItems.setSpacingY(space);
        setMaxItems(MAX_ITEMS);
        keyItems.setMaxItems(MAX_ITEMS);
        dfltColors = new Color[]{new Color(128, 128, 128),
        new Color(160, 160, 160)};
        chngColors = new Color[]{new Color(200, 200, 200),
        new Color(255, 255, 255)};
        length = 0;
    }
    
    public void init(String[] keyItem, String[] keyHelp){
    	option = new String[keyItem.length];
    	
        for(int i = 0; i < MAX_ITEMS; i++){
        	if(length < keyItem[i].length())
        		length = keyItem[i].length();
        }
        
        for(int i = 0; i < keyItem.length; i++){
        	option[i] = keyItem[i];
        	if(i < MAX_ITEMS){
        		while(option[i].length() <= length)
        			option[i] += " ";
        		option[i] += "-";
        	}
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
    	addImagePart(getTextImg(alpha, option[6]), 0.7);
        addImagePart(getTextImg(alpha, option[7],
                 dfltColors, chngColors), 0.7);
        addMenuItem(6, true);
        
        for(int i = 0; i < KeyControl.Keys.values().length; i++){
            keyItems.createNewItem(30, 0, 0);
            keyItems.addImagePart(getTextImg(alpha,
                    KeyEvent.getKeyText(KeyControl.Keys.values()[i]
                    .javaValue()).toUpperCase()), 0.7);
            keyItems.addVertItem(i, i, false);
        }

        keyItems.setJustify(600, 0, 'R');
        
        keyItems.createNewItem(0, (MAX_ITEMS+2)*space+5, 0);
    	keyItems.addBox(6, imgRef.getColor(Color.DARK_GRAY, 127),
                640, 7, false);
        keyItems.createNewItem(30, (MAX_ITEMS+2)*space, 0);
        keyItems.addImagePart(getTextImg(alpha, option[8],
                dfltColors, chngColors), 0.7);
        keyItems.addMenuItem(6, false);
        
        keyItems.setItemDraw(MAX_ITEMS, false);
        keyItems.setItemDraw(MAX_ITEMS+1, false);
        
    	for(int i = 0; i < MAX_ITEMS; i++){
            createNewItem(0, 5, 0);
            addVertBox(i, i, imgRef.getColor(Color.DARK_GRAY, 127),
                    640, 7, true);
            createNewItem(30, 0, 0);
            addImagePart(getTextImg(alpha, option[i]), 0.7);
            addVertItem(i, i, true);
            keyItems.createNewItem(30, 0, 0);
            keyItems.addImagePart(getTextImg(alpha, option[i],
                    dfltColors, chngColors), 0.6);
            keyItems.addMenuItem(i, true);
            
            keyItems.setItemPosition(i+MAX_ITEMS+2, 0, space*(i+1), true);
            keyItems.setItemChoice(i+MAX_ITEMS+2, -1);
        }        
    }

    public int control(int column, int mouseScroll){
    	keyItems.select = select;
        if(KeyControl.isActionClicked() ||
                KeyControl.isCancelClicked())
            column = 1;
        
        mouseSelect(KeyControl.getMouseX(), KeyControl.getMouseY());
        
        if(KeyControl.isUpClicked())
        	select--;
        
        if(KeyControl.isDownClicked())
        	select++;
        
        if(select < 0)			select = MAX_ITEMS;
        else if(select > MAX_ITEMS)	select = 0;
        
        return column;
    }

    /**
     * This function turns a String into a picture
     * @param alpha The path to the alpha file
     * @param text The text to convert into a picture
     * @return An image representing the text
     */
    private java.awt.Image getTextImg(String alpha, String text){
        return getTextImg(alpha, text, null, null);
    }

    /**
     * This function turns a String into a picture
     * @param alpha The path to the alpha file
     * @param text The text to convert into a picture
     * @param fromColor A list of default colors
     * @param toColor A list of recolor values
     * @return An image representing the text
     */
    private java.awt.Image getTextImg(String alpha, String text,
            Color[] fromColor, Color[] toColor){
        TextImgLibrary txtLib = new TextImgLibrary();
        txtLib.addImage(alpha);
        txtLib.addImage(numbers);
        txtLib.addAllCapitalLetters(txtLib.getImage(0), "", 6, 5, 0);
        txtLib.addLetter('-', txtLib.getImage(0), "", 6, 5, 29);
        txtLib.addLetter('\'', txtLib.getImage(0), "", 6, 5, 28);
        txtLib.addLetter(',', txtLib.getImage(0), "", 6, 5, 27);
        txtLib.addLetter('.', txtLib.getImage(0), "", 6, 5, 26);

        txtLib.addAllNumbers(txtLib.getImage(1), "", 10, 1, 0);
        txtLib.setString(text, "", 0, 0, 0, 0);
        if(fromColor != null && toColor != null){
            for(int j = 0; j < fromColor.length; j++)
                txtLib.setPixelChange(fromColor[j], toColor[j]);
        }
        txtLib.addImage(text, txtLib.getTextImage());
        return txtLib.getImage(text);
    }

    @Override
    public void setOrigScreen(int scrX, int scrY) {
        super.setOrigScreen(scrX, scrY);
        keyItems.setOrigScreen(scrX, scrY);
    }


    @Override
    public void render(Graphics2D g, Component dthis) {
        super.render(g, dthis);
        keyItems.render(g, dthis);
    }


    @Override
    public void render(Graphics g) {
        super.render(g);
        keyItems.render(g);
    }


    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);
        keyItems.update(width, height, sysTime, mouseScroll);
    }
}
