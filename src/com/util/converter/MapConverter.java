package com.util.converter;
//(JSRulz)- put it within the Utilities package instead of map.Converter so I could run it :)

import java.util.ArrayList;

/**
 * MapConverter.java
 * 
 * This was produced to convert the maps found on Headphone's AWBW Map Maker
 * (http://headphone.110mb.com/AWBW_Map_Maker.net.wolfTec.html) into CWT maps.
 * 
 * @author theether
 * @license Look into "LICENSE" file for further information
 * @version 04.29.14
 */
public class MapConverter {

	//"026" means there are 3 players, orange star, green earth and whatever the 7th team is
    private static String players = "";
    
    /**
     * @param args (optional) mapstring, name, credits
     */
    public static void main(String[] args) {
        
    	//JSRulz - (Only used in main so scoped it here and removed static)
    	String input;
        String output;
        
    	String name;
        String credits;
        
        if(args.length>=3)
        {
            input=args[0];
            name=args[1];
            credits=args[2];
        }
        else
        {
            name="Spann-Island";
            credits="CW Crew";
            input=  ",,,,,,,,,,,,,,,,\n" +  //Spann-Island for testing
                    ",,,,,,,,,,,,,,,,\n" +
                    ",,.@A-[-B.@l.l,,\n" +
                    ",..@=@P,Ha..ol,,\n" +
                    ",aaEC,,,=.^.Hl,,\n" +
                    ",..=.,,,Ha^aF.,,\n" +
                    ",fEGa,,@DG-G+a,,\n" +
                    ",fi....@@.,,],,,\n" +
                    ",,ff......,,..,,\n" +
                    ",,,,^a^@a.[.aa,,\n" +
                    ",,,,,,,,,,,,,,,,\n" +
                    ",,,,,,,,,,,,,,,,";
        }
        
        output=convert(name, input, credits);
        
        System.out.println(output);
    }
    
    /**
     * Converts the whole map. This is the important method. (along with convertProp and convertTile)
     * @param name the name, the map shall have
     * @param input the input map in Headphone's format
     * @param credits like, who built the map? something like that
     * @return 
     */
    public static String convert(String name, String input, String credits)
    {
        String out= "{\n\t" +
                    "\"name\": \""+name+"\",\n\t" +
                    "\"credits\": \""+credits+"\",\n\t\n\t";
        ArrayList<String> terrain=new ArrayList<String>();
        ArrayList<String> properties=new ArrayList<String>();
        Boolean test;
        
        int map[][]= new int[input.indexOf("\n")][input.split("\n").length];//get the correctly sized array
        
        //fill the map
        for(int j=0;j<map[0].length;j++)
            for(int i=0;i<map.length;i++)
            {
                String tile=convertTile(input.charAt(j*(map.length+1)+i));
                if(tile.equals(""))
                {
                	//JSRulz - (input) Made it take the data from the inner scope 
                	//          instead of the static scope
                    properties.add(convertProp(properties.size(),i,j,input.charAt(j*(map.length+1)+i)));
                    tile="PLIN";
                }
                test=true;
                for(int k=0;k<terrain.size();k++)
                    if(terrain.get(k).equals(tile))
                    {
                        test=false;
                        map[i][j]=k;
                    }
                if(test)
                {
                    map[i][j]=terrain.size();
                    terrain.add(tile);
                }
            }
        
        out+="\"typeMap\": [";
        for(int i=0;i<terrain.size();i++)
        {
            out+="\n\t\t\""+terrain.get(i)+"\"";
            if(i<terrain.size()-1)
                out+=",";
        }
        out+="\n\t],\n\t\n\t";
        
        out+="\"map\": [";
        for(int i=0;i<map.length;i++)
        {
            out+="\n\t[";
            for(int j=0;j<map[0].length;j++)
            {
                out+=map[i][j];
                if(j<map[0].length-1)
                    out+=", ";
            }
            out+="]";
            if(i<map.length-1)
                out+=",";
        }
        out+="\n\t],\n\t\n\t";
        
        out+="\"mph\": " + map[0].length + ",\n\t";
        out+="\"mpw\": " + map.length + ",\n\t";
        out+="\"player\": "+ players.length() +",\n\t\n\t";
        
        out+="\"units\": [],\n\t\n\t";
        
        out+="\"prps\": [";
        for(int i=0;i<properties.size();i++)
        {
            out+="\n\t\t"+properties.get(i);
            if(i<properties.size()-1)
                out+=",";
        }
        out+="\n\t],\n\t" +
                "\n\t" +
                "\"rules\": []\n" +
                "}";
        
        return out;
    }
    
