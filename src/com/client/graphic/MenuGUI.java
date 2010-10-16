package com.client.graphic;

import com.client.graphic.tools.VerticalMenu;
import com.client.input.KeyControl;
import com.jslix.tools.ImgLibrary;
import com.jslix.tools.MouseHelper;
import com.jslix.tools.TextImgLibrary;
import java.awt.Color;

/**
 * MenuGUI.java
 * 
 * This handles the GUI by drawing a menu for the screen
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.12.10
 */

//TODO: Finish commenting this class
public class MenuGUI extends VerticalMenu{

    public final int MAX_ITEMS = 8;

    private Color[] dfltColors;
    private Color[] chngColors;
    private String alpha;
    private String arrow;
    private int[] selectID;
    private String[] text;
    private String[] help;
    private int[] colors;
    private int change;
    private MouseHelper helper;
    private int menuColumn;
    private int menuChange;
    private int factions;
    private int curFaction;

    public MenuGUI(String arrowPath, String alphaPath, int spacing,
            int locx, int locy, double speed){
        super(locx, locy, speed);       
        alpha = alphaPath;
        arrow = arrowPath;
        dfltColors = new Color[]{new Color(128, 128, 128),
        new Color(160, 160, 160)};
        chngColors = new Color[]{new Color(200, 200, 200),
        new Color(255, 255, 255)};
        setSpacingY(spacing);
        setMaxItems(MAX_ITEMS);
        helper = new MouseHelper();
        helper.setScrollIndex(2);
        change = 0;
        menuColumn = 0;
        menuChange = -1;
        factions = 0;
        curFaction = -1;
    }

    public void initMenu(String[] mainOption, String[] mainID,
            String[] mainText, String[] mainHelp){
        help = mainHelp;
        text = mainText;
        selectID = new int[mainID.length];
        for(int i = 0; i < mainID.length; i++)
            selectID[i] = Integer.parseInt(mainID[i]);

        for(int i = 0; i < mainOption.length; i++){
            createNewItem(0, 5, 0);
            addVertBox(i, selectID[i], imgRef.getColor(Color.DARK_GRAY, 127),
                    640, 7, true);
            createNewItem(10, 0, 0);
            addImagePart(getTextImg(alpha, mainOption[i]), 0.7);
            addImagePart(getTextImg(alpha, mainOption[i],
                dfltColors, chngColors), 0.7);
            addVertItem(i, selectID[i], true);
        }

        setArrowUp(arrow);
    }

    @Override
    public void init(){
        String[] temp = new String[]{ "VERSUS", "ONLINE",
        "CREATE MAP", "LOAD MAP", "MAP EDITOR", "KEY CONFIGURE",
        "CREDITS", "EXIT"};

        String[] tempText = new String[]{
            "- Play a multiplayer game against your friends -",
            "- Turn the tides of war on a friend through online battle -",
            "- Create the playfield of your imagination -",
            "- Load a map from the archive -",
            "- Edit an existing map or make changes to a new map -",
            "- Change the keyboard settings here -",
            "- See the creators of the game -",
            "- Leave. We see how it is :( -"
        };

        String[] helpText = new String[]{
            "VERSUS - Start a quick game versus a friend offline",
            "ONLINE - Start a online server game with a friend",
            "CREATE MAP - Create a new map for the game",
            "LOAD MAP - Load an existing map from the archive",
            "MAP EDITOR - Edit an existing map from the archive",
            "KEY CONFIGURE - Set up the keyboard settings",
            "CREDITS - See the creators of Custom Wars Tactics",
            "EXIT - Ends this game session"
        };

        String[] ID = new String[]{
            "-2","-3","-4","-5","-6","-7","3","2"
        };

        initMenu(temp, ID, tempText, helpText);

        //setJustify(635, 0, 'R');
        //setJustify(320, 0, 'C');
        //setJustify(5, 0, 'L');

        //changePosition(2, -7);
        //changePosition(3, -7);

        //changePosition(8, -7);
        //changePosition(9, -7);
    }

    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);
        if(menuColumn != menuChange){
            if(menuColumn == 1)
                setJustify(635, -10, 'R');
            else if(menuColumn == -1)
                setJustify(5, 0, 'L');
            else
                setJustify(320, 0, 'C');
            menuChange = menuColumn;
        }
        helper.setMouseControl(sysTime);
        if(helper.getMouseLock())
    		helper.setMouseRelease(KeyControl.getMouseX(),
    			KeyControl.getMouseY());        
    }

    public int getMenuColumn(){
        return menuColumn;
    }

    public boolean getMenuChange(){
        if(change != select){
            change = select;
            return true;
        }
        return false;
    }

    public String getScrollText(){
        return text[getVertIndex()];
    }

    public String getHelpText(){
        return help[getVertIndex()];
    }

    public int control(int column, int mouseScroll){
        if(KeyControl.isUpDown() || KeyControl.isDownDown() ||
            KeyControl.isLeftDown() || KeyControl.isRightDown()){
            helper.setMouseLock(KeyControl.getMouseX(),
        			KeyControl.getMouseY());
        }

        if(!helper.getMouseLock()){
            mouseSelect(KeyControl.getMouseX(), KeyControl.getMouseY());
            if(helper.getScroll())
                mouseScroll(KeyControl.getMouseX(), KeyControl.getMouseY());
        }

        if(mouseScroll != 0){
        	helper.setMouseLock(KeyControl.getMouseX(),
        			KeyControl.getMouseY());
        	if(mouseScroll == -1)   moveUp();
                else                    moveDown();
        }

        if(KeyControl.isUpClicked())
            moveUp();

        if(KeyControl.isDownClicked())
            moveDown();

        if(KeyControl.isLeftClicked()){
            if(menuColumn > -1)
                menuColumn--;
            else
                curFaction--;
        }

        if(KeyControl.isRightClicked()){
            if(menuColumn < 1)
                menuColumn++;
            else
                curFaction++;
        }

        if(curFaction >= factions)
            curFaction = -1;
        if(curFaction < -1)
            curFaction = factions-1;

        if(KeyControl.isActionClicked())
            column = select;

        if(KeyControl.isCancelClicked())
            column = 0;
        
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
        factions = colors.length/16;
    }

    public void setColor(int index){
        index *= 16;
        resetColor();
        if(index >= 0 && index < colors.length){            
            addColor(new Color(160, 160, 160),
                    new Color(colors[index+9+3]));
            addColor(new Color(128, 128, 128),
                    new Color(colors[index+9+4]));
            addColor(new Color(64, 64, 64),
                    new Color(colors[index+9+5]));
            addColor(new Color(255, 255, 255),
                    new Color(colors[index+9+0]));
            addColor(new Color(200, 200, 200),
                    new Color(colors[index+9+2]));
            for(int i = 0; i < getVertSize(); i+=2)
                setItemColor(i, imgRef.getColor(
                    new Color(colors[index+9+5]), 127));
            resetScreen();
        }else{
            for(int i = 0; i < getVertSize(); i+=2)
                setItemColor(i, imgRef.getColor(Color.DARK_GRAY, 127));
            resetScreen();
        }
    }

    public int getCurFaction(){
        return curFaction;
    }
}
