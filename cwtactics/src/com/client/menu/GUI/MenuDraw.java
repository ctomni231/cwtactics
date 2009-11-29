package com.client.menu.GUI;

import com.client.menu.GUI.tools.PixVertMenu;
import com.client.tools.ImgLibrary;
import com.client.tools.TextImgLibrary;
import java.awt.Image;
import org.newdawn.slick.Color;

/**
 * This class draws the title screen menu
 * @author Crecen
 */
public class MenuDraw {
    private Color[] dfltColors;
    private Color[] chngColors;
    public PixVertMenu menu;
    private String[] text;
    private int index;
    private int sizex;
    private int sizey;

    public MenuDraw(int maxItems, int spacing,
            int locx, int locy, double speed){
        menu = new PixVertMenu(locx, locy, spacing, speed);
        dfltColors = new Color[]{new Color(128, 128, 128),
        new Color(160, 160, 160)};
        chngColors = new Color[]{new Color(200, 200, 200),
        new Color(255, 255, 255)};
        menu.setMaxItems(maxItems);
        index = 0;
        sizex = 0;
        sizey = 0;
    }

    public void setIndex(int newIndex){
        index = newIndex;
    }

    public int getSizeX(){
        return sizex;
    }

    public int getSizeY(){
        return sizey;
    }

    public void init(String[] info, String[] infoTxt,
            String arrowRef, TextImgLibrary tempAlpha){
        ImgLibrary tempImg = new ImgLibrary();
        text = infoTxt;

        tempImg.addImage(arrowRef);
        menu.setArrow(tempImg.getSlickImage(arrowRef));

        if(index == 1){
            int length = 0;
            for(String txt: info){
                if(length < txt.length())
                    length = txt.length();
            }
            sizex = 20+(tempAlpha.getX("A")*length);
            sizey = 20+(tempAlpha.getY("A")*info.length);
            menu.createNewItem(0, 0, 0);
            menu.addRoundBox(0, new Color(Color.darkGray.getRed(),
                    Color.darkGray.getGreen(), Color.darkGray.getBlue(),
                    127), sizex, sizey, 10, false);
            menu.createNewItem(5, 5, 0);
            menu.addRoundBox(0, new Color(Color.lightGray.getRed(),
                    Color.lightGray.getGreen(), Color.lightGray.getBlue(),
                    127), sizex-10, sizey-10, 10, false);
        }

        for(int i = 0; i < info.length; i++){
            tempImg.addImage(setWordImage(info[i], tempAlpha));
            for(int j = 0; j < dfltColors.length; j++)
                tempImg.setPixelChange(dfltColors[j], chngColors[j]);
            tempImg.addImage(setWordImage(info[i], tempAlpha));

            if(index == 1){
                menu.createNewItem(5, 8, 0);
                menu.addVertBox(i, new Color(Color.darkGray.getRed(),
                    Color.darkGray.getGreen(),
                    Color.darkGray.getBlue(), 127), 
                    sizex-10, 20, true);
                menu.createNewItem(10, 10, 0);
            }else{
                menu.createNewItem(0, 5, 0);
                menu.addVertBox(i, new Color(Color.darkGray.getRed(),
                    Color.darkGray.getGreen(),
                    Color.darkGray.getBlue(), 127), 640, 7, true);
                menu.createNewItem(10, 0, 0);
            }

            menu.addMenuImgPart(tempImg.getImage(1+(i*2)), "", 0.5);
            menu.addMenuImgPart(tempImg.getImage(2+(i*2)), "", 0.5);
            menu.addVertPart(i, true);
        }
    }

    public String getText(int index){
        return (index >= 0 && index < text.length) ?
              text[index]+"                                       " : "";
    }

    public Image setWordImage(String display, TextImgLibrary tempAlpha){
        tempAlpha.setString(display, "", 0, 0, 0, 0);
        return tempAlpha.getTextImage();
    }
}
