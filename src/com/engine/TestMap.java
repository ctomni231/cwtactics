package com.engine;

import com.engine.DetachedMapUtil.MapPlayer;
import com.engine.DetachedMapUtil.PlayerUnit;

/**
 * TestMap.java
 *
 * This class was made so I can make my own test maps to test the engine with.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.27.12
 */

public class TestMap {

	public static String createTestMap(){
		DetachedMapUtil util = new DetachedMapUtil();

		//UNCOMMENT HERE TO TEST THE MAP FILE
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
        
        return DetachedMapUtil.toJSON(util);
	}
}
