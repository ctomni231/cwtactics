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

    public MenuDraw(int maxItems, int spacing,
            int locx, int locy, double speed){
        menu = new PixVertMenu(locx, locy, spacing, speed);
        dfltColors = new Color[]{new Color(128, 128, 128),
        new Color(160, 160, 160)};
        chngColors = new Color[]{new Color(200, 200, 200),
        new Color(255, 255, 255)};
        menu.setMaxItems(maxItems);
    }

    public void init(String[] info, String[] infoTxt,
            String arrowRef, TextImgLibrary tempAlpha){
        ImgLibrary tempImg = new ImgLibrary();
        text = infoTxt;

        tempImg.addImage(arrowRef);
        menu.setArrow(tempImg.getSlickImage(arrowRef));

        for(int i = 0; i < info.length; i++){
            tempImg.addImage(setWordImage(info[i], tempAlpha));
            for(int j = 0; j < dfltColors.length; j++)
                tempImg.setPixelChange(dfltColors[j], chngColors[j]);
            tempImg.addImage(setWordImage(info[i], tempAlpha));

            menu.createNewItem(0, 5, 0);
            menu.addVertBox(i, new Color(Color.darkGray.getRed(),
                Color.darkGray.getGreen(),
                Color.darkGray.getBlue(), 127), 640, 7, true);

            menu.createNewItem(10, 0, 0);
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
