package com.client.model;

import com.client.model.object.Game;
import com.client.model.object.Tile;
import java.util.ArrayList;

/**
 *
 * @author Crecen
 */
public class MoveAlt {

    private static ArrayList<Integer> anchorX;
    private static ArrayList<Integer> anchorY;
    private static ArrayList<Tile> moveParts;
    private static int anchorx = -1;
    private static int anchory = -1;
    private static int moverx = -1;
    private static int movery = -1;
    private static int storeSpread = -1;
    private static int baseSpread = -1;

    public static void init(){
        anchorX = new ArrayList<Integer>();
        anchorY = new ArrayList<Integer>();
        moveParts = new ArrayList<Tile>();
        anchorx = -1;
        anchory = -1;
        moverx = -1;
        movery = -1;
        storeSpread = -1;
        baseSpread = -1;
    }

    public static void clearWay(){
        anchorx = -1;
        anchory = -1;
        moverx = -1;
        movery = -1;
        storeSpread = -1;
        baseSpread = -1;
        anchorX.clear();
        anchorY.clear();
        for(int i = 0; i < Game.getMap().getSizeX(); i++){
            for(int j = 0; j < Game.getMap().getSizeY(); j++){
                Game.getMap().getTile(i, j).setChange(false);
                Game.getMap().getTile(i, j).setSpreadID(-1);
            }
        }
    }

    public static ArrayList<Tile> getWay(){
        moveParts = new ArrayList<Tile>();
        for(int i = 0; i < anchorX.size(); i++){
            moveParts.add(Game.getMap().getTile(
                    anchorX.get(i), anchorY.get(i)));
        }
        return moveParts;
    }

    public static int getWaySize(){
        return moveParts.size();
    }

    //This starts movement across tiles
    public static void moveTag(int spread, int x, int y){
        if(x < 0 || x >= Game.getMap().getSizeX())
            return;
        if(y < 0 || y >= Game.getMap().getSizeY())
            return;

        spreadTag(spread, x, y);

        anchorX.clear();
        anchorY.clear();
        anchorx = x;
        anchory = y;
        moverx = x;
        movery = y;
        storeSpread = spread;
        baseSpread = spread;
    }

    //This function helps movement work across tiles.
    public static void spreadMove(int cursorx, int cursory){
        if(anchorx >= 0 && Game.getMap().getTile(cursorx, cursory).
                getSpreadID() >= 0){
            int previous = anchorX.size()-1;
            if(cursorx != moverx){
                anchorX.add(moverx);
                anchorY.add(movery);
                if(cursorx > moverx)
                    moverx++;
                else if(cursorx < moverx)
                    moverx--;
                if(Game.getMap().getTile(moverx, movery).getChange())
                    storeSpread = -1;
                storeSpread--;
            }else if(cursory != movery){
                anchorX.add(moverx);
                anchorY.add(movery);
                if(cursory > movery)
                    movery++;
                else if(cursory < movery)
                    movery--;
                if(Game.getMap().getTile(moverx, movery).getChange())
                    storeSpread = -1;
                storeSpread--;
            }
            //Check to see the previous entry
            if(previous > -1){
                if(moverx == anchorX.get(previous) &&
                movery == anchorY.get(previous)){
                    if(anchorX.size() > 0){
                        Game.getMap().getTile(anchorX.remove(anchorX.size()-1),
                                anchorY.remove(anchorY.size()-1)).
                                setChange(false);
                        storeSpread = Game.getMap().getTile(moverx, movery).
                                getSpreadID();
                    }
                }
            }
            //Don't track those nullified tiles...
            if(Game.getMap().getTile(cursorx, cursory).getSpreadID() < 0){
                moverx = anchorx;
                movery = anchory;
                storeSpread = -1;
            }

            //If it wasn't the previous entry, finds the most direct path
            //to the target in range.
            if(storeSpread < 0){
                anchorX.clear();
                anchorY.clear();
                for(int i = 0; i < Game.getMap().getSizeX(); i++){
                    for(int j = 0; j < Game.getMap().getSizeY(); j++)
                        Game.getMap().getTile(i, j).setChange(false);
                }

                nearestPath(cursorx, cursory);
            }

            if(moverx >= 0 && movery >= 0)
                Game.getMap().getTile(moverx, movery).setChange(true);
        }
    }

