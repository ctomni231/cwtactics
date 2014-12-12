package net.wolfTec.states.factory;

import net.wolfTec.Constants;
import net.wolfTec.application.CustomWarsTactics;
import net.wolfTec.input.InputData;
import net.wolfTec.input.InputType;
import net.wolfTec.states.State;
import net.wolfTec.states.Statemachine;
import net.wolfTec.widgets.UiField;

import org.stjs.javascript.*;
import org.stjs.javascript.Math;
import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

public abstract class States {

    public static void addToStateMachine (Statemachine statemachine) {
        statemachine.addState("NONE", createDrawBackground());
        statemachine.addState("START_SCREEN", createStartScreen());
        statemachine.addState("LOADING_SCREEN", createLoadingScreen());
    }

    @SyntheticType
    public static class DrawScreenData {
        private boolean drawn;
    }

    private static State createDrawBackground() {
        final DrawScreenData stateData = new DrawScreenData();
        State state = new State();

        state.enter = new Callback0() {
            @Override
            public void $invoke() {
                stateData.drawn = false;
            }
        };

        state.update = new Callback2<Integer, InputData>() {
            @Override
            public void $invoke(Integer delta, InputData inputData) {
                if (stateData.drawn) {
                    CustomWarsTactics.gameWorkflow.changeState("LOADING_SCREEN");
                }
            }
        };

        state.render = new Callback1<Integer>() {
            @Override
            public void $invoke(Integer delta) {
                if (!stateData.drawn) {
                    CanvasRenderingContext2D ctx = CustomWarsTactics.renderCtx.layerBG.getContext(Constants.INACTIVE_ID);

                    ctx.fillStyle = "gray";
                    ctx.fillRect(0, 0, CustomWarsTactics.renderCtx.screenWidth, CustomWarsTactics.renderCtx.screenHeight);

                    stateData.drawn = true;
                }
            }
        };

        return state;
    }

    @SyntheticType
    public static class StartScreenData {
        private int time;
        private int maxTime;
        private Element background;
    }

    private static State createStartScreen() {
        final StartScreenData stateData = new StartScreenData();
        final State state = new State();

        stateData.time = 0;
        stateData.maxTime = 5000;
        stateData.background = null;

        final UiField tooltip = new UiField(
                JSGlobal.parseInt(CustomWarsTactics.renderCtx.screenWidth * 0.1, 10),
                JSGlobal.parseInt(CustomWarsTactics.renderCtx.screenHeight * 0.2, 10),
                JSGlobal.parseInt(CustomWarsTactics.renderCtx.screenWidth * 0.8, 10),
                120, "", 10, UiField.STYLE_NORMAL, null
        );

        final UiField button = new UiField(
                JSGlobal.parseInt(CustomWarsTactics.renderCtx.screenWidth * 0.5 - 150, 10),
                JSGlobal.parseInt(CustomWarsTactics.renderCtx.screenHeight * 0.8, 10) - 20,
                300, 40, "START",20, UiField.STYLE_NORMAL, null
        );

        state.enter = new Callback0() {
            @Override
            public void $invoke() {
                stateData.time = 0;

                CustomWarsTactics.renderCtx.layerUI.clear(Constants.INACTIVE_ID);

                // select a random background image
                int numBackgrounds = CustomWarsTactics.spriteDb.sprites.$get("BACKGROUNDS").getNumberOfImages();
                int randBGIndex = JSGlobal.parseInt((int) (org.stjs.javascript.Math.random() * numBackgrounds), 10);
                stateData.background = CustomWarsTactics.spriteDb.sprites.$get("BACKGROUNDS").getImage(randBGIndex);
            }
        };

        state.update = new Callback2<Integer, InputData>() {
            @Override
            public void $invoke(Integer delta, InputData inputData) {

                // action leads into main menu
                if (inputData != null && inputData.key == InputType.ACTION) {
                    CustomWarsTactics.audioHandler.playNullSound();
                    CustomWarsTactics.gameWorkflow.changeState("MAIN_MENU");

                } else {

                    stateData.time += delta;
                    if (stateData.time >= stateData.maxTime) {
                        if (exports.tooltips) {

                            // update random tooltip
                            var randEl = exports.tooltips[parseInt(Math.random() * exports.tooltips.length, 10)];
                            data.tooltip.text = CustomWarsTactics.i18n.forKey(randEl);

                            if (data.tooltip.text.search(/\n/) !== -1) {
                                data.tooltip.text = this.tooltip.text.split("\n");
                            }
                        }

                        stateData.time = 0;
                    }
                }
            }
        };

        state.render = new Callback1<Integer>() {
            @Override
            public void $invoke(Integer integer) {
                if (stateData.background != null) {
                    CustomWarsTactics.renderCtx.layerBG.getContext(Constants.INACTIVE_ID).drawImage(
                            stateData.background, 0, 0, CustomWarsTactics.renderCtx.screenWidth, CustomWarsTactics.renderCtx.screenHeight);
                    stateData.background = null;
                }

                CanvasRenderingContext2D uiCtx = CustomWarsTactics.renderCtx.layerUI.getContext(Constants.INACTIVE_ID);
                button.draw(uiCtx);
                tooltip.draw(uiCtx);
            }
        };

        return state;
    }

    @SyntheticType
    public static class LoadingScreenData {
        private int x;
        private int y;
        private int height;
        private int width;
        private int process;
        private boolean done;
    }

    private static State createLoadingScreen() {
        final LoadingScreenData stateData = new LoadingScreenData();
        final State state = new State();

        stateData.x = 10;
        stateData.y = JSGlobal.parseInt(CustomWarsTactics.renderCtx.screenHeight / 2, 10) - 10;
        stateData.height = 20;
        stateData.width = CustomWarsTactics.renderCtx.screenWidth - 20;
        stateData.process = 0;
        stateData.done = false;

        state.enter = new Callback0() {
            @Override
            public void $invoke() {
                require("./loading").startProcess(
                        function (p) { data.process = p; },
                function () { data.process = 100; }
                );
            }
        };

        state.update = new Callback2<Integer, InputData>() {
            @Override
            public void $invoke(Integer integer, InputData inputData) {
                if (stateData.done) {
                    CustomWarsTactics.gameWorkflow.changeState("START_SCREEN");

                } else if (stateData.process == 100) {
                    stateData.done = true;
                }
            }
        };

        state.render = new Callback1<Integer>() {
            @Override
            public void $invoke(Integer integer) {
                CanvasRenderingContext2D ctx = CustomWarsTactics.renderCtx.layerUI.getContext(Constants.INACTIVE_ID);

                ctx.fillStyle = "white";
                ctx.fillRect(stateData.x, stateData.y, stateData.width, stateData.height );

                ctx.fillStyle = "blue";
                ctx.fillRect(stateData.x, stateData.y, (
                        JSGlobal.parseInt(stateData.width * (stateData.process / 100), 10)), stateData.height);
            }
        };

        return state;
    }
}
