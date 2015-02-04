package net.wolfTec.renderer;

import net.wolfTec.states.StateDataMenu;
import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.gamelogic.MoveCode;
import net.wolfTec.wtEngine.model.Unit;
import net.wolfTec.wtEngine.utility.CircularBuffer;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;

public class RendererBean {

    /** */
    private boolean unitAnimationHalfStep;

    /** */
    private int curTime;

    /** */
    private int indexMapAnimation;

    /** */
    private int indexEffectAnimation;

    private UiPositionableGroup layoutGenericMenu;

    private int menuShift;

    private Canvas temporaryCanvas;



    public RendererBean() {
        int canvasW = Constants.TILE_BASE * Constants.SCREEN_WIDTH;
        int canvasH = Constants.TILE_BASE * Constants.SCREEN_HEIGHT;

        layerBG = new LayeredCanvas("canvas_layer_Background", 1, canvasW, canvasH);
        layerMap = new LayeredCanvas("canvas_layer_Map", 8, canvasW, canvasH);
        layerFog = new LayeredCanvas("canvas_layer_Fog", 1, canvasW, canvasH);
        layerUnit = new LayeredCanvas("canvas_layer_Unit", 3, canvasW, canvasH);
        layerFocus = new LayeredCanvas("canvas_layer_Focus", 7, canvasW, canvasH);
        layerEffects = new LayeredCanvas("canvas_layer_Effects", 1, canvasW, canvasH);
        layerUI = new LayeredCanvas("canvas_layer_UI", 1, canvasW, canvasH);

        temporaryCanvas = (Canvas) Global.window.document.createElement("canvas");
        temporaryCanvas.width = canvasW;
        temporaryCanvas.height = canvasH;

        screenWidth = canvasW;
        screenHeight = canvasH;
        screenOffsetX = 0;
        screenOffsetY = 0;

        curTime = 0;
        unitAnimationHalfStep = false;
        indexUnitAnimation = 0;
        indexMapAnimation = 0;
        indexEffectAnimation = 0;

        hiddenUnitId = Constants.INACTIVE_ID;

        layoutGenericMenu = new UIPositionableButtonGroup();
        menuShift = 0;


/* pre-generate an in-memory menu object that can be used as ... */
        util.repeat(MENU_ELEMENTS_MAX,

                (i)

                        {
                                layoutGenericMenu.addElement(new widgets.UIField(
                                        0, i * 32,
                                        MENU_ENTRY_WIDTH, MENU_ENTRY_HEIGHT,
                                        "KEY_" + i,
                                        8,
                                        widgets.UIField.STYLE_NORMAL,

                                        // logic will be handled by the state machine
                                        util.empty
                                ))
                        }

        )
    }


    /**
     *
     */
    public int convertToTilePos(int pos) {
        return JSGlobal.parseInt(pos / Constants.TILE_BASE, 10);
    }

    /**
     * @param moveCode
     */
    public boolean shiftScreen(MoveCode moveCode) {
        GameRound game = $gameround;

        boolean smallerW = (game.mapWidth < Constants.SCREEN_WIDTH);
        boolean smallerH = (game.mapHeight < Constants.SCREEN_HEIGHT);
        boolean changed = false;

        switch (moveCode) {
            case UP:
                if (!smallerH && screenOffsetY < game.mapHeight - Constants.SCREEN_HEIGHT - 1) {
                    screenOffsetY++;
                    changed = true;
                }
                break;

            case RIGHT:
                if (!smallerW && screenOffsetX > 0) {
                    screenOffsetX--;
                    changed = true;
                }
                break;

            case DOWN:
                if (!smallerH && screenOffsetY > 0) {
                    screenOffsetY--;
                    changed = true;
                }
                break;

            case LEFT:
                if (!smallerW && screenOffsetX < game.mapWidth - Constants.SCREEN_WIDTH - 1) {
                    screenOffsetX++;
                    changed = true;
                }
                break;
        }

        return changed;
    }

