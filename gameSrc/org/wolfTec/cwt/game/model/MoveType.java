package org.wolfTec.cwt.game.model;

import java.util.Iterator;

import org.stjs.javascript.Map;
import org.wolfTec.cwt.game.utility.AssertUtilyBean;

public class MoveType extends ObjectType {

    public Map<String, Integer> costs;

    @Override
    public void validate() {
        Iterator<String> keys = costs.iterator();
        while (keys.hasNext()) {
            String key = keys.next();
            Integer value = costs.$get(key);

            AssertUtilyBean.greaterEquals(value, -1);
            AssertUtilyBean.lowerEquals(value, 100);
            AssertUtilyBean.isNot(value, 0);
        }
    }
}
