package com.client.state;

import com.client.logic.input.Controls;
import com.client.menu.GUI.tools.PixAnimate;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

import com.client.tools.ImgLibrary;
import com.client.tools.TextImgLibrary;
import org.newdawn.slick.Image;

/**
 * InGameState.java
 *
 * This class starts up a Slick screen.
 *
 * @author Crecen
 */
public class InGameState extends SlickScreen{
    private final double BASE = 16;

    private ImgLibrary imgSort;
    private TextImgLibrary textSort;
    private Image textImg;
    private PixAnimate testMap;

    public InGameState(){
        testMap = new PixAnimate();
        testMap.BASE = (int)BASE;
        testMap.addBuildingChange("resources/image/plugin/PlayerBuilding.png");
        testMap.addUnitChange("resources/image/plugin/PlayerUnit.png");
        testMap.loadData();
    }

    @Override
    public void init() {
        imgSort = new ImgLibrary();
        imgSort.setImageSize(640, 480);
        imgSort.setPixelChange(new Color(160, 160, 160),  new Color(255, 0, 0));
        imgSort.setPixelChange(new Color(128, 128, 128),  new Color(150, 0, 0));
        imgSort.addImage("resources/image/menu/background1.png");

        textSort = new TextImgLibrary();
        textSort.addImage("resources/image/menu/smallAlpha.png");
        textSort.addAllCapitalLetters(textSort.getImage(0), "", 6, 5, 0);
        textSort.addLetter('-', textSort.getImage(0), "", 6, 5, 29);
        textSort.addLetter('\'', textSort.getImage(0), "", 6, 5, 28);
        textSort.addLetter(',', textSort.getImage(0), "", 6, 5, 27);
        textSort.addLetter('.', textSort.getImage(0), "", 6, 5, 26);
        textSort.setString("WELCOME TO TACTIC WARS", "", 0, 0, 0, 0);
        textImg = textSort.getSlickTextImage("TITLE");
      

        for(int i = 0; i < 20*(32/BASE); i++){
            for(int j = 0; j < 8*(32/BASE); j++){
                testMap.addImgPart("FOREST", 0, 0, (int)(32*(BASE/32)*i),
                        (int)(-32*(BASE/32)+(j*64*(BASE/32))));
                testMap.addImgPart("PLAIN", 0, 0, (int)(32*(BASE/32)*i),
                        (int)(j*64*(BASE/32)));
            }
        }
        for(int i = 0; i < 20*(32/BASE); i++){
           for(int j = 0; j < 16*(32/BASE); j++){
                testMap.addImgPart("INFT", i, 3,
                        (int)((32*(BASE/32)*i)-16*(BASE/32)),
                        (int)((32*(BASE/32)*j)-16*(BASE/32)));
            }
        }//*/
    }

    @Override
    public void render(Graphics g) {
        testMap.render(g, scr_sysTime);
    }
    
    @Override
    public void update(int timePassed) {
        if(Controls.isUpClicked() ||
           Controls.isDownClicked() ||
           Controls.isLeftClicked() ||
           Controls.isRightClicked() ||
           Controls.isActionClicked() ||
           Controls.isCancelClicked())
                System.out.println("GAME ACTION: ");
    }

    //This is to quickly switch screens using F1 and F2 for testing
    @Override
    public void keyPressed(int key, char c) {
        if(key == 59)
            scr_switch.add(scr_ID-1);
        else if(key == 60)
            scr_switch.add(scr_ID+1);
    }
}