    /**
     *
     */
    public void renderScreen() {
        int pfc = Debug.startPerformanceCheck();

        GameRound game = $gameround;
        int x = screenOffsetX;
        int y = screenOffsetY;
        int w = (game.mapWidth < Constants.SCREEN_WIDTH) ? game.mapWidth : Constants.SCREEN_WIDTH;
        int h = (game.mapHeight < Constants.SCREEN_HEIGHT) ? game.mapHeight : Constants.SCREEN_HEIGHT;

        renderTiles(x, y, w, h, false);
        renderUnits(x, y, w, h);
        renderFocus(x, y, w, h);

        // directly update all layers
        layerMap.renderLayer(indexMapAnimation);
        layerUnit.renderLayer(indexUnitAnimation);
        layerFocus.renderLayer(indexEffectAnimation);

        renderFogRect(x, y, w, h, false);

        Debug.stopPerformanceCheck(pfc);
    }

    /**
     *
     */
    public void renderFocusOnScreen() {
        int pfc = Debug.startPerformanceCheck();

        GameRound game = $gameround;
        int x = screenOffsetX;
        int y = screenOffsetY;
        int w = (game.mapWidth < Constants.SCREEN_WIDTH) ? game.mapWidth : Constants.SCREEN_WIDTH;
        int h = (game.mapHeight < Constants.SCREEN_HEIGHT) ? game.mapHeight : Constants.SCREEN_HEIGHT;

        renderFocus(x, y, w, h);
        layerFocus.renderLayer(indexEffectAnimation);

        Debug.stopPerformanceCheck(pfc);
    }

    /**
     *
     */
    public void renderUnitsOnScreen() {
        int pfc = Debug.startPerformanceCheck();

        GameRound game = CustomWarsTactics.getBean("gameround");
        int x = screenOffsetX;
        int y = screenOffsetY;
        int w = (game.mapWidth < Constants.SCREEN_WIDTH) ? game.mapWidth : Constants.SCREEN_WIDTH;
        int h = (game.mapHeight < Constants.SCREEN_HEIGHT) ? game.mapHeight : Constants.SCREEN_HEIGHT;

        layerUnit.clearAll();

        renderUnits(x, y, w, h);
        layerUnit.renderLayer(indexUnitAnimation);

        Debug.stopPerformanceCheck(pfc);
    }

    /**
     * @param {number} code
     */
    public void shiftMap(MoveCode code) {
        int pfc = Debug.startPerformanceCheck();

        GameRound game = CustomWarsTactics.getBean("gameround");
        int fx = screenOffsetX;
        int fy = screenOffsetY;
        int fw = (game.mapWidth < Constants.SCREEN_WIDTH) ? game.mapWidth : Constants.SCREEN_WIDTH;
        int fh = (game.mapHeight < Constants.SCREEN_HEIGHT) ? game.mapHeight : Constants.SCREEN_HEIGHT;

        // extract needed data for the shift process
        switch (code) {
            case LEFT:
                fx += Constants.SCREEN_WIDTH - 1;
                fw = 1;
                break;

            case RIGHT:
                fw = 1;
                break;

            case UP:
                fy += Constants.SCREEN_HEIGHT - 1;
                fh = 1;
                break;

            case DOWN:
                fh = 1;
                break;
        }

        // shift screen
        shiftTiles(code);
        shiftUnits(code);
        shiftFocus(code);
        shiftFog(code);

        // fill created hole
        renderTiles(fx, fy, fw, fh, false);
        renderUnits(fx, fy, fw, fh);
        renderFocus(fx, fy, fw, fh);
        renderFogRect(fx, fy, fw, fh, false);

        // fix overlay when screen moves down
        if (code == MoveCode.DOWN) {
            renderTileOverlayRow();
        }

        // directly update all layers
        layerMap.renderLayer(indexMapAnimation);
        layerUnit.renderLayer(indexUnitAnimation);
        layerFocus.renderLayer(indexEffectAnimation);

        if (net.wolfTec.gameWorkflowData.focusMode == Sprite.FOCUS_MOVE) {
            layerEffects.clearAll();
            renderMovePath();
            layerEffects.renderLayer(0);
        }

        Debug.stopPerformanceCheck(pfc);
    }

