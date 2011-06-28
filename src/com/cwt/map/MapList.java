package com.cwt.map;

/**
 * MapList.java
 *
 * This class is a support class for MapElement specifically to help create
 * smaller list for the graphical elements. Its major function is to control
 * the visuals of the object graphics, and is one of the major controllers of
 * terrain connections.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 04.10.11
 */
public class MapList extends MapElement{
    private int code;//Holds the default code criteria
    private String base;//Holds the default base criteria
    private String type;//Holds the default tile type criteria
    private int weather;//Holds the default weather criteria
    private int size;//Holds the default size criteria

    private int direction;//Holds the default directional criteria
    private String army;//Holds the default army faction criteria
    private String tag_O;//Holds the default Original tag criteria
    private String tag_OL;//Holds the default OverLap tag criteria

    private String tag_N;//Holds the default North tag criteria
    private String tag_NE;//Holds the default North East tag criteria
    private String tag_NW;//Holds the default North West tag criteria
    private String tag_S;//Holds the default South tag criteria
    private String tag_SE;//Holds the default South East tag criteria
    private String tag_SW;//Holds the default South West tag criteria
    private String tag_E;//Holds the default East tag criteria
    private String tag_W;//Holds the default West tag criteria

    private String tag_NR;//Holds the default North Reject tag criteria
    private String tag_SR;//Holds the default South Reject tag criteria
    private String tag_ER;//Holds the default East Reject tag criteria
    private String tag_WR;//Holds the default West Reject tag criteria

    private int[] points;//Holds the point value for each criteria

    private boolean animations;//Holds whether to list all animations
    private boolean random;//Holds whether to list all random objects

    /**
     * This class is the matching section of the MapElement, it is used to
     * help with matching the objects and terrain connections.
     */
    public MapList(){
        super();
        setPoints();
    }

    /**
     * This function sets the matching integer used for the code segment 
     * @param code The code segment to match for this list
     */
    public void setCode(int code){
        this.code = code;
    }

    /**
     * This function sets the matching text used for the base segment
     * @param base The base segment to match for this list
     */
    public void setBase(String base){
        this.base = base;
    }

    /**
     * This function sets the matching text used for the type segment
     * @param type The type segment to match for this list
     */
    public void setType(String type){
        this.type = type;
    }

    /**
     * This function sets the matching integer used for the weather segment
     * @param weather The weather segment to match for this list
     */
    public void setWeather(int weather){
        this.weather = weather;
    }

    /**
     * This function sets the matching integer used for the size segment
     * @param size The size segment to match for this list
     */
    public void setSize(int size){
        this.size = size;
    }

    /**
     * This function sets the matching integer used for the direction segment
     * @param direction The direction segment to match for this list
     */
    public void setDirection(int direction){
        this.direction = direction;
    }

    /**
     * This function sets the matching text used for the army segment
     * @param army The army segment to match for this list
     */
    public void setArmy(String faction){
        army = faction;
    }

    /**
     * This function sets the matching text used for the tag segment
     * @param type The type slot to drop the tag text into
     * @param tag The string representation of the current tag
     */
    public void setTag(String type, String tag){
        setTag(type.toCharArray(), tag);
    }

    public int[] list(){
        return new int[0];
    }

    public int match(){
        return 0;
    }

    /**
     * This function adds animations to the matching process
     */
    public void addAnimation(){
        animations = true;
    }

    /**
     * This function adds random tiles to the matching process
     */
    public void addRandom(){
        random = true;
    }
    

    /**
     * This function resets all the data to the defaults
     */
    public void reset(){
        code = -1;
        base = "DFLT";
        type = "DFLT";
        weather = -1;
        size = -1;
        direction = -1;
        army = "DFLT";
        tag_O = "DFLT";
        tag_OL = "DFLT";
        tag_N = "DFLT";
        tag_NE = "DFLT";
        tag_NW = "DFLT";
        tag_S = "DFLT";
        tag_SE = "DFLT";
        tag_SW = "DFLT";
        tag_E = "DFLT";
        tag_W = "DFLT";
        tag_NR = "DFLT";
        tag_SR = "DFLT";
        tag_ER = "DFLT";
        tag_WR = "DFLT";
        animations = false;
        random = false;
    }

    private int[] list(int[] list){
        if(!animations)
            list = sortDuplicate(list, FILE);
        if(!random)
            list = sortDuplicate(list, RANDOM);
        return list;
    }

    /**
     * This function will find duplicate numbers and only sort one of that
     * value in the list. It is used for sorting random images and animations
     * @param list The list of items to sort
     * @param item The item reference to sort this by determined by MapElement
     * @return A reduced list splitting all the duplicate items.
     */
    private int[] sortDuplicate(int[] list, byte item){
        int counter = 0;
        int[] temp = new int[0];
        for(int i = 0, maxNum = 0; i < list.length; i++){
            for(int num: getArray(i, item)){
                if(num > maxNum)
                    maxNum = num;
            }
            if(maxNum > counter){
                temp = addData(temp, i);
                counter = maxNum;
            }
        }
        return temp;
    }

    /**
     * This function uses a char array to determine which tag is filled
     * for the matching list
     * @param type The char slot to drop this tag into
     * @param tag The string representation of the tag
     */
    private void setTag(char[] type, String tag){
        if(type.length > 0){
            if(type[0] == 'O'){
                if(type.length > 1){
                    if(type[1] == 'L')
                        tag_OL = tag;
                    else
                        tag_O = tag;
                }else
                    tag_O = tag;
            }else if(type[0] == 'N'){
                if(type.length > 1){
                    if(type[1] == 'E')
                        tag_NE = tag;
                    else if(type[1] == 'W')
                        tag_NW = tag;
                    else if(type[1] == 'R')
                        tag_NR = tag;
                    else
                        tag_N = tag;
                }else
                    tag_N = tag;
            }else if(type[0] == 'S'){
                if(type.length > 1){
                    if(type[1] == 'E')
                        tag_SE = tag;
                    else if(type[1] == 'W')
                        tag_SW = tag;
                    else if(type[1] == 'R')
                        tag_SR = tag;
                    else
                        tag_S = tag;
                }else
                    tag_S = tag;
            }else if(type[0] == 'E'){
                if(type.length > 1){
                    if(type[1] == 'R')
                        tag_ER = tag;
                    else
                        tag_E = tag;
                }else
                    tag_E = tag;
            }else if(type[0] == 'W'){
                if(type.length > 1){
                    if(type[1] == 'R')
                        tag_WR = tag;
                    else
                        tag_W = tag;
                }else
                    tag_W = tag;
            }
        }
    }

    /**
     * This function sets the point values for graphics. The points are used
     * to decide how graphics are drawn to the screen.
     */
    private void setPoints(){
        points = new int[21];
        for(int i = 0; i < points.length; i++){
            if(i < 5)
                points[i] = 10000;
            else if(i < 9)
                points[i] = 100;
            else if(i < 17)
                points[i] = 1;
            else
                points[i] = -1;

        }
    }

    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    private int[] addData(int[] fillData, int data){
        if(fillData == null)
            fillData = new int[0];

        int[] temp = fillData;
        fillData = new int[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = data;

        return fillData;
    }

}
