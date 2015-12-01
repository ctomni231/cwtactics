package org.wolftec.cwt.model.gameround.objecttypes;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.model.gameround.Tile;

public class MoveType extends SheetType {
  public Map<String, Integer> costs;

  public MoveType() {
    costs = JSCollections.$map();
  }

  public int getCostsToMoveOn(Tile tile) {
    int v;

    if (NullUtil.isPresent(tile.property)) {
      v = costs.$get(tile.property.type.ID);
    } else {
      v = costs.$get(tile.type.ID);
    }

    if (NullUtil.isPresent(v)) {
      return v;
    }

    /*
     * a '*' acts as wildcard and will be used for every kind of id that does
     * not matches in the first place
     */
    v = costs.$get("*");
    if (NullUtil.isPresent(v)) {
      return v;
    }

    return Constants.INACTIVE;
  }
}
