package com.system.data;

import com.client.tools.FileFind;
import com.client.tools.FileIndex;
import java.awt.Color;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

/**
 * This class will turn text files into organized image data for display
 * in a menu or a map.
 * @author Crecen
 */

//We need to be able to search all current files for info. (FileManager)
//Then we need to parse the data found (Tapsi's XML/ My class)
//Then we need to look for matches to create animations.
//After that, we are complete. A simple hashmap should be enough.
//(CODE:TYPE:NAME)
//Make sure you allow to user to shrink data by type, and type alone.
//either in getData(String type)
public class ImgDataParser implements Runnable{
    private ArrayList<ImgData> allImg;
    private ArrayList<Integer> defColors;
    private HashMap<Integer, String> preferItems;
    private ArrayList<String> typeList;
    private boolean ready;
    private Thread looper;

    public ImgDataParser(){
        preferItems = new HashMap<Integer, String>();
        allImg = new ArrayList<ImgData>();
        defColors = new ArrayList<Integer>();
        typeList = new ArrayList<String>();
    }

    //This class will search drawn items for a type that matches it.
    public void addForceType(String code, String type){
        preferItems.put((int)getCodeByte(code), type);
    }

    public ArrayList<ImgData> getData(){
        return ready ? allImg : new ArrayList<ImgData>();
    }

    public ArrayList<String> getTypes(){
        return typeList;
    }

    public void clearData(){
        if(preferItems != null)
            preferItems.clear();
        if(allImg != null)
            allImg.clear();
        typeList = new ArrayList<String>();
    }

    public boolean isReady(){
        return ready;
    }

    public void decode(){
        ready = false;
        looper = new Thread(this);
        looper.start();
    }
    public void decodeFiles(){
        decodeData(getFileTextInfo());
        ready = true;
    }
    public void decodeData(ArrayList<String> textData){
        ArrayList<String> gameData;
        Scanner textScan;
        String temp;
        for(String txt: textData){
            gameData = new ArrayList<String>();
            
            textScan = new Scanner(txt);
            temp = null;
            do{
                temp = textScan.findInLine(".?[^\\x7B\\x7D]*.?");
                if( temp == null ) temp = "";
                if(!temp.matches(""))     gameData.add(temp);
            }while(!temp.matches(""));
            textScan.close();
            fillData(gameData);
        }
    }

    private ArrayList<String> getFileTextInfo(){
        ArrayList<String> text = new ArrayList<String>();
        FileFind findFiles = new FileFind();
        findFiles.addAvoidDir(".svn");
        findFiles.addForceType("txt");
        findFiles.refactor();

        for(FileIndex file: findFiles.getAllFiles()){
            if(file.suffix.matches("txt")){
                String temp = "";
                char cool = 0;
                try{
                    FileReader fileRead = new FileReader(file.fpath);
                    while(fileRead.ready()){
                        cool = (char)fileRead.read();
                        if(cool != '\n' && cool != '\r')
                            temp = temp + String.valueOf(cool);
                    }
                    fileRead.close();
               }catch(IOException e){
                    return text;
               }
               text.add(temp);
            }
        }
        return text;
    }

    private void fillData(ArrayList<String> gameData){
        //Give back a group of ImgData
        ImgData temp = new ImgData();
        ImgFile tempFile = new ImgFile();        
        for(String test: gameData){
            //System.out.println("PART:"+test);

            if(!test.startsWith("{") || test.startsWith("{-"))
                continue;

            test = test.substring(1, test.length()-1);
            String[] part = test.split(":");

            if(part[0].matches("COL.*")){
                storeColors(part);
                continue;
            }
            if(part[0].matches("END") || part[0].matches("COD.*")){
                if(!temp.name.matches("")){
                    //System.out.println(defColors);
                    temp.dfltColors = defColors;
                    storeData(temp);
                    temp = new ImgData();
                }
                if(part[0].matches("COD.*"))
                    temp.code = getCodeByte(part[1]);
                continue;
            }else if(part[0].matches("FIL.*")){
                tempFile = new ImgFile();
                tempFile.filename = part[1];
                continue;
            }else if(part[0].matches("LOC.*")){
                tempFile.setLocation(sortLocations(part));
                if(!tempFile.filename.matches(""))
                    temp.imgFileRef.add(tempFile);
                continue;
            }else if(part[0].matches("NAM.*")){
                temp.name = part[1];
                if(temp.group.matches(""))
                    temp.group = part[1];
                continue;
            }else if(part[0].matches("TYP.*")){
                temp.codeType = part[1];
                addType(part[1]);
                continue;
            }else if(part[0].matches("ARM.*")){
                temp.army = part[1];
                continue;
            }else if(part[0].matches("SUB.*") || part[0].matches("GRO.*")){
                temp.group = part[1];
                continue;
            }else if(part[0].matches("WEA.*")){
                temp.weather = part[1].charAt(0);
                continue;
            }else if(part[0].matches("DIR.*")){
                temp.direction = (byte)Integer.parseInt(part[1]);
                continue;
            }else{
                //Stores arbitrary tags
                temp.tags.add(test);
            }
        }
    }

