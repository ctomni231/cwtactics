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
 * ExitGUI
 *
 * This handles the GUI by helping draw an exit screen for the menu
 * class.
 *
 * @author Crecen
 */
public class ExitGUI extends MovingMenu{

    private Color[] dfltColors;
    private Color[] chngColors;
    private String[] exitData;
    private int sizex;
    private int sizey;
    private int x;
    private int y;
    private String alpha;
    private MouseHelper helper;
    private int type;
    private int change;
    private int[] colors;

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
        type = 0;
        change = 0;
    }
    
    public void setType(int type){
    	this.type = type;
    }

    @Override
    public void setOrigScreen(int scrX, int scrY) {
        super.setOrigScreen(scrX, scrY);
        x = scrX;
        y = scrY;
    }


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
    
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll){
    	super.update(width, height, sysTime, mouseScroll);
    	if(helper.getMouseLock())
    		helper.setMouseRelease(KeyControl.getMouseX(), 
    			KeyControl.getMouseY());
    }

    public boolean getMenuChange(){
        if(change != select){
            change = select;
            return true;
        }
        return false;
    }

    public String getHelpText(){
        if(select == 1)
            return exitData[3];
        else
            return exitData[4];
    }

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

        if(type == 1){
            if(Controls.isActionClicked()){
                if(select == 1)    SlixLibrary.removeAllScreens();
                else               column = 0;
            }else if(Controls.isCancelClicked()){
                column = 0;
            }
        }else{
            if(Controls.isActionClicked()){
                if(select == 1) //Some other menu action
                    SlixLibrary.removeAllScreens();
                else{
                    if(column == -1)    column = 0;
                    else                column = 1;
                }
            }else if(Controls.isCancelClicked()){
                if(column == -1)    column = 0;
                else                column = 1;
            }
        }

        return column;
    }

    private java.awt.Image getTextImg(String alpha, String text){
        return getTextImg(alpha, text, null, null);
    }
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

    public void setColorPath(String colorPath){
        ImgLibrary imgLib = new ImgLibrary();
        imgLib.addImage(colorPath);
        colors = imgLib.getPixels(0);
    }

    public void setColor(int index){
        index *= 16;
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
        }
    }
}
