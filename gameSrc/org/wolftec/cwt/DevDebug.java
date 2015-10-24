package org.wolftec.cwt;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.cwt.core.collections.ObjectUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.sheets.types.SheetType;
import org.wolftec.cwt.states.UserInteractionData;

/**
 * Simple module to grab system information at runtime.
 * 
 */
public class DevDebug implements Injectable {

  @SyntheticType
  private static class StringHolder {
    String value;
  }

  private UserInteractionData uiData;
  private ModelManager model;

  private Log log;

  @Override
  public void onConstruction() {
    JSObjectAdapter.$put(Global.window, "__cwtDebug__", this);
  }

  private void logValue(StringHolder result, int indention, Object value) {
    if (value == null) {
      result.value += "null";

    } else if (value instanceof Unit) {
      logUnit(result, indention, (Unit) value);

    } else if (value instanceof Player) {
      logPlayer(result, indention, (Player) value);

    } else if (value instanceof Tile) {
      logTile(result, indention, (Tile) value);

    } else if (value instanceof SheetType) {
      result.value += "ID(" + ((SheetType) value).ID + ")";

    } else {
      result.value += value.toString();
    }
  }

  private void logUnit(StringHolder result, int indention, Unit unit) {
    logSpaces(result, indention);
    result.value += "UNIT{\n";
    logProperties(result, indention + 2, unit);
    logSpaces(result, indention);
    result.value += "}";
  }

  private void logTile(StringHolder result, int indention, Tile tile) {
    logSpaces(result, indention);
    result.value += "TILE{\n";
    logProperties(result, indention + 2, tile);
    logSpaces(result, indention);
    result.value += "}";
  }

  private void logPlayer(StringHolder result, int indention, Player player) {
    logSpaces(result, indention);
    result.value += "PLAYER{\n";
    logProperties(result, indention + 2, player);
    logSpaces(result, indention);
    result.value += "}";
  }

  private void logSpaces(StringHolder result, int amount) {
    for (int i = 0; i < amount; i++) {
      result.value += " ";
    }
  }

  private void logProperties(StringHolder result, int indention, Object o) {
    ObjectUtil.forEachMapValue(ObjectUtil.instanceAsMap(o), (key, value) -> {
      logSpaces(result, indention);
      result.value += "(" + key + ":";
      logValue(result, indention, value);
      result.value += ")\n";
    });
  }

  public void logTileAt(int x, int y) {
    if (!model.isValidPosition(x, y)) {
      log.info("ILLEGAL_POSITION");
    }

    Tile tile = model.getTile(x, y);

    StringHolder result = new StringHolder();
    result.value = "\n";
    logTile(result, 0, tile);

    log.info(result.value);
  }

  public void logUnitAt(int x, int y) {
    if (!model.isValidPosition(x, y)) {
      log.info("ILLEGAL_POSITION");
    }

    Unit unit = model.getTile(x, y).unit;

    StringHolder result = new StringHolder();
    result.value = "\n";

    if (NullUtil.isPresent(unit)) {
      logUnit(result, 0, unit);
    } else {
      result.value += "NO_UNIT";
    }

    log.info(result.value);
  }

  public void logMap() {
    StringHolder result = new StringHolder();
    result.value = "\n";

    int typeCounter = 10;
    Map<String, String> typeMap = JSCollections.$map();

    for (int y = 0; y < model.mapHeight; y++) {
      result.value += "[ ";
      for (int x = 0; x < model.mapWidth; x++) {
        Tile tile = model.getTile(x, y);

        if (NullUtil.isPresent(tile.type)) {

          if (!NullUtil.isPresent(typeMap.$get(tile.type.ID))) {
            typeMap.$put(tile.type.ID, typeCounter + "");
            typeCounter++;
          }

          result.value += typeMap.$get(tile.type.ID);
        } else {
          result.value += "ERR";
        }
        result.value += "-";
      }
      result.value += " ]\n";
    }

    result.value += "\n";
    result.value += "Typemap:";
    result.value += "\n";
    ObjectUtil.forEachMapValue(typeMap, (key, value) -> {
      result.value += key + " => " + value;
      result.value += "\n";
    });

    log.info(result.value);
  }

  public void logUiTargets() {
    String result = "\n";
    result += "Left Corner {" + uiData.targets.getCenterX() + "," + uiData.targets.getCenterY() + "} \n";
    for (int y = 0; y < uiData.targets.getDataArray().$length(); y++) {
      result += "[ ";
      for (int x = 0; x < uiData.targets.getDataArray().$length(); x++) {
        int value = uiData.targets.getValue(x, y);

        if (value == Constants.INACTIVE) {
          result += "##";
        } else {
          result += ((100 + value) + "").substring(1);
        }

        if (x < uiData.targets.getDataArray().$length() - 1) {
          result += "-";
        }
      }
      result += " ]\n";
    }
    log.info(result);
  }

  public void logUiMovepath() {
    String result = "\n";

    result += "[ ";
    for (int y = 0; y < uiData.movePath.getSize(); y++) {
      switch (uiData.movePath.get(y)) {
        case MoveLogic.MOVE_CODES_DOWN:
          result += "D";
          break;

        case MoveLogic.MOVE_CODES_UP:
          result += "U";
          break;

        case MoveLogic.MOVE_CODES_LEFT:
          result += "L";
          break;

        case MoveLogic.MOVE_CODES_RIGHT:
          result += "R";
          break;

        default:
          break;
      }

      if (y < uiData.movePath.getSize() - 1) {
        result += "-";
      }
    }
    result += " ]";

    log.info(result);
  }
}
