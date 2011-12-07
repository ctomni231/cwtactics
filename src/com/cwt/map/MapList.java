package com.cwt.map;

import com.cwt.map.io.DataStorage;
import com.cwt.map.io.GraphicStorage;
import com.cwt.map.io.TagStorage;

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
 * @version 08.29.11
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
        reset();
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
     * This function gets all the objects within the object list
     * @return A full list of variables
     */
    public int[] fullList(){
        int[] temp = new int[dataItems.length];
        for(int i = 0; i < temp.length; i++)
            temp[i] = i;
        return temp;
    }

    /**
     * This function takes all object variables within the MapList and
     * sorts them according to the parameters set within the function
     * of the class
     * @return A sorted list containing only items within the parameters set
     */
    public int[] list(){
        return list(fullList());
    }

    /**
     * This function takes all object variables within the MapList and
     * sorts them according to the parameters set within the function
     * of the class
     * @param list A list of integers representing the object items
     * @return A sorted list containing only items within the parameters set
     */
    public int[] list(int[] list){
        if(!animations)
            list = sortDuplicate(list, FILE);
        if(!random)
            list = sortDuplicate(list, RANDOM);
        if(code >= 0){
            list = sortItem(list, CODE);
            list = sortItem(list, DATA);
            list = sortItem(list, GRAPHIC);
            list = sortItem(list, TAGS);
        }
        return list;
    }

    /**
     * This function is used to find the closest match using all the
     * information available within the tags. It returns an integer
     * stating the best member from the entire MapElement items list.
     * @return The best matching item from the entire MapElement list
     */
    public int match(){
        return match(list());
    }

    /**
     * This function is used to find the closest match using all the
     * information available within the tags. It returns an integer
     * stating the best member from the list provided.
     * @param list An integer list representing the MapElement items
     * @return The best matching item from the list provided
     */
    public int match(int[] list){
        int bestScore = -1;
        int bestMember = -1;
        int score = -1;
        for(int member: list){
            score = matchItem(member, CODE);
            score += matchItem(member, DATA);
            score += matchItem(member, GRAPHIC);
            score += matchItem(member, TAGS);

            if(score > bestScore){
                bestScore = score;
                bestMember = member;
            }else if(score == bestScore){
                if(sizeItem(member) >= defaultSize() && 
                        sizeItem(member) < sizeItem(bestMember)){
                    bestScore = score;
                    bestMember = member;
                }else if(sizeItem(member) > sizeItem(bestMember)){
                    bestScore = score;
                    bestMember = member;
                }
            }
        }
        return bestMember;
    }

    /**
     * This function resets all the data to the defaults
     */
    public final void reset(){
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

    /**
     * This function gets exactly how many items are filled within the
     * default criteria with non-default values
     * @return The amount of criteria filled
     */
    private int defaultSize(){
        int length = 0;
        if(code != -1)
            length++;
        if(!base.equals("DFLT"))
            length++;
        if(!type.equals("DFLT"))
            length++;
        if(weather != -1)
            length++;
        if(size != -1)
            length++;
        if(direction != -1)
            length++;
        if(!army.equals("DFLT"))
            length++;
        if(!tag_O.equals("DFLT"))
            length++;
        if(!tag_OL.equals("DFLT"))
            length++;
        if(!tag_N.equals("DFLT"))
            length++;
        if(!tag_NE.equals("DFLT"))
            length++;
        if(!tag_NW.equals("DFLT"))
            length++;
        if(!tag_S.equals("DFLT"))
            length++;
        if(!tag_SE.equals("DFLT"))
            length++;
        if(!tag_SW.equals("DFLT"))
            length++;
        if(!tag_E.equals("DFLT"))
            length++;
        if(!tag_W.equals("DFLT"))
            length++;
        if(!tag_NR.equals("DFLT"))
            length++;
        if(!tag_SR.equals("DFLT"))
            length++;
        if(!tag_ER.equals("DFLT"))
            length++;
        if(!tag_WR.equals("DFLT"))
            length++;
        return length;
    }

    /**
     * This function checks to see if a particular item matches with the
     * current item and creates a list based on it.
     * @param list The list of items to sort
     * @param item The item reference to sort this by determined by MapElement
     * @return A reduced list of the matching items
     */
    private int[] sortItem(int[] list, byte item){
        int[] temp = new int[0];
        for(int i = 0; i < list.length; i++){
            switch(item){
                case CODE:
                    if(getData(list[i], item) == code)
                        temp = addData(temp, list[i]);
                    break;
                case DATA:
                    if(sortData(getData(list[i], item)))
                        temp = addData(temp, list[i]);
                    break;
                case GRAPHIC:
                    if(sortGraphics(getData(list[i], item)))
                        temp = addData(temp, list[i]);
                    break;
                case TAGS:
                    if(sortTag(getData(list[i], item)))
                        temp = addData(temp, list[i]);
            }
        }
        return temp;
    }

    /**
     * This function checks to see if the item matches the data specified
     * and determines whether it should be part of the list. It checks the
     * Data Storage information only
     * @param item The item reference to sort this by determined by MapElement
     * @return A reduced list of the matching items
     */
    private boolean sortData(int item){
        boolean pass = true;
        int[] temp = getArray(item, DATA);
        if(!base.equals("DFLT"))
            pass = sort(temp, DataStorage.BASE, base);
        if(pass && !type.equals("DFLT"))
            pass = sort(temp, DataStorage.TYPE, type);
        return pass;
    }

    /**
     * This function checks to see if the item matches the data specified
     * and determines whether it should be part of the list. It checks the
     * Graphic Storage information only
     * @param item The item reference to sort this by determined by MapElement
     * @return A reduced list of the matching items
     */
    private boolean sortGraphics(int item){
        boolean pass = true;
        int[] temp = getArray(item, GRAPHIC);
        if(weather >= 0)
            pass = sort(temp, GraphicStorage.WEATHER, ""+weather);
        if(pass && size >= 0)
            pass = sort(temp, GraphicStorage.SIZE, ""+size);
        if(pass && direction >= 0)
            pass = sort(temp, GraphicStorage.DIRECTION, ""+direction);
        if(pass && !army.equals("DFLT"))
            pass = sort(temp, GraphicStorage.ARMY, army);
        return pass;
    }

    /**
     * This function checks to see if the item matches the data specified
     * and determines whether it should be part of the list. It checks the
     * Tag Storage information only
     * @param item The item reference to sort this by determined by MapElement
     * @return A reduced list of the matching items
     */
    private boolean sortTag(int item){
        boolean pass = true;
        int[] temp = getArray(item, TAGS);
        if(!tag_O.equals("DFLT"))
            pass = sort(temp, TagStorage.O, tag_O);
        if(pass && !tag_OL.equals("DFLT"))
            pass = sort(temp, TagStorage.OL, tag_OL);
        if(pass && !tag_N.equals("DFLT"))
            pass = sort(temp, TagStorage.N, tag_N);
        if(pass && !tag_NE.equals("DFLT"))
            pass = sort(temp, TagStorage.NE, tag_NE);
        if(pass && !tag_NW.equals("DFLT"))
            pass = sort(temp, TagStorage.NW, tag_NW);
        if(pass && !tag_S.equals("DFLT"))
            pass = sort(temp, TagStorage.S, tag_S);
        if(pass && !tag_SE.equals("DFLT"))
            pass = sort(temp, TagStorage.SE, tag_SE);
        if(pass && !tag_SW.equals("DFLT"))
            pass = sort(temp, TagStorage.SW, tag_SW);
        if(pass && !tag_E.equals("DFLT"))
            pass = sort(temp, TagStorage.E, tag_E);
        if(pass && !tag_W.equals("DFLT"))
            pass = sort(temp, TagStorage.W, tag_W);
        if(pass && !tag_NR.equals("DFLT"))
            pass = sort(temp, TagStorage.NR, tag_NR);
        if(pass && !tag_SR.equals("DFLT"))
            pass = sort(temp, TagStorage.SR, tag_SR);
        if(pass && !tag_ER.equals("DFLT"))
            pass = sort(temp, TagStorage.ER, tag_ER);
        if(pass && !tag_WR.equals("DFLT"))
            pass = sort(temp, TagStorage.WR, tag_WR);
        return pass;
    }

    /**
     * This checks to see if data elements match within the items selected
     * and assigns point values according to the matched items
     * @param index The MapElement index to check
     * @param item The MapElement byte item reference
     * @return Points according to the amount of matches
     */
    private int matchItem(int index, byte item){
        int score = 0;
        switch(item){
            case CODE:
                if(getData(index, CODE) == code)
                    score += points[0];
                break;
            case DATA:
                score += matchData(index);
                break;
            case GRAPHIC:
                score += matchGraphics(index);
                break;
            case TAGS:
                score += matchTags(index);
                break;
        }
        return score;
    }

    /**
     * This checks to see if the data elements match within the Data Storage
     * and assigns points based on the results
     * @param index The MapElement index to check
     * @return Points according to the amount of matches
     */
    private int matchData(int index){
        int score = 0;
        int[] temp = getArray(index, DATA);
        if(!base.equals("DFLT") && sort(temp, DataStorage.BASE, base))
            score += points[1];
        if(!type.equals("DFLT") && sort(temp, DataStorage.TYPE, type))
            score += points[2];
        return score;
    }

    /**
     * This checks to see if the graphics elements match within the
     * Graphics Storage and assigns points based on the results
     * @param index The MapElement index to check
     * @return Points according to the amount of matches
     */
    private int matchGraphics(int index){
        int score = 0;
        int[] temp = getArray(index, GRAPHIC);
        if(weather >= 0 && sort(temp, GraphicStorage.WEATHER, ""+weather))
            score += points[3];
        if(size >= 0 && sort(temp, GraphicStorage.SIZE, ""+size))
            score += points[4];
        if(direction >= 0 && sort(temp, GraphicStorage.DIRECTION, ""+direction))
            score += points[5];
        if(!army.equals("DFLT") && sort(temp, GraphicStorage.ARMY, army))
            score += points[6];
        return score;
    }

    /**
     * This checks to see if the tag elements match within the
     * Tag Storage and assigns points based on the results
     * @param index The MapElement index to check
     * @return Points according to the amount of matches
     */
    private int matchTags(int index){
        int score = 0;
        int[] temp = getArray(index, TAGS);
        if(!tag_O.equals("DFLT") && sort(temp, TagStorage.O, tag_O))
            score += points[7];
        if(!tag_OL.equals("DFLT") && sort(temp, TagStorage.OL, tag_OL))
            score += points[8];
        if(!tag_N.equals("DFLT") && sort(temp, TagStorage.N, tag_N))
            score += points[9];
        if(!tag_NE.equals("DFLT") && sort(temp, TagStorage.NE, tag_NE))
            score += points[10];
        if(!tag_NW.equals("DFLT") && sort(temp, TagStorage.NW, tag_NW))
            score += points[11];
        if(!tag_S.equals("DFLT") && sort(temp, TagStorage.S, tag_S))
            score += points[12];
        if(!tag_SE.equals("DFLT") && sort(temp, TagStorage.SE, tag_SE))
            score += points[13];
        if(!tag_SW.equals("DFLT") && sort(temp, TagStorage.SW, tag_SW))
            score += points[14];
        if(!tag_E.equals("DFLT") && sort(temp, TagStorage.E, tag_E))
            score += points[15];
        if(!tag_W.equals("DFLT") && sort(temp, TagStorage.W, tag_W))
            score += points[16];
        if(!tag_NR.equals("DFLT") && sort(temp, TagStorage.NR, tag_NR))
            score += points[17];
        if(!tag_SR.equals("DFLT") && sort(temp, TagStorage.SR, tag_SR))
            score += points[18];
        if(!tag_ER.equals("DFLT") && sort(temp, TagStorage.ER, tag_ER))
            score += points[19];
        if(!tag_WR.equals("DFLT") && sort(temp, TagStorage.WR, tag_WR))
            score += points[20];
        return score;
    }

    /**
     * This function finds the amount of tags filled with non-default items
     * for lists in MapElement
     * @param index The index to search for the amount of filled items
     * @return How many items there are in total filled for this index
     */
    private int sizeItem(int index){
        int length = 0;
        if(getData(index, CODE) >= 0)
            length++;
        length += sizeData(index);
        length += sizeGraphics(index);
        length += sizeTags(index);
        return length;
    }

    /**
     * This function assists the sizeItem function by finding the amount of
     * Data Items filled in a Map Element list
     * @param index The index to search for the amount of filled items
     * @return How many items there are in total filled for this index
     */
    private int sizeData(int index){
        int length = 0;
        int[] temp = getArray(index, DATA);
        if(!sort(temp, DataStorage.BASE, ""))
            length++;
        if(!sort(temp, DataStorage.TYPE, ""))
            length++;
        return length;
    }

    /**
     * This function assists the sizeItem function by finding the amount of
     * Graphic Items filled in a Map Element list
     * @param index The index to search for the amount of filled items
     * @return How many items there are in total filled for this index
     */
    private int sizeGraphics(int index){
        int length = 0;
        int[] temp = getArray(index, GRAPHIC);
        if(!sort(temp, GraphicStorage.WEATHER, "-1"))
            length++;
        if(!sort(temp, GraphicStorage.SIZE, "-1"))
            length++;
        if(!sort(temp, GraphicStorage.DIRECTION, "-1"))
            length++;
        if(!sort(temp, GraphicStorage.ARMY, ""))
            length++;
        return length;
    }

    /**
     * This function assists the sizeItem function by finding the amount of
     * Tag Items filled in a Map Element list
     * @param index The index to search for the amount of filled items
     * @return How many items there are in total filled for this index
     */
    private int sizeTags(int index){
        int length = 0;
        int[] temp = getArray(index, TAGS);
        if(!sort(temp, TagStorage.O, ""))
            length++;
        if(!sort(temp, TagStorage.OL, ""))
            length++;
        if(!sort(temp, TagStorage.N, ""))
            length++;
        if(!sort(temp, TagStorage.NE, ""))
            length++;
        if(!sort(temp, TagStorage.NW, ""))
            length++;
        if(!sort(temp, TagStorage.S, ""))
            length++;
        if(!sort(temp, TagStorage.SE, ""))
            length++;
        if(!sort(temp, TagStorage.SW, ""))
            length++;
        if(!sort(temp, TagStorage.E, ""))
            length++;
        if(!sort(temp, TagStorage.W, ""))
            length++;
        if(!sort(temp, TagStorage.NR, ""))
            length++;
        if(!sort(temp, TagStorage.SR, ""))
            length++;
        if(!sort(temp, TagStorage.ER, ""))
            length++;
        if(!sort(temp, TagStorage.WR, ""))
            length++;
        return length;
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
     * This function acts as a shortcut function for all the sorting functions
     * @param temp The integer holding the values to sort
     * @param store The class byte reference number
     * @param compare This class equivalent comparing variable
     * @return Whether all the items matched (T) or not (F)
     */
    private boolean sort(int[] temp, byte store, String compare){
        for(int check: temp){
            if(getData().getData(check, store).matches(compare))
                return true;
        }
        return false;
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
            else
                points[i] = (i < 17) ? 1 : -1;
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
