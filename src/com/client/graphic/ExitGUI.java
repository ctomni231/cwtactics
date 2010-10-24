package com.client.graphic;

import com.jslix.system.SlixLibrary;
import com.jslix.tools.MouseHelper;
import com.jslix.tools.TextImgLibrary;
import com.client.graphic.tools.MovingMenu;
import com.client.input.Controls;
import com.client.input.KeyControl;
import com.jslix.tools.ImgLibrary;
import java.awt.Color;

/**
 * ExitGUI.java
 *
 * This handles the GUI by helping draw an exit screen for the menu
 * class.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.12.10
 */
public class ExitGUI extends MovingMenu{

    private Color[] dfltColors;//Default colors for the letters
    private Color[] chngColors;//Colors to change the letters to
    private String[] exitData;//A list of text pretaining to the menu
    private int sizex;//The width of the exit window
    private int sizey;//The height of the exit window
    private int x;//Holds the original screen width
    private int y;//Holds the original screen height
    private String alpha;//Holds the path to the alpha text picture
    private MouseHelper helper;//Regulates the mouse focus
    private int change;//Tracks the menu change for the menu
    private int[] colors;//Integer representation of the multple colors

    /**
     * This class displays an exit window with two options
     * @param alphaRef The path to the alpha text file
     * @param data Text pertaining to the exit menu
     * @param locx The x-axis location of the exit window
     * @param locy The y-axis location of the exit window
     * @param speed How quickly the exit window will move
     */
    public ExitGUI(String alphaRef, String[] data,
            int locx, int locy, double speed){
        super(locx, locy, speed);
        active = false;
        alpha = alphaRef;
        helper = new MouseHelper();
        dfltColors = new Color[]{new Color(128, 128, 128),
        new Color(160, 160, 160)};
        chngColors = new Color[]{new Color(200, 200, 200),
        new Color(255, 255, 255)};
        exitData = data;
        sizex = 100;
        sizey = 100;
        select = -1;
        change = 0;
    }

    /**
     * This gets the beginning size of the window
     * @param scrX The current window width
     * @param scrY The current window height
     */
    @Override
    public void setOrigScreen(int scrX, int scrY) {
        super.setOrigScreen(scrX, scrY);
        x = scrX;
        y = scrY;
    }


    /**
     * This sets up the GUI of the exit screen
     */
    @Override
    public void init() {
        ImgLibrary tempImg = new ImgLibrary();
        tempImg.addImage(getTextImg(alpha, exitData[0]));
        tempImg.addImage(getTextImg(alpha, exitData[1]));
        tempImg.addImage(getTextImg(alpha, exitData[2]));

        sizex = tempImg.getX(0)+20;
        sizey = tempImg.getY(0)+10+tempImg.getY(1)+20;

        createNewItem(0,0,0);
        addRoundBox(0, imgRef.getColor(Color.LIGHT_GRAY, 127),
                sizex, sizey, 10, false);
        createNewItem(5,5,0);
        addRoundBox(0, imgRef.getColor(Color.DARK_GRAY, 127),
                sizex-10, sizey-10, 10, false);
        createNewItem(10, 10, 0);
        addImagePart(getTextImg(alpha, exitData[0]), 0.7);
        addMenuItem(0, false);
        createNewItem(10, 10+tempImg.getY(0)+10, 0);
        addImagePart(getTextImg(alpha, exitData[1]), 0.7);
        addImagePart(getTextImg(alpha, exitData[1],
                dfltColors, chngColors), 0.7);
        addMenuItem(1, true);
        createNewItem(10+tempImg.getX(0)-tempImg.getX(2),
                10+tempImg.getY(0)+10, 0);
        addImagePart(getTextImg(alpha, exitData[2]), 0.7);
        addImagePart(getTextImg(alpha, exitData[2],
                dfltColors, chngColors), 0.7);
        addMenuItem(-1, true);

        setFinalPosition((int)((x-sizex)/2), (int)((y-sizey)/2));
    }

