package net.wolfTec.types;

import net.wolfTec.utility.Assert;

public class TileType extends ObjectType {

    public int defense;

    @Override
    public void validate() {
        Assert.greaterEquals(defense, 0);
    }
}
