package com.util;

import java.util.ArrayList;

/**
* MapConverter.java
*
* Convert the maps from XML into CWT format.
*
* @author theether
* @version 05.26.14
*/
public class MapConverterXenesis {

//"026" means there are 3 players, orange star, green earth and whatever the 7th team is
    private static String players = "";
    // Searched thoroughly until "0055". continue from there
    // grep -i -n -d recurse '0055' *
    // https://github.com/ctomni231/cwtactics/tree/master/image#terrain-types
    private static final String tileList="0000:NULL 0001:PLIN 0002:MNTN 0003:PLIN 0004:NULL 0005:NULL 0006:NULL 0007:NULL 0008:SEAS 0009:SEAS 000A:SEAS 000B:SEAS 000C:SEAS 000D:SEAS 000E:NULL 000F:NULL "
            + "0010:SHOA 0011:NULL 0012:NULL 0013:BRDG 0014:BRDG 0015:BRDG 0016:BRDG 0017:SEAS 0018:RIVR 0019:RIVR 001A:RIVR 001B:RIVR 001C:RIVR 001D:NULL 001E:NULL 001F:NULL "
            + "0020:MNTN 0021:PLIN 0022:MNTN 0023:MNTN 0024:FRST 0025:FRST 0026:FRST 0027:FRST 0028:SEAS 0029:SEAS 002A:SEAS 002B:SEAS 002C:SEAS 002D:SEAS 002E:SHOA 002F:SHOA "
            + "0030:NULL 0031:SHOA 0032:SHOA 0033:SEAS 0034:SEAS 0035:SEAS 0036:BRDG 0037:SEAS 0038:RIVR 0039:RIVR 003A:RIVR 003B:NULL 003C:RIVR 003D:RIVR 003E:NULL 003F:NULL "
            + "0040:ROAD 0041:ROAD 0042:ROAD 0043:PLIN 0044:FRST 0045:FRST 0046:FRST 0047:FRST 0048:SEAS 0049:SEAS 004A:SEAS 004B:SEAS 004C:SEAS 004D:NULL 004E:NULL 004F:SHOA "
            + "0050:SHOA 0051:SHOA 0052:NULL 0053:SHOA 0054:SHOA 0055:NULL 0056:NULL 0057:NULL 0058:NULL 0059:NULL 005A:NULL 005B:RIVR 005C:NULL 005D:NULL 005E:NULL 005F:NULL "
            + "0060:ROAD 0061:ROAD 0062:ROAD 0063:NULL 0064:FRST 0065:FRST 0066:FRST 0067:FRST 0068:SEAS 0069:SEAS 006A:SEAS 006B:SEAS 006C:SEAS 006D:SHOA 006E:SHOA 006F:NULL "
            + "0070:NULL 0071:NULL 0072:NULL 0073:NULL 0074:NULL 0075:NULL 0076:NULL 0077:NULL 0078:RIVR 0079:NULL 007A:NULL 007B:NULL 007C:NULL 007D:NULL 007E:NULL 007F:NULL "
            + "0080:ROAD 0081:ROAD 0082:NULL 0083:ROAD 0084:ROAD 0085:ROAD 0086:FRST 0087:FRST 0088:SEAS 0089:SEAS 008A:SEAS 008B:SEAS 008C:NULL 008D:NULL 008E:NULL 008F:SHOA "
            + "00A0:ROAD 00A1:ROAD 00A2:NULL 00A3:ROAD 00A4:ROAD 00A5:NULL 00A6:FRST 00A7:NULL 00A8:SEAS 00A9:SEAS 00AA:SEAS 00AB:NULL 00AC:NULL 00AD:NULL 00AE:NULL 00AF:NULL "
            + "00B0:SHOA 00B1:NULL 00B2:NULL 00B3:NULL 00B4:NULL 00B5:NULL 00B6:SHOA 00B7:SHOA 00B8:NULL 00B9:NULL 00BA:NULL 00BB:NULL 00BC:NULL 00BD:NULL 00BE:NULL 00BF:NULL "
            + "00C0:ROAD 00C1:ROAD 00C2:NULL 00C3:NULL 00C4:ROAD 00C5:NULL 00C6:FRST 00C7:FRST 00C8:SEAS 00C9:NULL 00CA:NULL 00CB:NULL 00CC:NULL 00CD:SHOA 00CE:SHOA 00CF:NULL "
            + "00D0:SHOA 00D1:NULL 00D2:NULL 00D3:SEAS 00D4:NULL 00D5:NULL 00D6:NULL 00D7:SEAS 00D8:NULL 00D9:RIVR 00DA:NULL 00DB:NULL 00DC:NULL 00DD:NULL 00DE:NULL 00DF:NULL "
            + "00E0:ROAD 00E1:NULL 00E2:NULL 00E3:NULL 00E4:NULL 00E5:NULL 00E6:NULL 00E7:NULL 00E8:SEAS 00E9:SEAS 00EA:SEAS 00EB:SEAS 00EC:SEAS 00ED:NULL 00EE:NULL 00EF:NULL "
            + "00F0:NULL 00F1:NULL 00F2:NULL 00F3:NULL 00F4:NULL 00F5:NULL 00F6:NULL 00F7:NULL 00F8:NULL 00F9:NULL 00FA:NULL 00FB:NULL 00FC:NULL 00FD:NULL 00FE:NULL 00FF:NULL "
            + "0100:NULL 0101:NULL 0102:PIPE 0103:NULL 0104:NULL 0105:NULL 0106:NULL 0107:NULL 0108:SEAS 0109:SEAS 010A:SEAS 010B:SEAS 010C:SEAS 010D:NULL 010E:NULL 010F:NULL "
            + "0110:NULL 0111:NULL 0112:NULL 0113:SHOA 0114:NULL 0115:NULL 0116:NULL 0117:NULL 0118:NULL 0119:NULL 011A:NULL 011B:NULL 011C:NULL 011D:RIVR 011E:NULL 011F:NULL "
            + "0120:PIPE 0121:PIPE 0122:NULL 0123:NULL 0124:NULL 0125:NULL 0126:NULL 0127:NULL 0128:NULL 0129:NULL 012A:NULL 012B:NULL 012C:SEAS 012D:NULL 012E:NULL 012F:NULL "
            + "0130:NULL 0131:NULL 0132:NULL 0133:NULL 0134:NULL 0135:NULL 0136:NULL 0137:NULL 0138:NULL 0139:NULL 013A:NULL 013B:NULL 013C:NULL 013D:NULL 013E:NULL 013F:NULL "
            + "0140:PIPE 0141:PIPE 0142:PIPE 0143:PIPE 0144:NULL 0145:ROAD 0146:NULL 0147:NULL 0148:SEAS 0149:SEAS 014A:SEAS 014B:SEAS 014C:SEAS 014D:NULL 014E:NULL 014F:NULL "
            + "0150:NULL 0151:NULL 0152:NULL 0153:NULL 0154:NULL 0155:NULL 0156:NULL 0157:NULL 0158:NULL 0159:NULL 015A:NULL 015B:NULL 015C:NULL 015D:NULL 015E:NULL 015F:NULL "
            + "0160:PIPE 0161:NULL 0162:PIPS 0163:PIPS 0164:NULL 0165:NULL 0166:NULL 0167:NULL 0168:REEF 0169:NULL 016A:NULL 016B:NULL 016C:NULL 016D:NULL 016E:NULL 016F:NULL ";
    