    //This stores animations and makes sure each item is stored once
    //in a database.
    private void storeData(ImgData temp){
        ImgData stored = null;
        for(int i = 0; i < allImg.size(); i++){
            stored = allImg.get(i);
            if(stored.map != temp.map ||
               stored.grid != temp.grid ||
               stored.weather != temp.weather ||
               stored.direction != temp.direction ||
               !stored.army.matches(temp.army) ||
               stored.code != temp.code ||
               !stored.group.matches(temp.group))
                continue;
            
            //Checks for a preferred type of art for each type of
            //art form.
            if(preferItems != null){
                if(preferItems.containsKey((int)temp.code)){
                    if(!stored.codeType.matches(
                            preferItems.get((int)temp.code)))
                        allImg.set(i, temp);
                }
            }

            //If there is nothing preferred and this doesn't match
            //It skips storing.
            if(!stored.codeType.matches(temp.codeType))
                continue;
            
            //Checks for animations. These are created when two
            //items have exactly the same information except
            //for the file and location.
            boolean newAnim = false;
            for(String tempPart: temp.tags){
                if(tempPart.matches("O.?:.*") ||
                    tempPart.matches("N.?:.*") ||
                    tempPart.matches("S.?:.*") ||
                    tempPart.matches("E.?:.*") ||
                    tempPart.matches("W.?:.*") ||
                    tempPart.matches("\\d*")){
                    newAnim = false;
                    for(String storedPart: stored.tags){
                        if(storedPart.matches(tempPart)){
                            newAnim = true;
                            break;
                        }
                    }
                    if(!newAnim)
                        break;
                }
            }         
            
            //Makes a new animation
            if(newAnim && (temp.tags.size() == stored.tags.size())){
                //Makes sure only one file is saved per different animation
                
                for(ImgFile tempFile: temp.imgFileRef){
                    boolean newFile = true;
                    for(int j = 0; j < stored.imgFileRef.size(); j++){
                        ImgFile storeFile = stored.imgFileRef.get(j);
                        if(!storeFile.filename.matches(tempFile.filename) ||
                           storeFile.flipEdit != tempFile.flipEdit ||
                           storeFile.locx != tempFile.locx ||
                           storeFile.locy != tempFile.locy ||
                           storeFile.sizex != tempFile.sizex ||
                           storeFile.sizey != tempFile.sizey ||
                           storeFile.tilex != tempFile.tilex ||
                           storeFile.tiley != tempFile.tiley)
                            continue;
                        
                        stored.animRef.add((byte)j);
                        newFile = false;
                        break;
                    }
                    if(newFile){
                        stored.animRef.add((byte)stored.imgFileRef.size());
                        stored.imgFileRef.add(tempFile);
                    }
                }

                allImg.set(i, stored);
                return;
            }
        }

        temp.animRef.add((byte)0);
        allImg.add(temp);
    }
    
    private byte getCodeByte(String part){
        ImgData temp = new ImgData();
        if(part.matches("TER.*") || part.matches("FIE.*"))
            return temp.TERRAIN;
        else if(part.matches("CIT.*") || part.matches("PRO.*"))
            return temp.PROPERTY;
        else if(part.matches("UNI.*"))
            return temp.UNIT;
        else if(part.matches("CUR.*"))
            return temp.CURSOR;
        else if(part.matches("ATT.*")){
            return temp.ATTRIBUTE;
        }else if(part.matches("ARR.*")){
            return temp.ARROW;
        }
        return 0;
    }
    
    private short[] sortLocations(String[] temp){
        short[] cool = new short[temp.length-1];
        for(int i = 1; i < temp.length; i++)
            cool[i-1] = (short)Integer.parseInt(temp[i]);
        return cool;
    }

    private void storeColors(String[] parts){
        defColors = new ArrayList<Integer>();
        String[] color;
        for(int i = 1; i < parts.length; i++){
             color = parts[i].split(",");
             if(color.length == 1 && color[0].matches("0x.*"))
                 defColors.add(new Color(Integer.decode(color[0])).getRGB());
             else if(color.length == 3)
                 defColors.add(new Color(Integer.parseInt(color[0]),
                         Integer.parseInt(color[1]),
                         Integer.parseInt(color[2])).getRGB());
             else if(color.length == 4)
                 defColors.add(new Color(Integer.parseInt(color[0]),
                         Integer.parseInt(color[1]),
                         Integer.parseInt(color[2]),
                         Integer.parseInt(color[3])).getRGB());

        }
    }

    private void addType(String type){
        if(!typeList.contains(type))
           typeList.add(type);
    }

    public void run(){
        try{
            decodeFiles();
        }catch(Exception e){
            System.out.println(e.getStackTrace());
        }
    }
}
