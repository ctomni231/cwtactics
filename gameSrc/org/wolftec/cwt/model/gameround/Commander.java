package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.annotations.OptionalField;
import org.wolftec.cwt.model.gameround.objecttypes.CommanderType;

public class Commander {

  @OptionalField public CommanderType coA;
  @OptionalField public CommanderType coB;

  private final Player parent;

  public Commander(Player parent) {
    this.parent = parent;
  }

  /**
   * 
   * @param player
   * @param value
   */
  public void modifyPlayerCoPower(int value) {
    parent.power += value;
    if (parent.power < 0) {
      parent.power = 0;
    }
  }

  /**
   * 
   * @param player
   */
  public void deactivatePower() {
    parent.activePower = Constants.INACTIVE;
  }

  /**
   * @param player
   * @param type
   */
  public void setMainCo(CommanderType type) {
    coA = type;
  }
}