    private static final String propList="0180:SILO\", 20,-1]01C1:BASE\", 20,-1]01C2:CITY\", 20,-1]01C3:APRT\", 20,-1]01C4:PORT\", 20,-1]"
            + "01C5:HQTR\", 20, 0]01C6:BASE\", 20, 0]01C7:CITY\", 20, 0]01C8:APRT\", 20, 0]01C9:PORT\", 20, 0]"
            + "01CA:HQTR\", 20, 1]01CB:BASE\", 20, 1]01CC:CITY\", 20, 1]01CD:APRT\", 20, 1]01CE:PORT\", 20, 1]"
            + "01CF:HQTR\", 20, 2]01D0:BASE\", 20, 2]01D1:CITY\", 20, 2]01D2:APRT\", 20, 2]01D3:PORT\", 20, 2]"
            + "01D4:HQTR\", 20, 3]01D5:BASE\", 20, 3]01D6:CITY\", 20, 3]01D7:APRT\", 20, 3]01D8:PORT\", 20, 3]";
    
    /**
* @param args (optional) mapstring, name, credits
*/
    public static void main(String[] args) {
        
     //JSRulz - (Only used in main so scoped it here and removed static)
     String input;
        String output;
        
     String name;
        //String credits;
        
        if(args.length>=3)
        {
            input=args[0];
            name=args[1];
            //credits=args[2];
        }
        else
        {
            name="Spann-Island";
            //credits="CW Crew";
            input= "<?xml version=\"1.0\"?>\n" +    //Spann Island for testing
"<awMap version=\"1.1\" xmlns=\"urn:awmaps-schema\">\n" +
"  <meta>\n" +
"    <description>Dumped by WarLord.</description>\n" +
"  </meta>\n" +
"  <tileMap address=\"081C3FEC\" width=\"15\" height=\"10\">\n" +
"    <row>002A 0009 000A 000A 000A 000A 0069 000A 000A 000A 000A 000A 000A 000A 000B</row>\n" +
"    <row>0009 0029 0001 0087 0081 0061 0013 0061 0042 0001 0087 01CB 0021 01CB 002C</row>\n" +
"    <row>0028 0001 0001 0087 0080 0087 0033 0001 0040 01C2 0003 0001 01CA 01CB 002C</row>\n" +
"    <row>0028 01C2 01C2 0081 0062 004B 0088 0049 0040 0001 0022 0021 0083 01CB 002C</row>\n" +
"    <row>0028 0001 0001 0040 0001 002C 0009 0029 0040 01C2 0023 01C2 0080 0001 002C</row>\n" +
"    <row>0028 01C6 0081 0062 01C2 002B 0029 0087 00A0 0061 0061 0061 00C1 01C2 002C</row>\n" +
"    <row>0028 01C6 01C5 0021 0001 0001 0001 0087 0086 0021 004B 0037 0016 0017 006B</row>\n" +
"    <row>0048 0049 01C6 01C6 0003 0001 0043 0001 0001 0001 00A8 0029 0001 0001 002C</row>\n" +
"    <row>0009 000D 004A 0049 0023 01C2 0023 0086 01C2 0021 0013 0001 01C2 01C2 002C</row>\n" +
"    <row>0048 004C 002A 0048 004A 004A 004A 004A 004A 004A 0088 004A 004A 004A 004C</row>\n" +
"  </tileMap>\n" +
"</awMap>";
        }
        
        output=convert(name, input);
        
        System.out.println(output);
    }
    
