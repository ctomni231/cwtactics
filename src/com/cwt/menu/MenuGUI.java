package com.cwt.menu;

import com.cwt.menu.tools.TextPix;
import com.cwt.menu.tools.VerticalMenu;
import com.cwt.tools.KeyControl;
import com.jslix.io.MouseHelper;

import java.awt.Color;

/**
 * MenuGUI.java
 * 
 * This handles the GUI by drawing a menu for the screen
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 04.02.11
 */

public class MenuGUI extends VerticalMenu{

    /** The maximum items a vertical menu has */
    public final int MAX_ITEMS = 8;
    /** The delay time of keyboard scrolling */
    public final int DELAY = 30;
    /** How fast the menu scrolls */
    public final int SCROLL_SPEED = 2;

    /** Default colors for the letters */
    private Color[] dfltColors;
    /** Colors to change the letters to */
    private Color[] chngColors;
    /** Holds the path to the arrow picture file */
    private String arrow;
    /** Holds information related to menu selections */
    private int[] selectID;
    /** Holds information regarding the menu options */
    private String[] option;
    /** Holds information related to scrolling text */
    private String[] text;
    /** Holds information related to the help bar text */
    private String[] help;
    /** Integer representation of the multiple colors */
    private int[] colors;
    /** Holds whether the menu selection has changed */
    private int change;
    /** Regulates the mouse focus */
    private MouseHelper helper;
    /** Helps regulate the justify of the menu */
    private int menuColumn;
    /** Holds whether a justify column has changed */
    private int menuChange;
    /** Holds the max menu faction colors */
    private int factions;
    /** Holds whether a menu faction color changed */
    private int curFaction;
    /** Holds the menu option selected when you click back */
    private int back;
    /** This helps regulate scrolling for keyboard */
    private int keyCount;

    /**
     * This class displays a main menu and is the main class for controlling
     * all items that appear in the main menu. In addition, it also directly
     * alters the scroll text, the help text, and controls how the menu is
     * colored.
     * @param arrowPath The path to the upward arrow picture
     * @param alphaPath The path to the text picture file used
     * @param spacing The amount of spacing between each menu item
     * @param locx The x-axis location of the menu
     * @param locy The y-axis location of the menu
     * @param speed How quickly this menu will move
     */
    public MenuGUI(String arrowPath, int spacing,
            int locx, int locy, double speed){
        super(locx, locy, speed);       
        arrow = arrowPath;
        dfltColors = new Color[]{new Color(128, 128, 128),
        new Color(160, 160, 160)};
        chngColors = new Color[]{new Color(200, 200, 200),
        new Color(255, 255, 255)};
        setSpacingY(spacing);
        setMaxItems(MAX_ITEMS);
        helper = new MouseHelper();
        helper.setScrollIndex(SCROLL_SPEED);
        change = 0;
        menuColumn = 0;
        menuChange = -1;
        factions = 0;
        curFaction = -1;
        back = 0;
        keyCount = 0;
    }

    /**
     * This function completely sets up a vertical main menu with all the
     * options stored. Each item is sorted by array number.
     * @param mainOption A group of all selectable items
     * @param mainID A group of all menu selections for the items
     * @param mainText A group of scroll text associated with the items
     * @param mainHelp A group of help text associated with the items
     */
    public void initMenu(String[] mainOption, String[] mainID,
            String[] mainText, String[] mainHelp){
        help = mainHelp;
        option = new String[mainOption.length];
        for(int i = 0; i < option.length; i++)
            option[i] = mainOption[i].trim();
        text = new String[mainText.length];
        for(int i = -1; ++i < mainText.length; )
        	text[i] = "- "+mainText[i]+" -";
        
        selectID = new int[mainID.length];
        for(int i = 0; i < mainID.length; i++)
            selectID[i] = Integer.parseInt(mainID[i]);

        for(int i = 0; i < option.length; i++){
            createNewItem(0, 5, 0);
            addVertBox(i, selectID[i], imgRef.getColor(Color.DARK_GRAY, 127),
                    640, 7, true);
            createNewItem(10, 0, 0);
            addImagePart(TextPix.getTextImg(option[i]), 0.7);
            addImagePart(TextPix.getTextImg(option[i],
                dfltColors, chngColors), 0.7);
            addVertItem(i, selectID[i], true);
        }

        setArrowUp(arrow);
    }

