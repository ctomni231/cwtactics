package net.wolfTec.wtEngine.model;

import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public interface PlayerObject {

    /**
     * Returns the owner of an object, or null if no owner is set.
     *
     * @return
     */
    public Player getOwner();
}
