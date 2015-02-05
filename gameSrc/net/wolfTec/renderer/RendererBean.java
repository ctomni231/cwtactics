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

    private UiPositionableGroup layoutGenericMenu;

    private int menuShift;

    private Canvas temporaryCanvas;



    public RendererBean() {
        int canvasW = Constants.TILE_BASE * Constants.SCREEN_WIDTH;
        int canvasH = Constants.TILE_BASE * Constants.SCREEN_HEIGHT;

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

   
}
