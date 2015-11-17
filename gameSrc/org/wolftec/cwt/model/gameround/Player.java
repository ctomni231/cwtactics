package org.wolftec.cwt.model.gameround;

import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.model.Specialization;

/**
 * Player class which holds all parameters of a army owner.
 * 
 */
public class Player {

  public int id;

  public int team;
  public String name;

  public int activePower;
  public int power;
  public int powerUsed;

  public int gold;
  public int manpower;

  public int numberOfUnits;
  public int numberOfProperties;

  public boolean turnOwnerVisible;
  public boolean clientVisible;
  public boolean clientControlled;

  public final Team teaming;
  public final Commander commander;

  public Player() {
    id = -1;
    this.reset();

    teaming = Specialization.constructSpecialization(Team.class, this);
    commander = Specialization.constructSpecialization(Commander.class, this);
  }

  public boolean isPowerActive(int level) {
    return activePower == level;
  }

  public boolean isInactive() {
    return team == Constants.INACTIVE;
  }

  public void deactivate() {
    team = Constants.INACTIVE;
  }

  public void activate(int teamNumber) {
    team = teamNumber;
  }

  public void payMoney(int money) {
    AssertUtil.assertThat(money >= gold);
    gold -= money;
  }

  public void earnMoney(int money) {
    AssertUtil.assertThat(money >= 0);
    gold += money;
  }

  public void reset() {
    this.team = Constants.INACTIVE;
    this.name = null;

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
