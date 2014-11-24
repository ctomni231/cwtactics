package net.wolfTec.widgets;

import net.wolfTec.Constants;
import net.wolfTec.bridges.CanvasRenderingContext2D;
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

    public UiScreenLayout addButton (int tilesX, int tilesY, int offsetY,
                                     String key, int style, int fSize,
                                     Callback0 action) {

        if (arguments.length === 5) {
            action = null;
            fSize = 12;
        } else if (arguments.length === 6 && typeof fSize === "function") {
            action = fSize;
            fSize = 12;
        }

        if (this.curH < tilesY) {
            this.curH = tilesY;
        }

        UiElement btn = new UIField(
                this.curX,
                this.curY + (offsetY * Constants.TILE_BASE),
                tilesX * Constants.TILE_BASE,
                tilesY * Constants.TILE_BASE,
                key,
                fSize,
                style,
                action
        );

        this.curX += tilesX * constants.TILE_BASE;

        this.addElement(btn);

        return this;
    }

    public UiScreenLayout addCustomField (int tilesX, int tilesY, int offsetY, String key, Callback1<CanvasRenderingContext2D> draw, boolean ignoreHeight) {
        if (ignoreHeight != true && this.curH < tilesY) {
            this.curH = tilesY;
        }

        var btn = new exports.UICustomField(
                this.curX,
                this.curY + (offsetY * Constants.TILE_BASE),
                tilesX * Constants.TILE_BASE,
                tilesY * Constants.TILE_BASE,
                key,
                draw
        );

        this.curX += tilesX * constants.TILE_BASE;

        this.addElement(btn);

        return this;
    }

    public UiScreenLayout addCheckbox (int tilesX, int tilesY, int offsetY, String key, int style, int fSize) {
        if (arguments.length === 5) {
            fSize = 12;
        } else if (arguments.length === 6 && typeof fSize === "function") {
            fSize = 12;
        }

        if (this.curH < tilesY) {
            this.curH = tilesY;
        }

        var btn = new exports.UICheckboxField(
                this.curX,
                this.curY + (offsetY * Constants.TILE_BASE),
                tilesX * Constants.TILE_BASE,
                tilesY * Constants.TILE_BASE,
                key,
                fSize,
                style
        );

        this.curX += tilesX * Constants.TILE_BASE;

        this.addElement(btn);

        return this;
    }
}
