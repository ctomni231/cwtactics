package com.client.graphic;

import com.client.graphic.tools.VerticalMenu;
import com.client.input.KeyControl;
import com.jslix.tools.TextImgLibrary;
import java.awt.Color;

/**
 * MenuGUI.java
 * 
 * This handles the GUI by drawing a menu for the screen
 *
 * @author Crecen
 */

public class MenuGUI extends VerticalMenu{

    private Color[] dfltColors;
    private Color[] chngColors;
    private String alpha;
    private int[] selectID;
    private String[] text;
    private String[] help;

    public MenuGUI(String alphaPath, int spacing,
            int locx, int locy, double speed){
        super(locx, locy, speed);       
        alpha = alphaPath;
        dfltColors = new Color[]{new Color(128, 128, 128),
        new Color(160, 160, 160)};
        chngColors = new Color[]{new Color(200, 200, 200),
        new Color(255, 255, 255)};
        setSpacingY(spacing);
        //setMaxItems(8);
    }

    public void initMenu(String[] mainOption, String[] mainID,
            String[] mainText, String[] mainHelp){
        help = mainHelp;
        text = mainText;
        selectID = new int[mainID.length];
        for(int i = 0; i < mainID.length; i++)
            selectID[i] = Integer.parseInt(mainID[i]);

        //for(int i = 0; i < mainOption.length; i++){
        for(int i = 0; i < 10; i++){
            createNewItem(0, 5, 0);
            addVertBox(i, i, imgRef.getColor(Color.DARK_GRAY, 127),
                    640, 7, false);
            createNewItem(10, 0, 0);
            addImagePart(getTextImg(alpha, mainOption[0]), 0.7);
            addImagePart(getTextImg(alpha, mainOption[0],
                dfltColors, chngColors), 0.7);
            addVertItem(i, i, true);
        }
    }

    @Override
    public void init(){

    }

    public int control(int column){
        if(KeyControl.isActionClicked() ||
                KeyControl.isCancelClicked()){
            column = 0;
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

}