    /**
     * Renders the cursor to the UI layer.
     */
    public void eraseCursor(int x, int y) {
        Element cursorImg = net.wolfTec.spriteDb.sprites.$get("CURSOR").getImage(0);
        CanvasRenderingContext2D ctx = layerUI.getContext(Constants.INACTIVE_ID);
        int h = JSGlobal.parseInt(Constants.TILE_BASE / 2, 10);
        x = (x - screenOffsetX) * Constants.TILE_BASE;
        y = (y - screenOffsetY) * Constants.TILE_BASE;

        // render cursor at new position
        ctx.drawImage(cursorImg, x - h, y - h);
        ctx.drawImage(cursorImg, x + h + h, y + h + h);
        ctx.drawImage(cursorImg, x + h + h, y - h);
        ctx.drawImage(cursorImg, x - h, y + h + h);
    }

    /**
     * Renders the cursor to the UI layer.
     */
    public void renderCursor(int x, int y) {
        Element cursorImg = net.wolfTec.spriteDb.sprites.$get("CURSOR").getImage(0);
        CanvasRenderingContext2D ctx = layerUI.getContext(Constants.INACTIVE_ID);
        int h = JSGlobal.parseInt(Constants.TILE_BASE / 2, 10);
        x = (x - screenOffsetX) * Constants.TILE_BASE;
        y = (y - screenOffsetY) * Constants.TILE_BASE;

        // render cursor at new position
        ctx.drawImage(cursorImg, x - h, y - h);
        ctx.drawImage(cursorImg, x + h + h, y + h + h);
        ctx.drawImage(cursorImg, x + h + h, y - h);
        ctx.drawImage(cursorImg, x - h, y + h + h);
    }

    /**
     * Shows the native browser cursor.
     */
    public void showNativeCursor() {
        // hacky but the original html5 bridge of stjs does not obtain style as property
        Object fakeMap = layerUI.getLayer(Constants.INACTIVE_ID);
        ((Map) ((Map) fakeMap).$get("style")).$put("cursor", "");
    }

    /**
     * Hides the native browser cursor.
     */
    public void hideNativeCursor() {
        // hacky but the original html5 bridge of stjs does not obtain style as property
        Object fakeMap = layerUI.getLayer(Constants.INACTIVE_ID);
        ((Map) ((Map) fakeMap).$get("style")).$put("cursor", "none");
    }

