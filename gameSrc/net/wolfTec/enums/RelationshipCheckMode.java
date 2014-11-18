package net.wolfTec.enums;

public enum RelationshipCheckMode {

    /**
     * Indicates a wish to check in the hierarchical way. First try to extract the unit owner and then the property
     * owner when no unit exists.
     */
    CHECK_NORMAL,

    /**
     * Indicates a wish to check unit owner.
     */
    CHECK_UNIT,

    /**
     * Indicates a wish to check property owner.
     */
    CHECK_PROPERTY

}
