package net.wolfTec.wtEngine.model;

import java.util.Iterator;

import net.wolfTec.wtEngine.utility.AssertUtil;

import org.stjs.javascript.Map;

public class MoveType extends ObjectType {

    public Map<String, Integer> costs;

    @Override
    public void validate() {
        Iterator<String> keys = costs.iterator();
        while (keys.hasNext()) {
            String key = keys.next();
            Integer value = costs.$get(key);

            AssertUtil.greaterEquals(value, -1);
            AssertUtil.lowerEquals(value, 100);
            AssertUtil.isNot(value, 0);
        }
    }
}