    /** */
    public void renderMovePath() {
        int offsetX = screenOffsetX;
        int offsetY = screenOffsetY;
        int x = net.wolfTec.source.x;
        int y = net.wolfTec.source.y;
        CircularBuffer<MoveCode> path = net.wolfTec.gameWorkflowData.movePath;

        Sprite arrowSprite = net.wolfTec.spriteDb.sprites.$get("ARROW");
        int oX = Constants.INACTIVE_ID;
        int oY = Constants.INACTIVE_ID;
        int tX = Constants.INACTIVE_ID;
        int tY = Constants.INACTIVE_ID;
        Element pic = null;
        for (int i = 0, e = path.getSize(); i < e; i++) {

            oX = x;
            oY = y;

            switch (path.get(i)) {

                case DOWN:
                    y++;
                    break;

                case UP:
                    y--;
                    break;

                case LEFT:
                    x--;
                    break;

                case RIGHT:
                    x++;
                    break;
            }


            // NEXT TILE
            if (path.getSize() <= i + 1) {
                tX = -1;
                tY = -1;
            } else {
                switch (path.get(i + 1)) {

                    case UP:
                        tX = x;
                        tY = y - 1;
                        break;

                    case RIGHT:
                        tX = x + 1;
                        tY = y;
                        break;

                    case DOWN:
                        tX = x;
                        tY = y + 1;
                        break;

                    case LEFT:
                        tX = x - 1;
                        tY = y;
                        break;
                }
            }

            // TARGET TILE
            if (tX == -1) {
                switch (path.get(i)) {

                    case UP:
                        pic = arrowSprite.getImage(Sprite.DIRECTION_N);
                        break;

                    case RIGHT:
                        pic = arrowSprite.getImage(Sprite.DIRECTION_E);
                        break;

                    case DOWN:
                        pic = arrowSprite.getImage(Sprite.DIRECTION_S);
                        break;

                    case LEFT:
                        pic = arrowSprite.getImage(Sprite.DIRECTION_W);
                        break;
                }
            } else {

                int diffX = Math.abs(tX - oX);
                int diffY = Math.abs(tY - oY);

                // IN THE MIDDLE OF THE WAY
                if (diffX == 2) {
                    pic = arrowSprite.getImage(Sprite.DIRECTION_WE);

                } else if (diffY == 2) {
                    pic = arrowSprite.getImage(Sprite.DIRECTION_NS);

                } else if ((tX < x && oY > y) || (oX < x && tY > y)) {
                    pic = arrowSprite.getImage(Sprite.DIRECTION_SW);

                } else if ((tX < x && oY < y) || (oX < x && tY < y)) {
                    pic = arrowSprite.getImage(Sprite.DIRECTION_NW);

                } else if ((tX > x && oY < y) || (oX > x && tY < y)) {
                    pic = arrowSprite.getImage(Sprite.DIRECTION_NE);

                } else if ((tX > x && oY > y) || (oX > x && tY > y)) {
                    pic = arrowSprite.getImage(Sprite.DIRECTION_SE);

                } else {
                    Debug.logCritical(LOG_HEADER, "illegal move arrow state -> old (" + oX + "," + oY + ") -> current (" + x + "," + y + ") -> next (" + tX + "," + tY + ") -> path (" + path + ")");
                    continue;
                }
            }

            if (x >= 0 && y >= 0) {
                layerUI.getContext(0).drawImage(pic, (x - offsetX) * Constants.TILE_BASE, (y - offsetY) * Constants.TILE_BASE);
            }
        }
    }

    /** */
    public void evaluateCycle(int delta) {
        int index;

        curTime += delta;
        if (curTime > ANIMATION_TICK_TIME) {
            curTime = 0;

            // calc unit animation layer step
            unitAnimationHalfStep = !unitAnimationHalfStep;
            if (!unitAnimationHalfStep) {

                index = indexUnitAnimation + 1;
                if (index == 3) {
                    index = 0;
                }

                // render unit animation layer
                layerUnit.renderLayer(index);
                indexUnitAnimation = index;
            }

            // map animation layer
            index = indexMapAnimation + 1;
            if (index == 8) {
                index = 0;
            }

            // render map animation layer
            layerMap.renderLayer(index);
            indexMapAnimation = index;

            // effect animation layer
            index = indexEffectAnimation + 1;
            if (index == 7) {
                index = 0;
            }

            // render map animation layer
            layerFocus.renderLayer(index);
            indexEffectAnimation = index;
        }
    }

    public void fixOverlayFog_(int x, int y, boolean isTop) {
        if (isTop) {
        } else {
        }
    }

    /**
     * Note: one clears the area before action
     */
    public void renderFogCircle(int x, int y, int range) {
        renderFogRect(x, y, range, range, true);
    }

