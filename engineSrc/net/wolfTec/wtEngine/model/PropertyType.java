package net.wolfTec.wtEngine.model;

import net.wolfTec.wtEngine.utility.AssertUtilyBean;

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
        AssertUtilyBean.greaterEquals(defense, 0);
        AssertUtilyBean.greaterEquals(vision, 0);

        AssertUtilyBean.greaterEquals(capturePoints, 0);
    }
}