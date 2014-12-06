package net.wolfTec.model;

import net.wolfTec.database.PropertyType;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.annotation.Namespace;

/**
 * A property is an capturable object on the game map which can be owned by a player.
 */
@Namespace("cwt")
public class Property implements PlayerObject {

    public int points;
    public Player owner;
    public PropertyType type;

    /**
     * Returns **true** when the given **property** is a factory, else **false**.
     *
     * @return
     */
    public boolean isFactory () {
        return (type.builds != JSGlobal.undefined);
    }

    /**
     * Returns true if a property id is a rocket silo. A rocket silo has the ability to fire a rocket to a position
     * with an impact.
     *
     * @return
     */
    public boolean isRocketSilo () {
        return (type.rocketsilo != JSGlobal.undefined);
    }

    /**
     * Returns **true** when a **property** can be captured, else **false**.
     *
     * @returns {boolean}
     */
    public boolean canBeCaptured () {
        return type.capturePoints > 0;
    }

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
