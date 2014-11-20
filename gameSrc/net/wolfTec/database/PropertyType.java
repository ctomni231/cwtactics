package net.wolfTec.database;

import net.wolfTec.utility.Assert;

public class PropertyType extends ObjectType<PropertyType> {

    public int defense;
    public int vision;
    public int capturePoints;
    public boolean visionBlocker;

    @Override
    public void validate() {
        Assert.greaterEquals(defense, 0);
        Assert.greaterEquals(vision, 0);

        Assert.greaterEquals(capturePoints, 0);
    }
}