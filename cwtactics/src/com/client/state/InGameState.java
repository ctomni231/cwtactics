package com.client.state;

import java.util.ArrayList;

import com.client.logic.command.MessageServer;
import com.client.logic.command.commands.ingame.CheckTrigger;
import com.client.logic.input.Controls;
import com.client.menu.GUI.tools.PixAnimate;
import com.client.model.object.Game;

import com.client.model.object.Map;
import com.client.model.object.Tile;
import org.newdawn.slick.Animation;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;
import org.newdawn.slick.SlickException;

import com.client.tools.ImgLibrary;
import com.client.tools.TextImgLibrary;
import com.system.ID;

import com.system.data.Data;
import org.newdawn.slick.Image;

/**
 * InGameState.java
 *
 * This class starts up a Slick screen.
 *
 * @author Crecen
 */
public class InGameState extends SlickScreen{
    private final double BASE = 32;

    private ImgLibrary imgSort;
    private TextImgLibrary textSort;
    private Image textImg;
    private PixAnimate testMap;

    private int enterState;

   private Animation[][] list = new Animation[40][32];
   private ArrayList<Animation> list2 = new ArrayList<Animation>();

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

        Map game = Game.getMap();

        System.out.println("MAP SIZE: "+game.getSizeX()+","+game.getSizeY());
        Tile[][] gameMap = game.getField();
        
        for(int i = 0; i < gameMap.length; i++){
            for(int j = 0; j < gameMap[i].length; j++){
                System.out.println("MAP("+i+","+j+"):"+
                        gameMap[i][j].sheet().getName());
                testMap.addImgPart(
                  gameMap[i][j].sheet().getName().toUpperCase(),
                  0, 0, (int)(i*(BASE+1)), (int)(j*(BASE+1)));
                if(gameMap[i][j].getUnit() != null){
                    System.out.println("UNIT("+i+","+j+"):"+
                        gameMap[i][j].getUnit().sheet().getName());
                    testMap.addImgPart(
                        gameMap[i][j].getUnit().sheet().getName().toUpperCase(),
                        1, 0,
                        (int)((i*(BASE+1))-(BASE/2)),
                        (int)((j*(BASE+1)+(BASE+1))-(BASE/2)));
                }
            }
        }

        //for(int i = 0; i < 20*(32/BASE); i++){
        //    for(int j = 0; j < 8*(32/BASE); j++){
        //        testMap.addImgPart("FOREST", 0, 0, (int)(32*(BASE/32)*i),
        //                (int)(-32*(BASE/32)+(j*64*(BASE/32))));
        //        testMap.addImgPart("PLAIN", 0, 0, (int)(32*(BASE/32)*i),
         //               (int)(j*64*(BASE/32)));
         //   }
        //}

        //for(int i = 0; i < 20*(32/BASE); i++){
        //    for(int j = 0; j < 16*(32/BASE); j++){
        // 	   testMap.addImgPart("INFT", i, 0,
        //                 (int)((32*(BASE/32)*i)-16*(BASE/32)),
        //                 (int)((32*(BASE/32)*j)-16*(BASE/32)));
        //     }
        // }

        //Image img = null;
        //try {
		//	img = new Image( "resources/image/plugin/AW1_INFT.png");
		//} catch (SlickException e) {
			// TODO Auto-generated catch block
		//	e.printStackTrace();
		//}
        //for(int i = 0; i < 40; i=i+2){
        //    for(int j = 0; j < 32; j++){
        //    	list[i][j] = new Animation( new Image[]{ img.getSubImage( 0 , 0 ,32 , 32),img.getSubImage( 32 , 32 ,32 , 32),img.getSubImage( 64 , 64 ,32 , 32) }, 250);
        //    	list[i+1][j] = new Animation( new Image[]{ img.getSubImage( 96 , 96 ,32 , 32),img.getSubImage( 128 , 128 ,32 , 32),img.getSubImage( 160 , 160 ,32 , 32) }, 250);
        //        list2.add(list[i][j]);
        //        list2.add(list[i+1][j]);
        //     }
        // }


    }

    @Override
    public void render(Graphics g) {
        testMap.render(g, scr_sysTime);
    }

    //This is to quickly switch screens using F1 and F2 for testing
    @Override
    public void keyPressed(int key, char c) {
        if(key == 59)
            enterState = (scr_ID-1);
        else if(key == 60)
            enterState = (scr_ID+1);
    }



    /*
     *
     * WORK METHODS
     * ************
     *
     */

    @Override
    /**
     * Updates the inGame logic after
     * a render call.
     */
    public void update(int timePassed) {

    	if( checkupState( enterState ) ) return;

    	updateUI(timePassed);
    }

    /**
     * Checks the state variable and changes the state
     * if necessary.
     */
    private boolean checkupState( int state ){

		if( state != -1 ){
			scr_switch.add( enterState );
			enterState = -1;
			return true;
		}
		return false;
	}

    /**
     * React on user inputs and changes logic
     * to fit with the user inputs.
     */
    private void updateUI( int timePassed ){

    	if(Controls.isUpClicked() ||
    	   Controls.isDownClicked() ||
    	   Controls.isLeftClicked() ||
    	   Controls.isRightClicked() ||
    	   Controls.isActionClicked() ||
    	   Controls.isCancelClicked()) System.out.println("GAME ACTION: ");
    }



}