    /**
     * Note: one clears the area before action
     */
    public void renderFogRect(int x, int y, int w, int h, boolean circle) {
        int offsetX = screenOffsetX;
        int offsetY = screenOffsetY;
        CanvasRenderingContext2D layer = layerFog.getContext(0);
        int cx;
        int cy;
        int range;

        if (circle) {

            // prepare meta data for the circle center and the pseudo-circle search field
            cx = x;
            cy = y;
            x -= w;
            y -= h;
            range = w;
            w += w + 1;
            h += w + 1;

        } else {

            // clear area in background layer as rectangle only in rectangle mode
            layer.clearRect(
                    (x - offsetX) * Constants.TILE_BASE,
                    (y - offsetY) * Constants.TILE_BASE,
                    w * Constants.TILE_BASE,
                    h * Constants.TILE_BASE
            );
        }

        // render
        int oy = y;
        for (int xe = x + w; x < xe; x++) {
            y = oy;
            for (int ye = y + h; y < ye; y++) {
                int distance;

                if (circle) {
                    distance = model.getDistance(x, y, cx, cy);
                    if (!model.isValidPosition(x, y) || distance > range) {
                        continue;
                    }

                    // clear position
                    layer.clearRect(
                            (x - offsetX) * Constants.TILE_BASE,
                            (y - offsetY) * Constants.TILE_BASE,
                            Constants.TILE_BASE,
                            Constants.TILE_BASE
                    );
                }

                var tile = data[x][y];
                if (tile.visionClient == = 0) {

                    var sprite = null;
                    if (tile.property) {
                        sprite = image.sprites[tile.property.type.ID].getImage(
                                image.Sprite.PROPERTY_SHADOW_MASK
                        );
                    } else {
                        sprite = image.sprites[tile.type.ID].getImage(
                                tile.variant * image.Sprite.TILE_STATES + image.Sprite.TILE_SHADOW
                        );
                    }

                    var scx = (image.longAnimatedTiles[tile.type.ID]) ? Constants.TILE_BASE * animation.indexMapAnimation : 0;
                    var scy = 0;
                    var scw = Constants.TILE_BASE;
                    var sch = Constants.TILE_BASE * 2;
                    var tcx = (x - offsetX) * Constants.TILE_BASE;
                    var tcy = (y - offsetY) * Constants.TILE_BASE - Constants.TILE_BASE;
                    var tcw = Constants.TILE_BASE;
                    var tch = Constants.TILE_BASE * 2;

                    if (tcy < 0) {
                        scy = scy + Constants.TILE_BASE;
                        sch = sch - Constants.TILE_BASE;
                        tcy = tcy + Constants.TILE_BASE;
                        tch = tch - Constants.TILE_BASE;
                    }

                    layer.drawImage(
                            sprite,
                            scx, scy,
                            scw, sch,
                            tcx, tcy,
                            tcw, tch
                    );
                } else {

                    // fix overlays on all tiles that are at the max range in the circle mode
                    if (circle) {
                        if (distance == = range) {

                            // top check
                            if (y <= cy) {
                                fixOverlayFog_(x, y, true);
                            }

                            // bottom check
                            if (y >= cy) {
                                fixOverlayFog_(x, y, false);
                            }
                        }
                    }
                }
            }
        }

        // fix overlay top and bottom in the rectangle mode
        if (!circle) {

        }

        renderFogBackgroundLayer();
    }

    /**
     * Note: one clears the area before action
     */
    public void renderFogBackgroundLayer() {
        layerFog.getContext(Constants.INACTIVE_ID).globalAlpha = 0.35;
        layerFog.renderLayer(0);
        layerFog.getContext(Constants.INACTIVE_ID).globalAlpha = 1;
    }

    /**
     * Note: one clears the layer before action
     */
    public void shiftFog(MoveCode code) {
        CanvasRenderingContext2D tmpContext = temporaryCanvas.getContext("2d");

        // calculate meta data for shift
        int sx = 0;
        int sy = 0;
        int scx = 0;
        int scy = 0;
        int w = layerFog.w;
        int h = layerFog.h;
        switch (code) {
            case LEFT:
                scx += Constants.TILE_BASE;
                w -= Constants.TILE_BASE;
                break;

            case RIGHT:
                sx += Constants.TILE_BASE;
                w -= Constants.TILE_BASE;
                break;

            case UP:
                scy += Constants.TILE_BASE;
                h -= Constants.TILE_BASE;
                break;

            case DOWN:
                sy += Constants.TILE_BASE;
                h -= Constants.TILE_BASE;
                break;
        }

        tmpContext.clearRect(0, 0, layerFog.w, layerFog.h);

        // copy visible content to temp canvas
        tmpContext.drawImage(layerFog.getLayer(0), scx, scy, w, h, sx, sy, w, h);

        // clear original canvas
        layerFog.clear(0);

        // copy visible content back to the original canvas
        layerFog.getContext(0).drawImage(temporaryCanvas, 0, 0);

        renderFogBackgroundLayer();
    }