    /**
     * Reads the property of a single building
     * @param index 
     * @param x x-position of the building
     * @param y y-position of the building
     * @param tile char code from Headphone's mapmaker
     * @return the finished entry for the property list
     */
    //JSRulz - Prevented access if outside the class (to make it clear cut)
    private static String convertProp(int index, int x, int y, char tile)
    {
        String out="["+index+", "+x+", "+y+", \"";
        int team=-1;
        
        switch((int)tile)
        {
            case 97:
                out+="CITY";
                break;
            case 98:
                out+="BASE";
                break;
            case 99:
                out+="APRT";
                break;
            case 100:
                out+="PORT";
                break;
            case 101:
                out+="CITY";
                team=0;
                break;
            case 102:
                out+="BASE";
                team=0;
                break;
            case 103:
                out+="APRT";
                team=0;
                break;
            case 104:
                out+="PORT";
                team=0;
                break;
            case 105:
                out+="HQTR";
                team=0;
                break;
            case 106:
                out+="CITY";
                team=1;
                break;
            case 108:
                out+="BASE";
                team=1;
                break;
            case 109:
                out+="APRT";
                team=1;
                break;
            case 110:
                out+="PORT";
                team=1;
                break;
            case 111:
                out+="HQTR";
                team=1;
                break;
            case 112:
                out+="CITY";
                team=2;
                break;
            case 113:
                out+="BASE";
                team=2;
                break;
            case 114:
                out+="APRT";
                team=2;
                break;
            case 115:
                out+="PORT";
                team=2;
                break;
            case 116:
                out+="HQTR";
                team=2;
                break;
            case 117:
                out+="CITY";
                team=3;
                break;
            case 118:
                out+="BASE";
                team=3;
                break;
            case 119:
                out+="APRT";
                team=3;
                break;
            case 120:
                out+="PORT";
                team=3;
                break;
            case 121:
                out+="HQTR";
                team=3;
                break;
            case 31:
                out+="CITY";
                team=4;
                break;
            case 32:
                out+="BASE";
                team=4;
                break;
            case 33:
                out+="APRT";
                team=4;
                break;
            case 34:
                out+="PORT";
                team=4;
                break;
            case 35:
                out+="HQTR";
                team=4;
                break;
            case 85:
                out+="CITY";
                team=5;
                break;
            case 84:
                out+="BASE";
                team=5;
                break;
            case 83:
                out+="APRT";
                team=5;
                break;
            case 82:
                out+="PORT";
                team=5;
                break;
            case 81:
                out+="HQTR";
                team=5;
                break;
            case 90:
                out+="CITY";
                team=6;
                break;
            case 89:
                out+="BASE";
                team=6;
                break;
            case 88:
                out+="APRT";
                team=6;
                break;
            case 87:
                out+="PORT";
                team=6;
                break;
            case 86:
                out+="HQTR";
                team=6;
                break;
            case 54:
                out+="CITY";
                team=7;
                break;
            case 55:
                out+="BASE";
                team=7;
                break;
            case 56:
                out+="APRT";
                team=7;
                break;
            case 57:
                out+="PORT";
                team=7;
                break;
            case 95:
                out+="CMTR";
                team=8;
                break;
        }
        if(team!=-1 && players.indexOf(""+team)==-1)
            players+=team;
        out+="\", 20, "+team+"]";
        return out;
    }
    
    /**
     * Converts a single tile to its representation in the JSON format
     * from http://headphone.110mb.com/Map_Maker.js -> reverseConvert
     * @param tile the char code of the tile
     * @return the JSON representation. "" in case of a building
     */
  //JSRulz - Prevented access if outside the class (to make it clear cut)
    private static String convertTile(char tile)
    {
        if(     ((int)'a'<=(int)tile && (int)tile<=(int)'y')||
                ((int)'1'<=(int)tile && (int)tile<=(int)'9')||
                ((int)'Q'<=(int)tile && (int)tile<=(int)'Z')|| tile=='_'    )
            return "";//properties are handled separately
        switch(tile)
        {
            case '.':
                return "PLIN";
            case '@':
                return "FRST";
            case '^':
                return "MNTN";
            case ',':
                return "SEAS";
            case '%':
                return "REEF";
            case '(':
            case ')':
            case '<':
            case '>':
                return "SHOA";
            case '-':
            case '=':
            case 'A':
            case 'B':
            case 'C':
            case 'D':
            case 'E':
            case 'F':
            case 'G':
            case 'H':
            case '+':
                return "ROAD";
            case '{':
            case '}':
            case 'I':
            case 'J':
            case 'K':
            case 'L':
            case 'M':
            case 'N':
            case 'O':
            case 'P':
            case '~':
                return "RIVR";
            case '[':
            case ']':
                return "BRDG";
            case '?':
            	return "PIPE";
        }
        //JSRulz - BLAK == NULL in CWT map type :)
        return "NULL";
    }
    
}
