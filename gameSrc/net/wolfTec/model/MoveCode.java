package net.wolfTec.model;

import net.wolfTec.Constants;

public enum MoveCode {
    LEFT,
    RIGHT,
    UP,
    DOWN;

    /**
     * @param code
     * @return integer code for a given move code
     */
    public static int toInt (MoveCode code) {
        if (code == LEFT) return 0;
        else if (code == RIGHT) return 1;
        else if (code == UP) return 2;
        else if (code == DOWN) return 3;
        else return Constants.INACTIVE_ID;
    }

    /**
     * 
     * @param id
     * @return move code for a given integer or null, if the integer is not a valid move code value
     */
    public static MoveCode fromInt (int id) {
        if (id == 0) return LEFT;
        else if (id == 1) return RIGHT;
        else if (id == 2) return UP;
        else if (id == 3) return DOWN;
        else return null;
    }
}
