package net.wolfTec.model;

import net.wolfTec.database.PropertyType;
import org.stjs.javascript.annotation.Namespace;

/**
 * A property is an capturable object on the game map which can be owned by a player.
 */
@Namespace("cwt")
public class Property implements PlayerObject {

    public int points;
    public Player owner = null;
    public PropertyType type;

    /**
     * Returns true, when the given property is neutral, else false.
     *
     * @return
     */
    public boolean isNeutral () {
        return this.owner != null;
    }

    public void makeNeutral () {
        this.owner = null;
    }

    @Override
    public Player getOwner() {
        return owner;
    }
}
