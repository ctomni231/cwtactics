package com.client.model.object;

import com.client.library.CustomWars_Library;
import com.system.data.sheets.Tile_Sheet;

/**
 * Holds an tile.
 * 
 * @author tapsi
 * @version 30.01.2010, #2
 */
public class Tile {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private Player 	owner;
	private Unit 	unit;
	private int 	capPoints;
	private Tile_Sheet sheet;
	private int		variation;
	private int		posX,posY;
    //JSR test variable
    private int     spreadID;

	
	
	/*
	 * CONSTRUCTORS
	 * ************ 
	 */

	public Tile( Tile_Sheet type , int x , int y , int variation , Player owner ){
		
		posX 		= x;
		posY 		= y;
		this.owner	= owner;
		this.sheet	= type;
		this.variation = variation;
		spreadID = -1;
        CustomWars_Library.resetCapPoints(this);
	}
	
	
	
	/*
	 * ACCESSING METHODS
	 * *****************
	 */

	public Player getOwner() {
		return owner;
	}
	
	public void setOwner(Player owner) {
		this.owner = owner;
	}
	
	public Unit getUnit() {
		return unit;
	}
	
	public void setUnit(Unit unit) {
		this.unit = unit;
	}
	
	public int getCapPoints() {
		return capPoints;
	}
	
	public void setCapPoints(int capPoints) {
		this.capPoints = capPoints;
	}

	public Tile_Sheet sheet(){
		return sheet;
	}
	
	public int getVariation() {
		return variation;
	}

	public void setVariation(int variation) {
		this.variation = variation;
	}

	public int getPosX() {
		return posX;
	}

	public void setPosX(int posX) {
		this.posX = posX;
	}

	public int getPosY() {
		return posY;
	}

	public void setPosY(int posY) {
		this.posY = posY;
	}

    //JSR test function
    public int getSpreadID(){
        return spreadID;
    }
	
	public void setSpreadID(int id){
        spreadID = id;
    }

	/*
    public boolean getChange(){
        return change;
    }

    public void setChange( boolean chng ){
        change = chng;
    }*/



	/*
	 * OUTPUT METHODS
	 * **************
	 */
	
    @Override
	public String toString(){
		String s;
		
		s = "FIELD ("+posX+","+posY+")";
		if( unit != null ) s += " HAS UNIT "+unit;
		
		return s;
	}
	
}