    /**
     * This completely controls graphics updates for the menu
     * @param width The current width of the window
     * @param height The current height of the window
     * @param sysTime The system time in milliseconds
     * @param mouseScroll The mouse scroll wheel value
     */
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll){
    	super.update(width, height, sysTime, mouseScroll);
    	if(helper.getMouseLock())
    		helper.setMouseRelease(KeyControl.getMouseX(), 
    			KeyControl.getMouseY());
    }

    /**
     * This function gets when the menu option changes
     * @return whether the menu option changed (true) or not (false)
     */
    public boolean getMenuChange(){
        if(change != select){
            change = select;
            return true;
        }
        return false;
    }

    /**
     * This function gets the help text for display
     * @return The String representing the help text
     */
    public String getHelpText(){
        return (select == 1) ? exitData[3] : exitData[4];
    }

    /**
     * THis function controls column selection and user button actions
     * for the exit screen
     * @param column The current column this screen is associated with
     * @param mouseScroll The current mouse scroll wheel value
     * @return The altered column variable
     */
    public int control(int column, int mouseScroll){
        if(KeyControl.isUpClicked() ||
            KeyControl.isDownClicked() ||
            KeyControl.isLeftClicked() ||
            KeyControl.isRightClicked()){
            helper.setMouseLock(KeyControl.getMouseX(),
        			KeyControl.getMouseY());
            select *= -1;
        }
        
        if(!helper.getMouseLock())
            mouseSelect(KeyControl.getMouseX(), KeyControl.getMouseY());
        
        if(mouseScroll != 0){
            helper.setMouseLock(KeyControl.getMouseX(),
        			KeyControl.getMouseY());
            select *= -1;
        }

        if(Controls.isActionClicked()){
            if(select == 1)
                SlixLibrary.removeAllScreens();
            else{
                if(column == -1)    column = 0;
                else                column = 1;
            }
        }else if(Controls.isCancelClicked()){
            if(column == -1)    column = 0;
            else                column = 1;
        }

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
        txtLib.addAllCapitalLetters(txtLib.getImage(0), "", 6, 5, 0);
        txtLib.addLetter('-', txtLib.getImage(0), "", 6, 5, 29);
        txtLib.addLetter('\'', txtLib.getImage(0), "", 6, 5, 28);
        txtLib.addLetter(',', txtLib.getImage(0), "", 6, 5, 27);
        txtLib.addLetter('.', txtLib.getImage(0), "", 6, 5, 26);
        txtLib.setString(text, "", 0, 0, 0, 0);
        if(fromColor != null && toColor != null){
            for(int j = 0; j < fromColor.length; j++)
                txtLib.setPixelChange(fromColor[j], toColor[j]);           
        }
        txtLib.addImage(text, txtLib.getTextImage());
        return txtLib.getImage(text);
    }

    /**
     * This function gets a list of color changes for menu items
     * @param colorPath The path to the color list
     */
    public void setColorPath(String colorPath){
        ImgLibrary imgLib = new ImgLibrary();
        imgLib.addImage(colorPath);
        colors = imgLib.getPixels(0);
    }

    /**
     * This function changes the color based on the menu colors
     * @param index Which index of colors to use for this menu
     */
    public void setColor(int index){
        index *= 16;
        resetColor();
        if(index >= 0 && index < colors.length){
            addColor(new Color(160, 160, 160),
                    new Color(colors[index+9+3]));
            addColor(new Color(128, 128, 128),
                    new Color(colors[index+9+4]));
            addColor(new Color(255, 255, 255),
                    new Color(colors[index+9+0]));
            addColor(new Color(200, 200, 200),
                    new Color(colors[index+9+2]));
            setItemColor(0, imgRef.getColor(
                    new Color(colors[index+9+1]), 127));
            setItemColor(1, imgRef.getColor(
                    new Color(colors[index+9+5]), 127));
            resetScreen();
        }else{
            setItemColor(0, imgRef.getColor(Color.LIGHT_GRAY, 127));
            setItemColor(1, imgRef.getColor(Color.DARK_GRAY, 127));
            resetScreen();
        }
    }
}