    /**
     * Currently used for the main menu, but is actually a testing class
     * used for debugging the main menu.
     */
    @Override
    public void init(){
        String[] temp = new String[]{ "VERSUS", "ONLINE",
        "CREATE MAP", "LOAD MAP", "MAP EDITOR", "KEY CONFIGURE",
        "CREDITS", "EXIT"};

        String[] tempText = new String[]{
            "Play a multiplayer game against your friends",
            "Turn the tides of war on a friend through online battle",
            "Create the playfield of your imagination",
            "Load a map from the archive",
            "Edit an existing map or make changes to a new map",
            "Change the keyboard settings here",
            "See the creators of the game",
            "Leave. We see how it is :("
        };

        String[] helpText = new String[]{
            "VERSUS - Start a quick game versus a friend offline",
            "ONLINE - Start an online server game with a friend",
            "CREATE MAP - Create a new map for the game",
            "LOAD MAP - Load an existing map from the archive",
            "MAP EDITOR - Edit an existing map from the archive",
            "KEY CONFIGURE - Set up the keyboard settings",
            "CREDITS - See the creators of Custom Wars Tactics",
            "EXIT - Ends this game session"
        };

        String[] ID = new String[]{
            "6","-3","-4","-5","5","4","3","2"
        };

        initMenu(temp, ID, tempText, helpText);
    }

    /**
     * This function updates all the graphical elements in the menu
     * @param width The current width of the screen
     * @param height The current height of the screen
     * @param sysTime The current system time in milliseconds
     * @param mouseScroll The current mouse scroll wheel value
     */
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

    /**
     * This function gets the menu justify position
     * @return The menu justify position
     */
    public int getMenuColumn(){
        return menuColumn;
    }

    /**
     * This function sets the menu column
     * @param set The menu column
     */
    public void setMenuColumn(int set){
        if(menuColumn >= -1 && menuColumn <= 1)
            menuColumn = set;
    }

    /**
     * This function sets the current faction for the menu
     * @param set The menu color
     */
    public void setCurFaction(int set){        
        curFaction = set;
        if(curFaction >= factions)
            curFaction = -1;
        if(curFaction < -1)
            curFaction = factions-1;
    }

    /**
     * This function keeps track of whether a menu option changes
     * @return whether a menu option changes(true) or not(false)
     */
    public boolean getMenuChange(){
        if(change != select){
            change = select;
            return true;
        }
        return false;
    }

    /**
     * This function gets the current scrolling text for the item selected
     * @return The current scrolling text
     */
    public String getScrollText(){
        return text[getVertIndex()];
    }

    /**
     * This function gets the current help bar text for the item selected
     * @return The current help bar text
     */
    public String getHelpText(){
        return help[getVertIndex()];
    }

    /**
     * This function gets the text displayed for the bottom title bar
     * @param column The current column
     * @return A String representing the menu option
     */
    public String getOptionText(int column){
        if(column == -1)    column = 2;
        for(int i = 0; i < option.length; i++){
            if(selectID[i] == column)
                return option[i];
        }
        return "-";
    }

    /**
     * This function sets the screen index to go to when Cancel is clicked
     * @param set The column number to revert to
     */
    public void setPrevious(int set){
        back = set;
    }

    /**
     * This function gets all the user defined actions and uses them to
     * control the functions within the menu.
     * @param column The current column this menu is associated with
     * @param mouseScroll The current mouse scroll wheel
     * @return The new column value if it was changed
     */
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
            if(mouseScroll == -1)
                moveUp();
            else
                moveDown();
        }

        if(KeyControl.isUpClicked())
            moveUp();

        if(KeyControl.isDownClicked())
            moveDown();

        if(keyCount > DELAY && helper.getScroll())
            moveUp();
        else if(keyCount < -DELAY && helper.getScroll())
            moveDown();

        if(KeyControl.isUpDown())
            keyCount++;
        else if(KeyControl.isDownDown())
            keyCount--;
        else
            keyCount = 0;

        if(KeyControl.isLeftClicked() && back == 0){
            if(menuColumn > -1)
                menuColumn--;
            else
                curFaction--;
        }

        if(KeyControl.isRightClicked() && back == 0){
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
            column = back;
        
        return column;
    }

    /**
     * This function gets a list of color changes for menu items
     * @param colorPath The path to the color list
     */
    public void setColorPath(String colorPath){
        colors = TextPix.getImgPixels(colorPath);
        factions = colors.length/16;
    }

    /**
     * This function changes the color based on the menu colors
     * @param index Which index of colors to use for this menu
     */
    public void setColor(int index){
        index *= 16;
        resetColor();
        if(index >= 0 && index < colors.length){            
            addColor(new Color(160, 160, 160), new Color(colors[index+9+3]));
            addColor(new Color(128, 128, 128), new Color(colors[index+9+4]));
            addColor(new Color(64, 64, 64), new Color(colors[index+9+5]));
            addColor(new Color(255, 255, 255), new Color(colors[index+9+0]));
            addColor(new Color(200, 200, 200), new Color(colors[index+9+2]));
        }
        for(int i = 0; i < getVertSize(); i+=2)
            setItemColor(i, imgRef.getColor(
                index >= 0 && index < colors.length ?
                new Color(colors[index+9+5]) : Color.DARK_GRAY, 127));
        resetScreen();
    }

    /**
     * This function gets the current menu faction color
     * @return The menu faction color
     */
    public int getCurFaction(){
        return curFaction;
    }
}
