package net.wolfTec.wtEngine.gamelogic;


public enum Relationship {

    /**
     * Means two objects are the same object (so there is only one object).
     */
    RELATION_SAME_THING,

    /**
     * Means there is no relationship between two objects.
     */
    RELATION_NEUTRAL,

    /**
     * Means two objects belongs to the same owner.
     */
    RELATION_OWN,

    /**
     * Means two objects belongs to the same team.
     */
    RELATION_ALLIED,

    /**
     * Means two objects belongs not to the same owner (they are enemies).
     */
    RELATION_ENEMY,

    /**
     * Means at least one of the two arguments is null.
     */
    RELATION_NONE
}
