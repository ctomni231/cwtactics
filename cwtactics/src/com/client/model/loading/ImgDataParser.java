package com.client.model.loading;

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
public class ImgDataParser {
    private static ArrayList<ImgData> allImg;
    private static ArrayList<Integer> defColors;
    private static HashMap<Integer, String> preferItems = null;

    public static void init(){
        preferItems = new HashMap<Integer, String>();
        allImg = new ArrayList<ImgData>();
        defColors = new ArrayList<Integer>();
        decodeFiles();
        //Get all data
        //Search The code
        //Then the type (might overwrite)
        //Search the name (if type isn't preferred, skip it)
        //Search everything else but the FileData
        //If everything else matches, you have an animation
        //Otherwise, you make a new item.
    }
    //This class will search drawn items for a type that matches it.
    public static void addForceType(String code, String type){
        preferItems.put((int)getCodeByte(code), type);
    }
    

    public static void clearData(){
        if(allImg != null)
            allImg.clear();
    }

    public static void decodeFiles(){
        decodeData(getFileTextInfo());
    }
    public static void decodeData(ArrayList<String> textData){
        ArrayList<String> gameData;
        Scanner textScan;
        String temp;
        for(String txt: textData){
            gameData = new ArrayList<String>();
            
            textScan = new Scanner(txt);
            temp = null;
            do{
                temp = textScan.findInLine(".?[^\\x7B\\x7D]*.?");
                if(!temp.matches(""))     gameData.add(temp);
            }while(!temp.matches(""));
            textScan.close();
            fillData(gameData);
        }
    }

    private static ArrayList<String> getFileTextInfo(){
        ArrayList<String> text = new ArrayList<String>();
        FileFind findFiles = new FileFind();
        findFiles.addAvoidDir(".svn");
        findFiles.addType("txt");
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

    private static void fillData(ArrayList<String> gameData){
        //Give back a group of ImgData
        ImgData temp = new ImgData();
        ImgFile tempFile = new ImgFile();
        defColors = new ArrayList<Integer>();
        for(String test: gameData){
            System.out.println("PART:"+test);

            if(!test.startsWith("{"))
                continue;

            test = test.substring(1, test.length()-1);
            String[] part = test.split(":");

            if(part[0].matches("COL.*")){
                storeColors(part);
                continue;
            }

            if(part[0].matches("END") || part[0].matches("COD.*")){
                if(!temp.name.matches("")){
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
                temp.group = part[1];
                continue;
            }else if(part[0].matches("TYP.*")){
                temp.codeType = part[1];
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
    private static void storeData(ImgData temp){
        for(ImgData stored: allImg){
            if(stored.map != temp.map &&
               stored.grid != temp.grid &&
               stored.weather != temp.weather &&
               stored.direction != temp.direction &&
               stored.army.matches(temp.army))
                continue;
            
            if(stored.code != temp.code &&
              !stored.codeType.matches(temp.codeType) &&
              !stored.name.matches(temp.name))
                continue;
        }
        allImg.add(temp);
    }
    
    private static byte getCodeByte(String part){
        ImgData temp = new ImgData();
        if(part.matches("TER.*") || part.matches("FIE.*"))
            return temp.TERRAIN;
        else if(part.matches("CIT.*") || part.matches("PRO.*"))
            return temp.PROPERTY;
        else if(part.matches("UNI.*"))
            return temp.UNIT;
        return 0;
    }
    
    private static short[] sortLocations(String[] temp){
        short[] cool = new short[temp.length-1];
        for(int i = 1; i < temp.length; i++)
            cool[i-1] = (short)Integer.parseInt(temp[i]);
        return cool;
    }

    private static void storeColors(String[] parts){
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
}
