package net.wolfTec.model;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;

public class AttackType {

    public Integer minrange;
    public Integer maxrange;
    public Map<String,Integer> mainWeapon;
    public Map<String,Integer> secondaryWeapon;

    public AttackType () {
        mainWeapon = JSCollections.$map();
        secondaryWeapon = JSCollections.$map();
    }
}
