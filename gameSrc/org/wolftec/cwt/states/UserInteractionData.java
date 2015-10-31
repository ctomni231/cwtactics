package org.wolftec.cwt.states;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.InformationList;
import org.wolftec.cwt.logic.Action;
import org.wolftec.cwt.logic.ActionManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.PositionData;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.ManagedClass;
import org.wolftec.cwt.system.MatrixSegment;
import org.wolftec.cwt.system.RingList;
import org.wolftec.cwt.util.AssertUtil;
import org.wolftec.cwt.util.NumberUtil;

public class UserInteractionData implements ManagedClass, InformationList {

  private Log log;

  private ActionManager actions;

  public Player actor;

  public PositionData source;
  public PositionData target;
  public PositionData actionTarget;

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

  @Override
  public void onConstruction() {
    source = new PositionData();
    target = new PositionData();
    actionTarget = new PositionData();

    movePath = new RingList<>(Constants.MAX_SELECTION_RANGE);
    infos = new RingList<>(50);

    targets = new MatrixSegment(Constants.MAX_SELECTION_RANGE);
  }

  @Override
  public void addInfo(String key, boolean flag) {
    if (flag) {
      infos.push(key);
      log.info("added user action [" + key + "]");
    }
  }

  @Override
  public void cleanInfos() {
    infos.clear();
    infoIndex = 0;
    log.info("cleaned user actions");
  }

  @Override
  public int getNumberOfInfos() {
    return infos.getSize();
  }

  public Action getAction() {
    return actions.getAction(action);
  }

  @Override
  public void increaseIndex() {
    infoIndex++;
    if (infoIndex == getNumberOfInfos()) {
      infoIndex = 0;
    }
    log.info("current selected user action [" + getInfo() + "]");
  }

  @Override
  public void decreaseIndex() {
    infoIndex--;
    if (infoIndex < 0) {
      infoIndex = getNumberOfInfos() - 1;
    }
    log.info("current selected user action [" + getInfo() + "]");
  }

  @Override
  public String getInfo() {
    return infos.get(infoIndex);
  }

  @Override
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