    //This function gives spread values to tiles...
    private static void spreadTag(int spread, int x, int y){
        //Checks to see if a tile is greater then the map size
        if(x < 0 || x >= Game.getMap().getSizeX())
            return;
        if(y < 0 || y >= Game.getMap().getSizeY())
            return;

        //Creates a spreading value for each direction
        int lowerY = y-spread;
        int upperY = y+spread;
        int leftX = x-spread;
        int rightX = x+spread;

        if(lowerY < 0)
            lowerY = 0;
        if(upperY >= Game.getMap().getSizeY())
            upperY = Game.getMap().getSizeY();
        if(leftX < 0)
            leftX = 0;
        if(rightX >= Game.getMap().getSizeX())
            rightX = Game.getMap().getSizeX();

        Game.getMap().getTile(x, y).setSpreadID(spread);

        for(int k = spread; k >= 0; k--){
            for(int i = leftX; i < rightX; i++){
                for(int j = lowerY; j < upperY; j++){
                    if(Game.getMap().getTile(i, j).getSpreadID() == k){
                        if(j+1 < Game.getMap().getSizeY()){
                            if(Game.getMap().getTile(i, j+1).getSpreadID() < k)
                                Game.getMap().getTile(i, j+1).setSpreadID(k-1);
                        }
                        if(j-1 >= 0){
                            if(Game.getMap().getTile(i, j-1).getSpreadID() < k)
                                Game.getMap().getTile(i, j-1).setSpreadID(k-1);
                        }
                        if(i+1 < Game.getMap().getSizeX()){
                            if(Game.getMap().getTile(i+1, j).getSpreadID() < k)
                                Game.getMap().getTile(i+1, j).setSpreadID(k-1);
                        }
                        if(i-1 >= 0){
                            if(Game.getMap().getTile(i-1, j).getSpreadID() < k)
                                Game.getMap().getTile(i-1, j).setSpreadID(k-1);
                        }
                    }
                }
            }
        }
    }

    private static void nearestPath(int cursorx, int cursory){
        int x = cursorx;
        int y = cursory;
        moverx = x;
        movery = y;
        int start = Game.getMap().getTile(x, y).getSpreadID();
        storeSpread = baseSpread;

        while(start < Game.getMap().getTile(anchorx, anchory).getSpreadID()){
            start = Game.getMap().getTile(x, y).getSpreadID();
            Game.getMap().getTile(x, y).setChange(true);
            storeSpread--;
            anchorX.add(0,x);
            anchorY.add(0,y);
            if(x > 0){
                if(Game.getMap().getTile(x-1, y).getSpreadID() >= 0 &&
                    Game.getMap().getTile(x-1, y).getSpreadID() > start){
                    x--;
                    continue;
                }
            }
            if(x+1 < Game.getMap().getSizeX()){
                if(Game.getMap().getTile(x+1, y).getSpreadID() >= 0 &&
                        Game.getMap().getTile(x+1, y).getSpreadID() > start){
                    x++;
                    continue;
                }
            }
            if(y > 0){
                if(Game.getMap().getTile(x, y-1).getSpreadID() >= 0 &&
                        Game.getMap().getTile(x, y-1).getSpreadID() > start){
                    y--;
                    continue;
                }
            }
            if(y+1 < Game.getMap().getSizeY()){
                if(Game.getMap().getTile(x, y+1).getSpreadID() >= 0 &&
                        Game.getMap().getTile(x, y+1).getSpreadID() > start){
                    y++;
                    continue;
                }
            }
            break;
        }
    }
}
