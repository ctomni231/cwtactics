package net.wolfTec.model;

import net.wolfTec.database.TileType;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt")
public class Tile {

    public Unit unit;
    public Property property;
    public TileType type;

    public int visionTurnOwner = 0;
    public int variant = 0;
    public int visionClient = 0;

    /**
     *
     * @return true if the property is occupied, else false
     */
    public boolean isOccupied () {
        return this.unit != null;
    }

    public boolean isVisible () {
        return this.visionTurnOwner > 0;
    }
}