    /**
* Converts the whole map. This is the important method. (along with convertProp and convertTile)
* @param name the name, the map shall have
* @param input the input map in Headphone's format
* @return
*/
    public static String convert(String name, String input)
    {
        input=input.substring(input.indexOf("<description>")+"<description>".length());
        String out= "{\n\t" +
                    "\"name\": \""+name+"\",\n\t" +
                    "\"credits\": \""+input.substring(0, input.indexOf("</description>"))+"\",\n\t\n\t";
        ArrayList<String> terrain=new ArrayList<String>();
        ArrayList<String> properties=new ArrayList<String>();
        Boolean test;
        
        //get the correctly sized array
        input=input.substring(input.indexOf("width=\"")+"width=\"".length());
        int width=Integer.parseInt(input.substring(0,input.indexOf("\"")));
        input=input.substring(input.indexOf("height=\"")+"height=\"".length());
        int height=Integer.parseInt(input.substring(0,input.indexOf("\"")));
        int map[][]= new int[width][height];
        
        //fill the map
        for(int j=0;j<map[0].length;j++)
        {
            input=input.substring(input.indexOf("<row>")+"<row>".length());
            for(int i=0; i<map.length; i++)
            {
                String tile=convertTile(input.substring(i*5, i*5+4));
                if(tile.equals(""))
                {
                 //JSRulz - (input) Made it take the data from the inner scope
                 // instead of the static scope
                    properties.add(convertProp(properties.size(),i,j,input.substring(i*5, i*5+4)));
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
    private static String convertProp(int index, int x, int y, String tile)
    {
        String out="["+index+", "+x+", "+y+", \"";
        int offset=propList.indexOf(tile);
        if(offset<0)
            System.out.println("Error: there is no prop '" + tile +"'");
        int team=Integer.parseInt(propList.substring(offset+15, offset+17).trim());
        
        out+=propList.substring(offset+5, offset+18);
        if(team!=-1 && players.indexOf(""+team)==-1)
            players+=team;
        return out;
    }
    
    /**
* Converts a single tile to its representation in the JSON format
* from http://headphone.110mb.com/Map_Maker.js -> reverseConvert
* @param tile the char code of the tile
* @return the JSON representation. "" in case of a building
*/
  //JSRulz - Prevented access if outside the class (to make it clear cut)
    private static String convertTile(String tile)
    {
        int offset=tileList.indexOf(tile);
        if(offset<0)
            return "";
        //JSRulz - BLAK == NULL in CWT map type :)
        return tileList.substring(offset+5, offset+9);
    }
    
}
