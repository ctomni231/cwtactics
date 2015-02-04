package net.wolfTec.wtEngine.model;

import net.wolfTec.wtEngine.utility.AssertUtil;

public class TileType extends ObjectType {

    public int defense;

    @Override
    public void validate() {
        AssertUtil.greaterEquals(defense, 0);
    }
}
