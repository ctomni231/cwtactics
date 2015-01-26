package net.wolfTec.cwt.model;

import net.wolfTec.cwt.util.AssertUtil;

public class TileType extends ObjectType {

    public int defense;

    @Override
    public void validate() {
        AssertUtil.greaterEquals(defense, 0);
    }
}