    /** */
    public void prepareMenu() {
        StateDataMenu menu = net.wolfTec.gameWorkflowData.menu;
        var numElements = menu.getSize();
        if (numElements > MENU_ELEMENTS_MAX) numElements = MENU_ELEMENTS_MAX;

        // set the position of the menu
        layoutGenericMenu.setMenuPosition(
                parseInt((screenWidth / 2) - MENU_ENTRY_WIDTH / 2, 10),
                parseInt((screenHeight / 2) - ((numElements * MENU_ENTRY_HEIGHT) / 2), 10)
        );

        for (var i = 0; i < MENU_ELEMENTS_MAX; i++) {
            if (i < numElements) {
                layoutGenericMenu.elements[i].inactive = false;
                layoutGenericMenu.elements[i].text = i18n.forKey(menu.getContent(menuShift + i));

                // set style
                gfxMenu.elements[i].style = (
                        (numElements == 1 ? widgets.UIField.STYLE_NORMAL :
                                (i == 0 ? widgets.UIField.STYLE_NEW :
                                        (i == numElements - 1 || i == menuShift + MENU_ELEMENTS_MAX - 1 ? widgets.UIField.STYLE_ESW :
                                                widgets.UIField.STYLE_EW)))
                );

            } else {
                gfxMenu.elements[i].inactive = true;
            }
        }

        renderMenu(layerUI);
    }

    /** */
    public void renderMenu() {
        layoutGenericMenu.draw(layerUI.getContext(0));
    }

    /** */
    public void resetMenuShift() {
        menuShift = 0;
    }

    /** */
    public void updateMenuIndex(int x, int y) {
        layoutGenericMenu.updateIndex(x, y);
        // TODO -> when the index is at the boundaries then change page if necessary
    }

    /** */
    public void handleMenuInput(MoveCode code) {
        boolean shiftedMenu = false;
        StateDataMenu menu = net.wolfTec.gameWorkflowData.menu;

        // the menu size must be greater then the menu size
        if (menu.getSize() > MENU_ELEMENTS_MAX) {
            int currentIndex = layoutGenericMenu.selected;

            switch (code) {
                case UP:
                    if (currentIndex < 2 && menuShift > 0) {
                        shiftedMenu = true;
                        menuShift--;
                    } else if (currentIndex == 0 && menuShift == 0) {
                        shiftedMenu = true;
                        menuShift = menu.getSize() - MENU_ELEMENTS_MAX;
                        layoutGenericMenu.setIndex(MENU_ELEMENTS_MAX - 1);
                    }
                    break;

                case DOWN:
                    if (currentIndex > MENU_ELEMENTS_MAX - 3 && menuShift < menu.getSize() - MENU_ELEMENTS_MAX) {
                        shiftedMenu = true;
                        menuShift++;
                    } else if (currentIndex == MENU_ELEMENTS_MAX - 1 && menuShift == menu.getSize() - MENU_ELEMENTS_MAX) {
                        shiftedMenu = true;
                        menuShift = 0;
                        layoutGenericMenu.setIndex(0);
                    }
                    break;
            }
        }

        return (shiftedMenu) ? 2 : (layoutGenericMenu.handleInput(code) == true ? 1 : 0);
    }

    /** */
    public void getMenuIndex() {
        return menuShift + layoutGenericMenu.selected;
    }

    /** */
    public void renderTile(int x, int y) {
        int offsetX = screenOffsetX;
        int offsetY = screenOffsetY;

        renderTiles(layerMap, offsetX, offsetY, x, y, 1, 1, false);

        // draw overlay of the bottom tile
        if (y < $gameround.mapHeight - 1) {
            renderTiles(layerMap, offsetX, offsetY, x, y + 1, 1, 1, true);
        }
    }

    /** */
    public void renderTileOverlayRow() {
        renderTiles(
                screenOffsetX,
                screenOffsetY,
                screenOffsetX,
                screenOffsetY + 1,
                ($gameround.mapWidth < Constants.SCREEN_WIDTH) ?
                        $gameround.mapWidth : Constants.SCREEN_WIDTH,
                1,
                true
        );
    }

