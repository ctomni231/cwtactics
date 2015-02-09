package net.wolfTec.cwt.model;

import net.wolfTec.cwt.utility.AssertUtilyBean;

public class TileType extends ObjectType {

    public int defense;

    @Override
    public void validate() {
        AssertUtilyBean.greaterEquals(defense, 0);
    }
}
