package net.wolfTec.cwt.model;

import java.util.Iterator;

import net.wolfTec.cwt.utility.AssertUtilyBean;

import org.stjs.javascript.Map;

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
