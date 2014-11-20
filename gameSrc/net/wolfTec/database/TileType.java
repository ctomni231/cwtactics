package net.wolfTec.database;

import net.wolfTec.utility.Assert;

public class TileType extends ObjectType<TileType> {

    public int defense;

    @Override
    public void validate() {
        Assert.greaterEquals(defense, 0);
    }
}
