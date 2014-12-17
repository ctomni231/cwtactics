package net.wolfTec.types;

import net.wolfTec.utility.Assert;

public class PropertyType extends ObjectType {

    public int defense;
    public int vision;
    public int capturePoints;
    public boolean visionBlocker;
    public Object rocketsilo;
    public Object builds;
    public boolean looseAfterCaptured;
    public boolean blocker;

    @Override
    public void validate() {
        Assert.greaterEquals(defense, 0);
        Assert.greaterEquals(vision, 0);

        Assert.greaterEquals(capturePoints, 0);
    }
}