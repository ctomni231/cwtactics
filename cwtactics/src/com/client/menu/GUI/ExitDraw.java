package com.client.menu.GUI;

import com.client.menu.GUI.tools.PixMenu;
import com.client.tools.ImgLibrary;
import com.client.tools.TextImgLibrary;
import java.awt.Image;
import org.newdawn.slick.Color;

/**
 * Helps draw an exit screen for the menu class
 * @author Crecen
 */
public class ExitDraw {
    private Color[] dfltColors;
    private Color[] chngColors;
    private int sizex;
    private int sizey;
    public PixMenu exitMenu;

    public ExitDraw(int locx, int locy, double speed){
        exitMenu = new PixMenu(locx, locy, speed);
        dfltColors = new Color[]{new Color(128, 128, 128),
        new Color(160, 160, 160)};
        chngColors = new Color[]{new Color(200, 200, 200),
        new Color(255, 255, 255)};
    }

    public int getX(){
        return sizex;
    }

    public int getY(){
        return sizey;
    }

    public void init(String[] info, TextImgLibrary tempAlpha){
        ImgLibrary tempImg = new ImgLibrary();

        for(int i = 0; i < info.length; i++){
            tempImg.addImage(setWordImage(info[i], tempAlpha));
            if(i > 0){
                for(int j = 0; j < dfltColors.length; j++)
                    tempImg.setPixelChange(dfltColors[j], chngColors[j]);
                tempImg.addImage(setWordImage(info[i], tempAlpha));
            }
        }

        sizex = tempImg.getX(0)+20;
        sizey = tempImg.getY(0)+10+tempImg.getY(1)+20;

        exitMenu.createNewItem(0, 0, 0);
        exitMenu.addRoundBox(0, new Color(Color.lightGray.getRed(),
                Color.lightGray.getGreen(), Color.lightGray.getBlue(),
                127), sizex, sizey, 10, false);
        exitMenu.createNewItem(5, 5, 0);
        exitMenu.addRoundBox(0, new Color(Color.darkGray.getRed(),
                Color.darkGray.getGreen(),
                Color.darkGray.getBlue(), 127), tempImg.getX(0)+10,
                tempImg.getY(0)+10+tempImg.getY(1)+10, 10, false);
        exitMenu.createNewItem(10, 10, 0);
        exitMenu.addMenuImgPart(tempImg.getImage(0), "", 0.7);
        exitMenu.addMenuPart(0, false);
        exitMenu.createNewItem(10, 10+tempImg.getY(0)+10, 0);
        exitMenu.addMenuImgPart(tempImg.getImage(1), "", 0.7);
        exitMenu.addMenuImgPart(tempImg.getImage(2), "", 0.7);
        exitMenu.addMenuPart(1, true);
        exitMenu.createNewItem(10+tempImg.getX(0)-tempImg.getX(3),
                10+tempImg.getY(0)+10, 0);
        exitMenu.addMenuImgPart(tempImg.getImage(3), "", 0.7);
        exitMenu.addMenuImgPart(tempImg.getImage(4), "", 0.7);
        exitMenu.addMenuPart(-1, true);

    }

    public Image setWordImage(String display, TextImgLibrary tempAlpha){
        tempAlpha.setString(display, "", 0, 0, 0, 0);
        return tempAlpha.getTextImage();
    }
}
