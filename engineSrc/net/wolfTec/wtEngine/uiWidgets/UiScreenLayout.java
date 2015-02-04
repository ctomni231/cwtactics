package net.wolfTec.wtEngine.uiWidgets;

import net.wolfTec.wtEngine.Constants;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

/**
 * A screen layout is a group out of ui elements. This elements can be interactive or non-interactive. It should be
 * used to create and define a screen layout. Furthermore the screen layout offers API to interact with the components.
 */
public class UiScreenLayout extends UiButtonGroup {

    private int left;
    private int curX;
    private int curY;
    private int curH;

    public UiScreenLayout (int slotsX, int slotsY, int startX, int startY) {
        super();

        this.left = startX;
        this.curX = startX;
        this.curY = startY;
        this.curH = 0;

        this.breakLine();
    }

    public UiScreenLayout repeat (int n, Callback2<UiScreenLayout, Integer> f) {
        for (int i = 0; i < n; i++) {
            f.$invoke(this, i);
        }
        return this;
    }

    public UiScreenLayout addRowGap (int tiles) {
        this.curY += Constants.TILE_BASE * tiles;
        return this;
    }

    public UiScreenLayout addColGap (int tiles) {
        this.curX += Constants.TILE_BASE * tiles;
        return this;
    }

    /**
     * Breaks the current line
     */
    public UiScreenLayout breakLine () {
        this.curX = this.left;
        this.curY += this.curH * Constants.TILE_BASE;
        this.curH = 1;
        return this;
    }

    public UiScreenLayout addButton (int tilesX, int tilesY, int offsetY, String key, int style, int fSize, Callback0 action) {
        if (this.curH < tilesY) {
            this.curH = tilesY;
        }

        UiField btn = new UiField(this.curX, this.curY + (offsetY * Constants.TILE_BASE), tilesX * Constants.TILE_BASE, tilesY * Constants.TILE_BASE, key, fSize, style, action);
        this.curX += tilesX * Constants.TILE_BASE;
        this.addElement(btn);

        return this;
    }

    public UiScreenLayout addCustomField (int tilesX, int tilesY, int offsetY, String key, Callback1<CanvasRenderingContext2D> draw, boolean ignoreHeight) {
        if (!ignoreHeight && this.curH < tilesY) {
            this.curH = tilesY;
        }

        UiField btn = new UiCustomField(this.curX, this.curY + (offsetY * Constants.TILE_BASE), tilesX * Constants.TILE_BASE, tilesY * Constants.TILE_BASE, key, draw);
        this.curX += tilesX * Constants.TILE_BASE;
        this.addElement(btn);

        return this;
    }

    public UiScreenLayout addCheckbox (int tilesX, int tilesY, int offsetY, String key, int style, int fSize) {
        if (this.curH < tilesY) {
            this.curH = tilesY;
        }

        UiField btn = new UiCheckboxField(this.curX, this.curY + (offsetY * Constants.TILE_BASE), tilesX * Constants.TILE_BASE, tilesY * Constants.TILE_BASE, key, fSize, style);
        this.curX += tilesX * Constants.TILE_BASE;
        this.addElement(btn);

        return this;
    }
}
