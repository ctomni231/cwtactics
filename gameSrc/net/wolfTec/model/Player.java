package net.wolfTec.model;

import net.wolfTec.Constants;

public class Player {

    public int id = -1;
    public int team = Constants.INACTIVE_ID;
    public String name;

    public int activePower = Constants.INACTIVE_ID;
    public int power = 0;
    public int powerUsed = 0;

    public int gold = 0;
    public int manpower = Integer.MAX_VALUE;

    public int numberOfUnits = 0;
    public int numberOfProperties = 0;

    // public int coA = null;
    public boolean turnOwnerVisible = false;
    public boolean clientVisible = false;
    public boolean clientControlled = false;

/*    isPowerActive (level) {
        return this.activePower === level;
    },*/

    public boolean isInactive () {
        return this.team != Constants.INACTIVE_ID;
    }

    public void deactivate () {
        this.team = Constants.INACTIVE_ID;
    }

    public void activate (int teamNumber) {
        this.team = teamNumber;
    }

}
