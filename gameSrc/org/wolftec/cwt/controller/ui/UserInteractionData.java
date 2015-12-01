package org.wolftec.cwt.controller.ui;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.NumberUtil;
import org.wolftec.cwt.core.annotations.InjectedPostConstruction;
import org.wolftec.cwt.core.collection.MatrixSegment;
import org.wolftec.cwt.core.collection.RingList;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.model.Actions;
import org.wolftec.cwt.model.actions.AbstractAction;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.PositionData;

public class UserInteractionData {

  @InjectedPostConstruction public Actions actions;

  private Log log;

  public Player actor;

  public final PositionData source;
  public final PositionData target;
  public final PositionData actionTarget;

  public RingList<Integer> movePath;

  public RingList<String> infos;
  public int infoIndex;

  public String action;
  public int actionCode;

  public String actionData;
  public int actionDataCode;

  public MatrixSegment targets;

  public int cursorX;
  public int cursorY;

  public boolean preventMovepathGeneration;

  public UserInteractionData() {
    source = new PositionData();
    target = new PositionData();
    actionTarget = new PositionData();

    movePath = new RingList<>(Constants.MAX_SELECTION_RANGE);
    infos = new RingList<>(50);

    targets = new MatrixSegment(Constants.MAX_SELECTION_RANGE);
  }

  public void addInfo(String key, boolean flag) {
    if (flag) {
      infos.push(key);
      log.info("added user action [" + key + "]");
    }
  }

  public void cleanInfos() {
    infos.clear();
    infoIndex = 0;
    log.info("cleaned user actions");
  }

  public int getNumberOfInfos() {
    return infos.getSize();
  }

  public AbstractAction getAction() {
    return actions.getActionByKey(action);
  }

  public void increaseIndex() {
    infoIndex++;
    if (infoIndex == getNumberOfInfos()) {
      infoIndex = 0;
    }
    log.info("current selected user action [" + getInfo() + "]");
  }

  public void decreaseIndex() {
    infoIndex--;
    if (infoIndex < 0) {
      infoIndex = getNumberOfInfos() - 1;
    }
    log.info("current selected user action [" + getInfo() + "]");
  }

  public String getInfo() {
    return infos.get(infoIndex);
  }

  public String getInfoAtIndex(int index) {
    return infos.get(index);
  }

  public void selectInfoAtIndex(int index) {
    AssertUtil.assertThat(index >= 0 && index < getNumberOfInfos(), "IllegalIndex");
    infoIndex = 0;
    updateActionData();
  }

  public void updateActionData() {
    actionData = getInfo();
    actionDataCode = NumberUtil.asIntOrElse(actionData, Constants.INACTIVE);
  }

  public void reset() {
    cursorX = 0;
    cursorY = 0;
    actor = null;
    source.clean();
    target.clean();
    actionTarget.clean();
    action = "";
    actionCode = -1;
    actionData = "";
    actionDataCode = -1;
    movePath.clear();
    cleanInfos();
  }
}
