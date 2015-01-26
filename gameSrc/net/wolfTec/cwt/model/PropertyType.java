package net.wolfTec.cwt.model;

import net.wolfTec.cwt.util.AssertUtil;

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
        AssertUtil.greaterEquals(defense, 0);
        AssertUtil.greaterEquals(vision, 0);

        AssertUtil.greaterEquals(capturePoints, 0);
    }
}