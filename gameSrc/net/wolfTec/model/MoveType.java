package net.wolfTec.model;

import net.wolfTec.utility.Assert;

import org.stjs.javascript.Map;

import java.util.Iterator;

public class MoveType extends ObjectType {

    public Map<String, Integer> costs;

    @Override
    public void validate() {
        Iterator<String> keys = costs.iterator();
        while (keys.hasNext()) {
            String key = keys.next();
            Integer value = costs.$get(key);

            Assert.greaterEquals(value, -1);
            Assert.lowerEquals(value, 100);
            Assert.isNot(value, 0);
        }
    }
}
