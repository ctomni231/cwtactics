package org.wolftec.cwt.model.tilevariants;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.javascript.JsUtil;

public class TileVariantInfo {

  Map<String, String>  desc;
  Array<Array<String>> connection;

  public TileVariantInfo(Map<String, String> desc, Array<Array<String>> connection) {
    this.desc = desc;
    this.connection = connection;
  }

  /**
   * Grabs the short key for a given type.
   *
   * @param type
   * @return
   */
  public String grabShortKey(String type) {
    // TODO
    if (NullUtil.isPresent(type) && NullUtil.isPresent(desc.$get(type))) {
      return desc.$get(type);
    } else {
      return "";
    }
  }

  /**
   * Returns the variant number in relation to a given set of neighbor types.
   *
   * @param {string}
   *          tpN tile type ID in the north
   * @param {string}
   *          tpE tile type ID in the east
   * @param {string}
   *          tpS tile type ID in the south
   * @param {string}
   *          tpW tile type ID in the west
   * @param {string?}
   *          tpNE tile type ID in the north east
   * @param {string?}
   *          tpSE tile type ID in the south east
   * @param {string?}
   *          tpSW tile type ID in the south west
   * @param {string?}
   *          tpNW tile type ID in the north west
   *
   */
  public int getVariant(String typeN, String typeE, String typeS, String typeW, String typeNE, String typeSE, String typeSW, String typeNW) {

    // grab shorts
    typeN = this.grabShortKey(typeN);
    typeNE = this.grabShortKey(typeNE);
    typeE = this.grabShortKey(typeE);
    typeSE = this.grabShortKey(typeSE);
    typeS = this.grabShortKey(typeS);
    typeSW = this.grabShortKey(typeSW);
    typeW = this.grabShortKey(typeW);
    typeNW = this.grabShortKey(typeNW);

    // search variant
    for (int i = 0, e = connection.$length(); i < e; i++) {
      Array<String> cConn = connection.$get(i);
      if (cConn.$length() == 5) {

        // check_ plus
        if (cConn.$get(1) != "" && cConn.$get(1) != typeN) {
          continue;
        }

        if (cConn.$get(2) != "" && cConn.$get(2) != typeE) {
          continue;
        }

        if (cConn.$get(3) != "" && cConn.$get(3) != typeS) {
          continue;
        }

        if (cConn.$get(4) != "" && cConn.$get(4) != typeW) {
          continue;
        }

      } else {

        // check_ cross
        if (cConn.$get(1) != "" && cConn.$get(1) != typeN) {
          continue;
        }

        if (cConn.$get(2) != "" && cConn.$get(2) != typeNE) {
          continue;
        }

        if (cConn.$get(3) != "" && cConn.$get(3) != typeE) {
          continue;
        }

        if (cConn.$get(4) != "" && cConn.$get(4) != typeSE) {
          continue;
        }

        if (cConn.$get(5) != "" && cConn.$get(5) != typeS) {
          continue;
        }

        if (cConn.$get(6) != "" && cConn.$get(6) != typeSW) {
          continue;
        }

        if (cConn.$get(7) != "" && cConn.$get(7) != typeW) {
          continue;
        }

        if (cConn.$get(8) != "" && cConn.$get(8) != typeNW) {
          continue;
        }
      }

      // TODO
      return ((Integer) ((Object) cConn.$get(0)));
    }

    return JsUtil.throwError("Unexpected");
  }
}
