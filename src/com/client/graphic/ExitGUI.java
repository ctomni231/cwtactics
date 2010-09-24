package com.client.graphic;

import com.jslix.tools.TextImgLibrary;
import com.client.graphic.tools.MovingMenu;
import com.client.input.KeyControl;
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
    private int sizex;
    private int sizey;
    private String alpha;

    public ExitGUI(String alphaRef, int locx, int locy, double speed){
        super(locx, locy, speed);
        alpha = alphaRef;
        dfltColors = new Color[]{new Color(128, 128, 128),
        new Color(160, 160, 160)};
        chngColors = new Color[]{new Color(200, 200, 200),
        new Color(255, 255, 255)};
        sizex = 100;
        sizey = 100;
    }

    @Override
    public void init() {
        createNewItem(0,0,0);
        addRoundBox(0, imgRef.getColor(Color.LIGHT_GRAY, 127),
                sizex, sizey, 10, false);
        createNewItem(5,5,0);
        addRoundBox(0, imgRef.getColor(Color.DARK_GRAY, 127),
                sizex-10, sizey-10, 10, false);
        createNewItem(10, 10, 0);
        addImagePart(getTextImg(alpha, "EXIT"), 0.7);
        addMenuItem(0, false);
    }

    //TODO (JSLIX) Find a better way to implement control system
    public int control(){
        if(KeyControl.isActionClicked()){
            return -1;
        }else if(KeyControl.isCancelClicked()){
            return 0;
        }

        return -1;
    }

    private java.awt.Image getTextImg(String alpha, String text){
        TextImgLibrary txtLib = new TextImgLibrary();
        txtLib.addImage(alpha);
        txtLib.addAllCapitalLetters(txtLib.getImage(0), "", 6, 5, 0);
        txtLib.addLetter('-', txtLib.getImage(0), "", 6, 5, 29);
        txtLib.addLetter('\'', txtLib.getImage(0), "", 6, 5, 28);
        txtLib.addLetter(',', txtLib.getImage(0), "", 6, 5, 27);
        txtLib.addLetter('.', txtLib.getImage(0), "", 6, 5, 26);
        txtLib.setString(text, "", 0, 0, 0, 0);
        return txtLib.getTextImage();
    }
}
