package net.wolfTec.renderer;

import net.wolfTec.cwt.Constants;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;

public class TileVariant {

    private Map<String, String> desc;
    private Array<Array<String>> connection;

    public TileVariant(Map<String, String> desc, Array<Array<String>> connection) {
        this.desc = desc;
        this.connection = connection;
    }

    /**
     * Grabs the short key for a given type.
     *
     * @param typeId
     * @return
     */
    public String grabShortKey(String typeId) {
        return (JSObjectAdapter.hasOwnProperty(desc, typeId)) ? desc.$get(typeId) : "";
    }

    /**
     * Returns the variant number in relation to a given set of neighbor types.
     *
     * @param typeN tile type ID in the north
     * @param typeE tile type ID in the east
     * @param typeS tile type ID in the south
     * @param typeW tile type ID in the west
     * @param typeNE tile type ID in the north east
     * @param typeSE tile type ID in the south east
     * @param typeSW tile type ID in the south west
     * @param typeNW tile type ID in the north west
     *
     */
    public int getVariant (String typeN, String typeE, String typeS, String typeW,
                           String typeNE, String typeSE, String typeSW, String typeNW) {

        // grab shorts
        typeN = grabShortKey(typeN);
        typeE = grabShortKey(typeE);
        typeS = grabShortKey(typeS);
        typeW = grabShortKey(typeW);
        typeNE = grabShortKey(typeNE);
        typeSE = grabShortKey(typeSE);
        typeSW = grabShortKey(typeSW);
        typeNW = grabShortKey(typeNW);

        // search variant
        for (int i = 0, e = connection.$length(); i < e; i++) {
            Array<String> cConn = connection.$get(i);

            if (cConn.$length() == 5) {

                // check_ plus
                if (cConn.$get(1) != "" && cConn.$get(1) != typeN) continue;
                if (cConn.$get(2) != "" && cConn.$get(2) != typeE) continue;
                if (cConn.$get(3) != "" && cConn.$get(3) != typeS) continue;
                if (cConn.$get(4) != "" && cConn.$get(4) != typeW) continue;

            } else {

                // check_ cross
                if (cConn.$get(1) != "" && cConn.$get(1) != typeN) continue;
                if (cConn.$get(2) != "" && cConn.$get(2) != typeNE) continue;
                if (cConn.$get(3) != "" && cConn.$get(3) != typeE) continue;
                if (cConn.$get(4) != "" && cConn.$get(4) != typeSE) continue;
                if (cConn.$get(5) != "" && cConn.$get(5) != typeS) continue;
                if (cConn.$get(6) != "" && cConn.$get(6) != typeSW) continue;
                if (cConn.$get(7) != "" && cConn.$get(7) != typeW) continue;
                if (cConn.$get(8) != "" && cConn.$get(8) != typeNW) continue;
            }

            return Integer.parseInt(cConn.$get(0).toString());
        }

        return Constants.INACTIVE_ID;
    }
}