    /** */
    public void renderTiles(int x, int oy, int w, int h, boolean overlayDraw) {
        int offsetX = screenOffsetX;
        int offsetY = screenOffsetY;

        GameRound mapData = $gameround;
        CanvasRenderingContext2D ctx;
        int scx;
        int scy;
        int scw;
        int sch;
        int tcx;
        int tcy;
        int tcw;
        int tch;
        Tile tile;
        Element sprite = null;
        Element propSprite = null;
        int state;

        for (int xe = x + w; x < xe; x++) {
            for (int y = oy, ye = y + h; y < ye; y++) {
                tile = mapData.map.getTile(x, y);
                sprite = net.wolfTec.spriteDb.sprites.$get(tile.type.ID).getImage(tile.variant * Sprite.TILE_STATES);

                // grab property status before loop (calc it one instead of eight times)
                if (tile.property != null) {
                    state = Constants.INACTIVE_ID;

                    if (tile.property.owner != null) {
                        switch (tile.property.owner.id) {
                            case 0:
                                state = Sprite.PROPERTY_RED;
                                break;

                            case 1:
                                state = Sprite.PROPERTY_BLUE;
                                break;

                            case 2:
                                state = Sprite.PROPERTY_GREEN;
                                break;

                            case 3:
                                state = Sprite.PROPERTY_YELLOW;
                                break;
                        }
                    } else {
                        state = Sprite.PROPERTY_NEUTRAL;
                    }

                    propSprite = net.wolfTec.spriteDb.sprites.$get(tile.property.type.ID).getImage(state);
                }

                // render all phases
                int n = 0;
                while (n < 8) {
                    ctx = layerMap.getContext(n);

                    scx = (net.wolfTec.spriteDb.longAnimatedTiles.$get(tile.type.ID) != null) ? Constants.TILE_BASE * n : 0;
                    scy = 0;
                    scw = Constants.TILE_BASE;
                    sch = Constants.TILE_BASE * 2;
                    tcx = (x - offsetX) * Constants.TILE_BASE;
                    tcy = (y - offsetY) * Constants.TILE_BASE - Constants.TILE_BASE;
                    tcw = Constants.TILE_BASE;
                    tch = Constants.TILE_BASE * 2;

                    if (tcy < 0) {
                        scy = scy + Constants.TILE_BASE;
                        sch = sch - Constants.TILE_BASE;
                        tcy = tcy + Constants.TILE_BASE;
                        tch = tch - Constants.TILE_BASE;
                    }

                    if (overlayDraw) {
                        sch = sch - Constants.TILE_BASE;
                        tch = tch - Constants.TILE_BASE;
                    }

                    // render tile
                    ctx.drawImage(
                            sprite,
                            scx, scy,
                            scw, sch,
                            tcx, tcy,
                            tcw, tch
                    );

                    // render property
                    if (tile.property != null) {
                        scx = Constants.TILE_BASE * (JSGlobal.parseInt(n / 2, 10));

                        ctx.drawImage(
                                propSprite,
                                scx, scy,
                                scw, sch,
                                tcx, tcy,
                                tcw, tch
                        );
                    }

                    n++;
                }
            }
        }
    }

    /**
     * Note: one does not clear the layer before action
     */
    public void shiftTiles(MoveCode code) {

        
    }

    /** */
    public void renderFocus(int x, int y, int w, int h) {
        CanvasRenderingContext2D ctx;
        int scx;
        int scy;
        int scw;
        int sch;
        int tcx;
        int tcy;
        int tcw;
        int tch;

        Sprite sprite = net.wolfTec.spriteDb.sprites.$get("FOCUS");
        Element spriteImg = sprite.getImage(net.wolfTec.gameWorkflowData.focusMode);

        int oy = y;
        int ye;
        for (int xe = x + w; x < xe; x++) {
            for (y = oy, ye = y + h; y < ye; y++) {

                if (net.wolfTec.gameWorkflowData.selection.getValue(x, y) >= 0) {

                    // render all phases
                    int n = 0;
                    while (n < 7) {

                        ctx = layerFocus.getContext(n);

                        scx = Constants.TILE_BASE * n;
                        scy = 0;
                        scw = Constants.TILE_BASE;
                        sch = Constants.TILE_BASE;
                        tcx = (x - screenOffsetX) * Constants.TILE_BASE;
                        tcy = (y - screenOffsetY) * Constants.TILE_BASE;
                        tcw = Constants.TILE_BASE;
                        tch = Constants.TILE_BASE;

                        ctx.globalAlpha = 0.6;

                        ctx.drawImage(
                                spriteImg,
                                scx, scy,
                                scw, sch,
                                tcx, tcy,
                                tcw, tch
                        );

                        ctx.globalAlpha = 1;

                        n++;
                    }
                }
            }
        }
    }

