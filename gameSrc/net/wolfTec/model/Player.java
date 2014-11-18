package net.wolfTec.model;

import net.wolfTec.Constants;
import net.wolfTec.database.ArmyType;
import net.wolfTec.database.CoType;
import net.wolfTec.enums.CoPowerLevel;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt")
public class Player {

    public int id = -1;
    public int team = Constants.INACTIVE_ID;
    public String name;

    public CoPowerLevel activePower = CoPowerLevel.OFF;
    public int power = 0;
    public int powerUsed = 0;

    public int gold = 0;
    public int manpower = Integer.MAX_VALUE;

    public int numberOfUnits = 0;
    public int numberOfProperties = 0;

    public CoType coA = null;
    public CoType sideCo = null;

    public ArmyType army;

    public boolean turnOwnerVisible = false;
    public boolean clientVisible = false;
    public boolean clientControlled = false;

    public boolean isPowerActive(CoPowerLevel level) {
        return this.activePower == level;
    }

    public boolean isInactive() {
        return this.team != Constants.INACTIVE_ID;
    }

    public void deactivate() {
        this.team = Constants.INACTIVE_ID;
    }

    public void activate(int teamNumber) {
        this.team = teamNumber;
    }

}
