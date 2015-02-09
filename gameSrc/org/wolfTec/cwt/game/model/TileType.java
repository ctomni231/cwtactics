package org.wolfTec.cwt.game.model;

import org.wolfTec.cwt.game.utility.AssertUtilyBean;

public class TileType extends ObjectType {

    public int defense;

    @Override
    public void validate() {
        AssertUtilyBean.greaterEquals(defense, 0);
    }
}