    /** */
    public void shiftFocus(MoveCode code) {
        CanvasRenderingContext2D tmpContext = temporaryCanvas.getContext("2d");

        // calculate meta data for shift
        int sx = 0;
        int sy = 0;
        int scx = 0;
        int scy = 0;
        int w = layerFocus.w;
        int h = layerFocus.h;

        switch (code) {
            case LEFT:
                scx += Constants.TILE_BASE;
                w -= Constants.TILE_BASE;
                break;

            case RIGHT:
                sx += Constants.TILE_BASE;
                w -= Constants.TILE_BASE;
                break;

            case UP:
                scy += Constants.TILE_BASE;
                h -= Constants.TILE_BASE;
                break;

            case DOWN:
                sy += Constants.TILE_BASE;
                h -= Constants.TILE_BASE;
                break;
        }

        // update background layers
        int n = 0;
        while (n < 7) {
            tmpContext.clearRect(0, 0, layerFocus.w, layerFocus.h);

            // copy visible content to temp canvas
            tmpContext.drawImage(
                    layerFocus.getLayer(n),
                    scx, scy,
                    w, h,
                    sx, sy,
                    w, h
            );

            // clear original canvas
            layerFocus.clear(n);

            // copy visible content back to the original canvas
            layerFocus.getContext(n).drawImage(temporaryCanvas, 0, 0);

            n++;
        }
    }

    /* Since the time is so low I probably don't need to track it. But it seems memory intensive to pull off,
     * there has to be a less expensive way */
    public void initWeather() {

        //Keeps track of the frequency of a raindrop
        var FREQUENCY = 1;

        //Maximum frame wait per particle
        var MAX = 8;

        //Keeps track of the time
        var time;

        //Keeps track of delta time
        var store;

        //Keeps track of the cap
        var cap;

        //The type of raindrop/snow flake to draw
        var type;

        //The x-axis position of the raindrop/snow flake
        var posx;

        //The y-axis position of the raindrop/snow flake
        var posy;

        var activeGraphic;

        var ball;

        //Holds the graphics for a simple raindrop (cache). Totally hard coded all the values here
        var raindropGfx = document.createElement('canvas');
        ball.width = 10;
        ball.height = 10;

        var raindropCtx = raindropGfx.getContext('2d');
        raindropCtx.strokeStyle = "rgba(255,255,255,0.3)";
        raindropCtx.lineWidth = 1;
        raindropCtx.beginPath();
        raindropCtx.moveTo(0, 0);
        raindropCtx.lineTo(4, 10);
        raindropCtx.stroke();


    }

    public void setWeatherType(weather) {
        time = 0;
        store = 0;
        cap = 50;
        type =[];
        posx =[];
        posy =[];
    }

    public void updateWeather(int delta) {

    }

    public void renderWeather() {
        var ctx = layerEffects.getContext();

        //Tests the speed of each particle for debug mode
        if (Constants.DEBUG) time = (new Date()).getTime();

        //Render particles
        for (var i = 0; i < type.length; i++) {
            if (type[i] == -1)
                continue;

            ctx.drawImage(activeGraphic, posx[i], posy[i], 10 + 5 * type[i], 10 + 5 * type[i]);
        }

        //Finishes the testing of speed for snow particles
        if (Constants.DEBUG) debug.logFine("Quick render of rain... needed " + ((new Date()).getTime() - time) + "ms");
    }
}
