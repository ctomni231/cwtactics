package net.wolfTec.model;

import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt")
public class Tile {
    //this.type = null;

    public Unit unit = null;
    public Property property = null;

    public int visionTurnOwner = 0;
    public int variant = 0;
    public int visionClient = 0;

    public boolean isOccupied () {
        return this.unit != null;
    }

    public boolean isVisible () {
        return this.visionTurnOwner > 0;
    }
}
