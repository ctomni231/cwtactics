package com.engine;

import java.util.ArrayList;
import java.util.List;

/**
 * Only for tests... :P
 * Because of that no getter / setter
 *
 * @author BlackCat
 */
public class DetachedMapUtil {

    public int mapHeight;
    public int mapWidht;
    public String filler;
    public String[][] tiles = new String[100][100];
    public List<MapPlayer> players = new ArrayList<MapPlayer>();

    public static class MapPlayer {
        public String name;
        public int gold;
        public int team;
        public List<PlayerUnit> units = new ArrayList<PlayerUnit>();
    }

    public static class PlayerUnit {
        public int x;
        public int y;
        public String type;
        public int hp;
        public int ammo;
        public int fuel;
    }

    public static class MapProperty {
        public int x;
        public int y;
        public String type;
        public int capturePoints;
        public int owner;
    }

    public static void loadMapIntoEngine(DetachedMapUtil map,
                                            EngineHolder eh,
                                            Engine e ){

        eh.callFunction( EngineHolder.ENGINE_MODULE.PERSISTENCE,
                "load", e.evalExpression( DetachedMapUtil.toJSON(map) ) );
    }

    private static String toJSON(DetachedMapUtil map){
        StringBuilder sb = new StringBuilder();
        
        sb.append("{\n");
            
            // META
            sb.append("\t").append("mapWidth:").append(map.mapWidht).append(",\n");
            sb.append("\t").append("mapHeight:").append(map.mapHeight).append(",\n");
            sb.append("\t").append("filler:\"").append(map.filler).append("\",\n");

            // DATA
            sb.append("\t").append("data:{\n");
            boolean xF = true;
            for( int x=0; x<map.tiles.length; x++ ){

                boolean created = false;
                boolean yF = true;
                for( int y=0; y<map.tiles[x].length; y++ ){

                    if( map.tiles[x][y] == null ) continue;

                    if( !created ){
                        sb.append("\t\t");
                        if( !xF ) sb.append(",");
                        sb.append("\"").append(x).append("\":{\n");
                    }

                    sb.append("\t\t\t");
                    if( !yF ) sb.append(",");
                    sb.append("\"").append(y).append("\":\"")
                            .append( map.tiles[x][y] ).append("\"\n");

                    yF = false;
                    created = true;
                }

                if( created ){
                    sb.append("\t\t").append("}\n");
                    xF = false;
                }

            }

            sb.append("\t},\n");

            // PLAYERS
            if( map.players.size() > 0 ){
                sb.append("\t").append("players:[\n");

                int i = 0;
                for( MapPlayer player : map.players ){
                    sb.append("\t");
                    if( i>0 ) sb.append(",");
                    sb.append("{\n");

                    sb.append("\t\t").append("name:\"").append(player.name).append("\",\n");
                    sb.append("\t\t").append("gold:").append(player.gold).append(",\n");
                    sb.append("\t\t").append("team:").append(player.team).append(",\n");

                    // UNITS
                    if( player.units.size() > 0 ){
                       sb.append("\t\t").append("units:[\n");
                       boolean fUnit = true;
                       for( PlayerUnit unit: player.units ){
                           sb.append("\t\t\t");
                           if( !fUnit ) sb.append(",");
                           sb.append("{\n");
                           
                               sb.append("\t\t\t\t").append("x:").append(unit.x).append(",\n");
                               sb.append("\t\t\t\t").append("y:").append(unit.y).append(",\n");
                               sb.append("\t\t\t\t").append("ammo:").append(unit.ammo).append(",\n");
                               sb.append("\t\t\t\t").append("fuel:").append(unit.fuel).append(",\n");
                               sb.append("\t\t\t\t").append("hp:").append(unit.hp).append(",\n");
                               sb.append("\t\t\t\t").append("type:\"").append(unit.type).append("\",\n");
                               sb.append("\t\t\t\t").append("owner:").append(i).append("\n");

                           sb.append("\t\t\t").append("}\n");
                           fUnit=false;
                       }
                       sb.append("\t\t").append("]\n");
                    }
                    sb.append("\t").append("}\n");
                    i++;
                }
                sb.append("\t").append("]\n");
            }

        sb.append("}\n");

        return sb.toString();
    }

    public static void main( String[] args ){
        DetachedMapUtil util = new DetachedMapUtil();

        util.mapHeight = 10;
        util.mapWidht = 10;

        util.filler = "PLIN";

        util.tiles[5][2] = "MNTN";
        util.tiles[6][2] = "HQ";
        util.tiles[9][5] = "FRST";
        util.tiles[1][3] = "MNTN";
        util.tiles[1][4] = "MNTN";
        util.tiles[2][7] = "FRST";
        util.tiles[2][8] = "FRST";
        util.tiles[2][9] = "FRST";

        PlayerUnit unit;
        MapPlayer p1 = new MapPlayer();
        p1.name = "P1";
        p1.gold = 2000;
        p1.team = 1;
        util.players.add(p1);

        unit = new PlayerUnit();
        unit.ammo = 1;
        unit.fuel = 10;
        unit.hp = 30;
        unit.x = 0;
        unit.y = 0;
        unit.type = "INFT_OS";
        p1.units.add(unit);

        unit = new PlayerUnit();
        unit.ammo = -1;
        unit.fuel = 40;
        unit.hp = 50;
        unit.x = 1;
        unit.y = 1;
        unit.type = "INFT_OS";
        p1.units.add(unit);


        MapPlayer p2 = new MapPlayer();
        p2.name = "P2";
        p2.gold = 12000;
        p2.team = 2;
        util.players.add(p2);

        unit = new PlayerUnit();
        unit.ammo = 1;
        unit.fuel = 10;
        unit.hp = 30;
        unit.x = 3;
        unit.y = 4;
        unit.type = "INFT_OS";
        p2.units.add(unit);

        // PRINT OUT
        System.out.println( DetachedMapUtil.toJSON(util) );
    }
}