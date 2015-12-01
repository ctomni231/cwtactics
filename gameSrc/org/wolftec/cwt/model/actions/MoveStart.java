package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.collection.RingList;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.gameround.objecttypes.MoveType;

public class MoveStart extends AbstractAction {

  public static class MoveActionData {
    public int x;
    public int y;
    public int unitId;
    public RingList<Integer> movePath;

    public MoveActionData() {
      movePath = new RingList<Integer>(Constants.MAX_SELECTION_RANGE);
    }
  }

  private MoveActionData moveDto;

  @Override
  public String key() {
    return "moveStart";
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_MAP_ACTION;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {

    // check technical movement to tile type
    if (getMoveCosts(moveType, x, y) == Constants.INACTIVE) {
      return false;
    }

    // check some other rules like fog and units
    Tile tile = model.getTile(x, y);
    return (tile.data.visionTurnOwner == 0 || !NullUtil.isPresent(tile.unit));

    NullUtil.getOrThrow(position.unit);

    Unit unit = position.unit;
    MoveType mv = sheets.movetypes.get(unit.type.movetype);

    return ((model.isValidPosition(position.x + 1, position.y) && getMoveCosts(mv, position.x + 1, position.y) > Constants.INACTIVE)
        || (model.isValidPosition(position.x - 1, position.y) && getMoveCosts(mv, position.x - 1, position.y) > Constants.INACTIVE)
        || (model.isValidPosition(position.x, position.y - 1) && getMoveCosts(mv, position.x, position.y - 1) > Constants.INACTIVE)
        || (model.isValidPosition(position.x, position.y + 1) && getMoveCosts(mv, position.x, position.y + 1) > Constants.INACTIVE));
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.unitId;
    controller.data.p2 = controller.ui.source.x;
    controller.data.p3 = controller.ui.source.y;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    moveDto.movePath.clear();
    moveDto.unitId = controller.data.p1;
    moveDto.x = controller.data.p2;
    moveDto.y = controller.data.p3;
  }
}
