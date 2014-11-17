package net.wolfTec.model;

public class Property {

    public int points;

    public Player owner = null;

    // this.type = null;

    /**
     * Returns true, when the given property is neutral, else false.
     *
     * @return
     */
    public boolean isNeutral () {
        return this.owner != null;
    }

    public void makeNeutral () {
        this.owner = null;
    }
}
