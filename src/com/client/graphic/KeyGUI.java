package com.client.graphic;

import com.client.graphic.tools.VerticalMenu;
import com.client.input.KeyControl;
import com.jslix.tools.TextImgLibrary;
import java.awt.Color;

/**
 * KeyGUI.java
 *
 * This class controls the key configure for the entire game for both Java
 * and Slick Screens. This is fully geared toward changing keyboard actions.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.16.10
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

    public KeyGUI(String alphaPath, String numberPath, 
    		String arrowPath, int spacing,
    		int locx, int locy, double speed){
        super(locx, locy, speed);
        alpha = alphaPath;
        numbers = numberPath;
        arrow = arrowPath;
        setSpacingY(spacing);
        setMaxItems(MAX_ITEMS);
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
        	while(option[i].length() <= length)
        		option[i] += " ";
        	option[i] += "-";
        }    
        
        //createNewItem(10, 10, 1);
        //addImagePart(null, opacity);
    	for(int i = 0; i < MAX_ITEMS; i++){
    		System.out.println("OPTION: "+option[i]);
            createNewItem(0, 5, 0);
            addVertBox(i, i, imgRef.getColor(Color.DARK_GRAY, 127),
                    640, 7, true);
            createNewItem(20, 0, 0);
            addImagePart(getTextImg(alpha, option[i]), 0.7);
            addImagePart(getTextImg(alpha, option[i],
                dfltColors, chngColors), 0.7);
            addVertItem(i, i, true);
        }
    }

    public int control(int column, int mouseScroll){
        if(KeyControl.isActionClicked() ||
                KeyControl.isCancelClicked())
            column = 1;
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
}
