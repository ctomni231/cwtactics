package org.wolftec.cwt.model;

import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.Constants;

/**
 * Player class which holds all parameters of a army owner.
 * 
 */
public class Player {

  public int       id;

  public int       team;
  public String    name;

  public Commander coA;
  public int       activePower;
  public int       power;
  public int       powerUsed;

  public int       gold;
  public int       manpower;

  public int       numberOfUnits;
  public int       numberOfProperties;

  public boolean   turnOwnerVisible;
  public boolean   clientVisible;
  public boolean   clientControlled;

  public Player() {
    id = -1;
    this.reset();
  }

  public boolean isPowerActive(int level) {
    return activePower == level;
  }

  public boolean isInactive() {
    return team != Constants.INACTIVE;
  }

  public void deactivate() {
    team = Constants.INACTIVE;
  }

  public void activate(int teamNumber) {
    team = teamNumber;
  }

  public void reset() {
    this.team = Constants.INACTIVE;
    this.name = null;

    this.coA = null;
    this.activePower = Constants.INACTIVE;
    this.power = 0;
    this.powerUsed = 0;

    this.gold = 0;
    this.manpower = JSObjectAdapter.$js("Math.POSITIVE_INFINITY");

    this.numberOfUnits = 0;
    this.numberOfProperties = 0;

    this.turnOwnerVisible = false;
    this.clientVisible = false;
    this.clientControlled = false;
  }
}
