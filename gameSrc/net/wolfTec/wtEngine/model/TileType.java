package net.wolfTec.wtEngine.model;

import net.wolfTec.wtEngine.utility.AssertUtilyBean;

public class TileType extends ObjectType {

    public int defense;

    @Override
    public void validate() {
        AssertUtilyBean.greaterEquals(defense, 0);
    }
}
